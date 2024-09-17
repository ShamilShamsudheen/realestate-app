const express = require('express');
const router = express.Router();
const fs = require('fs')
const path = require('path')

// Path to the uploads folder
const uploadsDir = path.join(__dirname, '../uploads');

// Fetch all GeoJSON files and send their combined content
// router.get('/api/geojson', (req, res) => {
//     fs.readdir(uploadsDir, (err, files) => {
//         if (err) {
//             console.error('Error reading directory:', err);
//             return res.status(500).send('Error reading directory');
//         }

//         // Filter only .geojson files
//         const geojsonFiles = files.filter(file => file.endsWith('.geojson'));

//         // Read the contents of each file and combine them
//         const fileReadPromises = geojsonFiles.map(file => {
//             return new Promise((resolve, reject) => {
//                 fs.readFile(path.join(uploadsDir, file), 'utf8', (err, data) => {
//                     if (err) {
//                         reject(err);
//                     } else {
//                         resolve(JSON.parse(data)); // Directly resolve with the parsed GeoJSON content
//                     }
//                 });
//             });
//         });

//         // Send combined GeoJSON content
//         Promise.all(fileReadPromises)
//             .then(geojsonContents => {
//                 // Merge all geojson contents into a single FeatureCollection if needed
//                 const mergedGeoJSON = {
//                     type: 'FeatureCollection',
//                     features: geojsonContents.flatMap(content => content.features)
//                 };
//                 res.json(mergedGeoJSON); // Send combined GeoJSON content in response
//             })
//             .catch(err => {
//                 console.error('Error reading file content:', err);
//                 res.status(500).send('Error reading file content');
//             });
//     });
// });
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

module.exports = router;


module.exports = router;
