const express = require('express');
const router = express.Router();
const axios = require('axios');
const { response } = require('express');
const safetyMap = require('../public/js/safety');
require('dotenv').config();

function getPlacesTypes(lat,lng,rad)
    {
        let API_KEY_GLOBAL = process.env.MAP_API_KEY;
        return new Promise((resolve,reject)=>
            {
                axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + lat + ',' + lng + '&radius=' + rad + '&key=' + API_KEY_GLOBAL)
                .then((response)=>
                    {
                        // let places_types = [];
                        // for(let r in response)
                        //     {
                        //         places_types.push(response.data.results[r].types);
                        //     }
                        // resolve(places_types);
                        try
                            {
                                resolve(response.data.results);
                            }
                        catch(error)
                            {
                                console.log(error);
                            }
                    })
                .catch((error)=>
                    {
                        reject(error);
                    })
            });
    }

function getAllRoutes(src,dest)
    {
        let API_KEY_GLOBAL = process.env.MAP_API_KEY;
        return new Promise((resolve,reject)=>{
        axios.get('https://maps.googleapis.com/maps/api/directions/json?origin=' + src + '&destination=' + dest + '&key=' + API_KEY_GLOBAL + '&alternatives=true&travelMode=DRIVING')
        .then((response)=>
            {
                //console.log(response);
                resolve(response.data.routes);
            })
        .catch((error)=>
            {
                reject(error);
            })
        });
        
    }

function decode_polyline(polyline)
    {
        let index = 0;
        while(index < polyline.length)
            {
                byte=0;
                result=0;
                shift=0;
                do{
                    byte = polyline.charCodeAt(index++)-63;
                    result |= (byte&0x1f)<<shift;
                    shift += 5;
                }while(byte >= 0x20);

                lat_change = ((result & 1) ? ~(result >> 1) : (result >> 1));
                result=0;
                shift=0;

                do{
                    byte = polyline.charCodeAt(index++)-63;
                    result |= (byte&0x01f)<<shift;
                    shift += 5;
                }while(byte >= 0x20);

                lng_change = ((result & 1) ? ~(result >> 1) : (result >> 1));
                
                return [lat_change/100000,lng_change/100000];
            }
    }

async function getCoordinatesOfAllRoutes(src,dest)
    {

        let routes = await getAllRoutes(src,dest);
        let coord_routes = [];
        for(let r in routes)
            {
                let coord_legs = [];
                route = routes[r];
                legs = route.legs;
                for(let l in legs)
                    {
                        steps = legs[l].steps;
                        for(let s in steps)
                            {
                                polyline = steps[s].polyline;
                                coord_legs.push(decode_polyline(polyline.points));
                            }
                    }
                coord_routes.push(coord_legs);
            }
        return coord_routes;
    }

async function getAllPlaces(src,dest){
    return new Promise(async (resolve,reject)=>{
        let places = [];
        try
            {
                let res = await getCoordinatesOfAllRoutes(src,dest);
                //console.log(res);
                for(r in res)
                    {
                        let tempArr = new Set();
                        route = res[r];
                        for(l in route)
                            {
                                leg = route[l];
                                //console.log(leg);
                                let y = await getPlacesTypes(leg[0],leg[1],30);
                                
                                for( x in y)
                                    {
                                        for( z in y[x].types)
                                            {
                                                tempArr.add(y[x].types[z]);
                                            }
                                    }
                            }
                            places.push(Array.from(tempArr));
                    }
                    resolve(places);
            }
        catch(error)
            {
                reject(error);
            }
    })
}

router.get('/',(req,res)=>{
    let src = req.query.src;
    let dest = req.query.dest;
    console.log(req.query.src);
    console.log(req.query.dest);

    let API_KEY_GLOBAL = process.env.MAP_API_KEY;

    // let polylines = new Array();
    // axios.get('https://maps.googleapis.com/maps/api/directions/json?origin=' + src + '&destination=' + dest + '&key=' + API_KEY + '&alternatives=true&travelMode=DRIVING')
    // .then((response)=>{
    //     let routes=response.data.routes;
    //     //polylines is the encoded path
    //     for(let i=0;i<routes.length;i++)
    //     polylines[i]=routes[i].overview_polyline.points;

    //     for(let i=0;i<polylines.length;i++){
    //         let score = getScore(polylines[i]);
    //         console.log(score);
    //     }
    //     res.render('map',{src: req.query.src,dest: req.query.dest,safety: req.query.safety,entertainment: req.query.entertainment});
    // })
    // .catch((error)=>{
    //     console.log(error);
    // });

    let arr = getAllPlaces(src,dest);
    arr
        .then((allPlaces)=>{

            console.log(allPlaces);

            // let finalMap = ;
            // //console.log(typeof(safety));
            
            // if(safety == "true"){
            //         finalMap = safetyMap;
            //         console.log("safety");
            //     }
            // else{
            //         finalMap = entertainmentMap;
            //         console.log("entertainment");
            //     }

            let results = [0];
            for(let i=0;i<allPlaces.length;i++)
                {
                    let score = 0;
                    for(r in allPlaces[i])
                    score = score + (safetyMap.get(allPlaces[i][r])===undefined?0:safetyMap.get(allPlaces[i][r]));
                    console.log(score);
                    results.push(score);
                }

                let index = 0,
                maxScore = -10000;
            for(r in results)
                {
                    if(results[r]>maxScore)
                        {
                            maxScore = results[r];
                            index = r;
                        }
                }

            res.render('map',{src: req.query.src,dest: req.query.dest,index: index-1,API_KEY: API_KEY_GLOBAL});
        })
        .catch((error)=>{
            console.log(error);
            res.status(500).send("Internal Server Error");
        })
        
    });
    //res.send("You for route?");

module.exports = router;