import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FileUpload } from './FileUpload';
import MapComponent from './MapComponent';

export const AdminPanel = () => {
    const [plotData, setPlotData] = useState([]);

    useEffect(() => {
        const fetchPlots = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}admin/data`);
                // console.log(response.data.files[0].content,"file format");
                const files = response.data.files || [];
                setPlotData(files);  // set plot data
            } catch (error) {
                console.error('Error fetching plot data:', error.message);
            }
        };

        fetchPlots();
        // console.log(plotData,"plot daata");
        
    }, []);

    const handleUploadComplete = (data) => {
        if (Array.isArray(data.plots)) {
            setPlotData((prevPlots) => [...prevPlots, ...data.plots]);
        } else {
            console.error('Invalid plots data structure:', data.plots);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl mb-4">Admin Panel</h1>
            <FileUpload onUploadComplete={handleUploadComplete} />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {plotData.map((file, index) => (
                    <div key={index} className="border p-4">
                        <h2 className="text-xl font-bold">{file.filename}</h2>
                        {/* // <pre className="text-sm overflow-x-auto">
                        //     {JSON.stringify(file.content, null, 2)}  
                        // </pre> */}
                    </div>
                ))}
                {plotData ? (
                    <MapComponent plotData={plotData[0].content} />
                ) : (
                    <p>Loading map data...</p>
                )}
            </div>
        </div>
    );
};
