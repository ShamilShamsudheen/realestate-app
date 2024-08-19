import React, { useEffect, useRef } from "react";
import mapboxgl from 'mapbox-gl';
import axios from 'axios';
import 'mapbox-gl/dist/mapbox-gl.css';


mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;


export const MapComponent = () =>{
    const mapContainerRef = useRef(null);

    useEffect(() => {
        const map = new mapboxgl.Map({
            container:mapContainerRef.current,
            style:'mapbox://styles/mapbox/streets-v11', 
            center:[-98.5, 39.8],
            zoom:3,
        });
        
        axios.get(process.env.REACT_APP_API_URL)
        .then( res => {
            const geoJsonData = res.data;

            //add source data
            map.on('load', ()=>{
                map.addSource('geojson-data' , {
                    type:'geojson',
                    data:geoJsonData,
                })

                map.addLayer({
                    id:'geojson-layer',
                    type:'line',
                    source:'geojson-data',
                    layout:{},
                    paint:{
                        'line-color':'#007cbf',
                        'line-width':2,
                    },
                });
            })
        })
        .catch(error => {
            console.error('Error fetching GeoJSON data:', error);
        });

        return() => map.remove();
    },[])

    return(
        <div ref={mapContainerRef} style={{ width: '100%', height: '500px' }} />
    )
}