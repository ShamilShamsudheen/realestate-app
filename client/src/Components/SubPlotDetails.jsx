import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';  // Import spinner from react-spinners

const baseUrl = process.env.REACT_APP_API_URL;

const SubPlotDetails = () => {
    const { filename } = useParams();
    const [plotDetails, setPlotDetails] = useState(null);
    const [loading, setLoading] = useState(true); // State to handle loading spinner
    const navigate = useNavigate()

    useEffect(() => {
        const fetchPlotDetails = async () => {
            try {
                const response = await axios.get(`${baseUrl}admin/plots/${filename}`);
                setPlotDetails(response.data);
                console.log(response.data, 'format understand');
                setLoading(false); // Stop loading once data is fetched
            } catch (error) {
                console.error('Error fetching plot details:', error);
                setLoading(false); // Stop loading if there's an error
            }
        };

        fetchPlotDetails();
    }, [filename]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <ClipLoader color="#36d7b7" size={150} /> {/* Spinner */}
            </div>
        );
    }

    if (!plotDetails) {
        return <div>No plot details available.</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-xl font-bold mb-4">Plot Details</h2>
            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr>
                        <th className="px-4 py-2 border-b text-left">Index</th>
                        <th className="px-4 py-2 border-b text-left">Name</th>
                        <th className="px-4 py-2 border-b text-left">Status</th>
                        <th className="px-4 py-2 border-b text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {plotDetails.features.map((feature, index) => (
                        <tr key={index}>
                            <td className="px-4 py-2 border-b">{index + 1}</td>
                            <td className="px-4 py-2 border-b font-bold">{feature.properties.subplotName || "N/A"}</td>
                            <td className="px-4 py-2 border-b">{feature.properties.subPlotStatus || "N/A"}</td>
                            <td className="px-4 py-2 border-b">
                            <button
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                                    onClick={() => navigate(`/admin/plot/${filename}/${index}`)} // Navigate to SingleViewPlot
                                >
                                    View
                                </button>
                                {/* <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-700 ml-2">
                                    Edit
                                </button> */}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SubPlotDetails;
