import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MapComponent from './MapComponent';

export const UserPanel = () => {
    const [plotData, setPlotData] = useState([]);

    useEffect(() => {
        const fetchPlots = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/geojson');

                // console.log(response.data,"plotData");
                setPlotData(response.data); 
            } catch (error) {
                console.error('Error fetching plot data:', error);
            }
        };
        
        fetchPlots();
    }, []);

    return (
        <div>
            <h1>User Panel</h1>
            <MapComponent plotData={plotData} />
        </div>
    );
};


