const express = require('express');
const router = express.Router();
const fs = require('fs')
const path = require('path')

// Path to the uploads folder
const uploadsDir = path.join(__dirname, '../uploads');
 
router.get('/api/geojson-files', (req, res) => {
    fs.readdir(uploadsDir, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return res.status(500).send('Error reading directory');
        }

        const geojsonFiles = files.filter(file => file.endsWith('.geojson'));

        // Return just the filenames, without their contents
        res.json({
            files: geojsonFiles.map(file => ({
                filename: file,
            }))
        });
    });
});
// Get a specific GeoJSON file by filename
router.get('/api/geojson/:filename', (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(uploadsDir, filename);

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).send('Error reading file');
        }

        // Return the contents of the selected GeoJSON file
        res.json(JSON.parse(data));
    });
});

// Plot details 
router.get('/api/plots/:filename/:index', (req, res) => {
    const { index ,filename} = req.params;
    console.log(index ,filename ,'jjafkljdsklksad')
    fs.readFile(path.join(uploadsDir, `${filename}`), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading file');
        }

        const geojson = JSON.parse(data);
        const plot = geojson.features.find((feature, i) => i === parseInt(index));
        console.log(plot,'file datas');
        
        if (!plot) {
            return res.status(404).send('Plot not found');
        }

        res.json(plot); // Return plot details (properties)
    });
});

module.exports = router;


