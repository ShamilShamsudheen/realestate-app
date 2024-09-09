const express = require('express');
const router = express.Router();
const fs = require('fs')
const path = require('path')

const geojsonFilePath = path.join(__dirname, '../data', '1725537161175-KUNDARA.geojson');


// Fetch plots for the user view
router.get('/api/geojson', (req, res) => {
    
    fs.readFile(geojsonFilePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading GeoJSON file:', err);
        res.status(500).send('Error reading GeoJSON file');
        return;
      }
      res.json(JSON.parse(data));
    });
  });

module.exports = router;
