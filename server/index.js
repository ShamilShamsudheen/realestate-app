require('dotenv').config()
const express = require('express');
const cors = require('cors')
const fs = require('fs');
const path = require('path');
const DxfParser = require('dxf-parser');
const geojson = require('geojson');

const app = express();
app.use(cors());
const port = process.env.PORT || 3001; // change the port if needed
const inputFilePath = process.env.DXF_FILE_PATH; // DXF file path

// Function to convert DXF entities to GeoJSON 
function dxfToGeoJSON(dxfData) {
    const features = [];

    dxfData.entities.forEach(entity => {
        switch (entity.type) {
            case 'LINE':
                features.push({
                    type: 'Feature',
                    geometry: {
                        type: 'LineString',
                        coordinates: [
                            [entity.vertices[0].x, entity.vertices[0].y],
                            [entity.vertices[1].x, entity.vertices[1].y]
                        ]
                    },
                    properties: {}
                });
                break;
            case 'LWPOLYLINE':
            case 'POLYLINE':
                features.push({
                    type: 'Feature',
                    geometry: {
                        type: 'LineString',
                        coordinates: entity.vertices.map(vertex => [vertex.x, vertex.y])
                    },
                    properties: {}
                });
                break;
            // Add more cases as needed for other DXF entities
            default:
                console.warn(`Unhandled entity type: ${entity.type}`);
                break;
        }
    });

    return geojson.parse(features, { Point: ['coordinates'] });
}

// Route to handle DXF to GeoJSON conversion
app.get('/getfile', (req, res) => {

    const parser = new DxfParser();
    fs.readFile(inputFilePath, 'utf-8', (err, data) => {
        if (err) {
            console.error('Error reading DXF file:', err);
            return res.status(500).json({ error: 'Error reading DXF file' });
        }

        let dxfData;
        try {
            dxfData = parser.parseSync(data);
        } catch (parseErr) {
            console.error('Error parsing DXF data:', parseErr);
            return res.status(500).json({ error: 'Error parsing DXF data' });
        }

        const geoJsonData = dxfToGeoJSON(dxfData);

        res.json(geoJsonData);
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
