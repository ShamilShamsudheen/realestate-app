import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {FileUpload} from './FileUpload';
import MapComponent from './MapComponent';

export const AdminPanel = () => {
    const [plotData, setPlotData] = useState([]);

    useEffect(() => {
        
        const fetchPlots = async () => {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/plots`);
            setPlotData(response.data.plots);
        };
        fetchPlots();
    }, []);

    const handleUploadComplete = (data) => {
        setPlotData([...plotData, ...data.plots]);

    };

    const handleStatusChange = (plotId, status) => {
        axios.put(`${process.env.REACT_APP_API_URL}/admin/plots/${plotId}`, { status })
            .then(() => {
                setPlotData(plotData.map(plot =>
                    plot.id === plotId ? { ...plot, status } : plot
                ));
            })
            .catch(err => console.error(err));
    };

    return (
        <div>
            <h1>Admin Panel</h1>
            <FileUpload onUploadComplete={handleUploadComplete} />
            <MapComponent plotData={plotData} />
            <table>
                <thead>
                    <tr>
                        <th>Plot ID</th>
                        <th>Status</th>
                        <th>Change Status</th>
                    </tr>
                </thead>
                <tbody>
                    {plotData.map(plot => (
                        <tr key={plot.id}>
                            <td>{plot.id}</td>
                            <td>{plot.status}</td>
                            <td>
                                <select value={plot.status} onChange={(e) => handleStatusChange(plot.id, e.target.value)}>
                                    <option value="AVAILABLE">Available</option>
                                    <option value="SOLD">Sold</option>
                                    <option value="HOLD">Hold</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};


