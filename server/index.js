// // server.js
const express = require('express');
const cors = require('cors')
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3001;
app.use(cors());
// Path to your GeoJSON file
const geojsonFilePath = path.join(__dirname, 'data', 'your-geojson-file.geojson');


app.get('/api/geojson', (req, res) => {
    
  fs.readFile(geojsonFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading GeoJSON file:', err);
      res.status(500).send('Error reading GeoJSON file');
      return;
    }
    
    res.json(JSON.parse(data));
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
