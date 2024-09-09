import React, { useState } from 'react';
import axios from 'axios';
import { FaUpload } from 'react-icons/fa';

export const FileUpload = ({ onUploadComplete }) => {
    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            alert("Please select a .geojson file to upload.");
            return;
        }

        const formData = new FormData();
        formData.append('geojsonFile', file); // Ensure this matches the key in your multer upload

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}admin/upload `, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            onUploadComplete(response.data); // Trigger callback on successful upload
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Failed to upload file. Please try again.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center bg-white p-6 rounded-lg shadow-md w-full max-w-md mx-auto mt-10">
            <div className="w-full mb-4">
                <input 
                    type="file" 
                    accept=".geojson" 
                    onChange={handleFileChange} 
                    className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
            </div>
            <button 
                type='button' 
                onClick={handleUpload}
                className="flex items-center justify-center w-full bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700 transition-colors"
            >
                <FaUpload className="mr-2" /> Upload
            </button>
        </div>
    );
};

export default FileUpload;
