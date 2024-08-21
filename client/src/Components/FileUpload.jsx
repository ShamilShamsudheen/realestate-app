import React, { useState } from 'react';
import axios from 'axios';

export const FileUpload = ({ onUploadComplete }) => {
    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append('dwgFile', file);

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/admin/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            onUploadComplete(response.data);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button className='border border-spacing-1 border-red-50 border-black   ' type='button' onClick={handleUpload}>Upload</button>
            
        </div>
    );
};


