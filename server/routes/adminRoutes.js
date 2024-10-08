const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const AdmZip = require('adm-zip'); // To handle ZIP extraction
const { default: toGeoJSON } = require('@mapbox/togeojson'); // For KML to GeoJSON conversion
const { DOMParser } = require('xmldom'); // Required by toGeoJSON for parsing XML/KML
const router = express.Router();

const uploadsDir = path.join(__dirname, '../uploads'); // Absolute path to uploads directory

// Ensure the uploads directory exists
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Setup multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir); // Use the absolute path for uploads directory
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        // Accept only .geojson, .zip, and .kml files
        const allowedExtensions = ['.geojson', '.zip', '.kml'];
        if (allowedExtensions.includes(path.extname(file.originalname).toLowerCase())) {
            cb(null, true);
        } else {
            cb(new Error('Only .geojson, .zip, and .kml files are allowed!'), false);
        }
    }
});

// Process a .zip file containing shapefile components
const processZipFile = async (filePath) => {
    const zip = new AdmZip(filePath);
    const zipEntries = zip.getEntries();
    const shapefileData = {};

    // Extract necessary shapefile components (.shp, .shx, .dbf)
    zipEntries.forEach((zipEntry) => {
        const ext = path.extname(zipEntry.entryName).toLowerCase();
        if (ext === '.shp' || ext === '.shx' || ext === '.dbf' || ext === '.prj') {
            shapefileData[ext] = zipEntry.getData(); // Store the buffer for each relevant file by extension
        }
    });

    // Ensure .shp and required components exist
    if (!shapefileData['.shp'] || !shapefileData['.dbf'] || !shapefileData['.shx']) {
        throw new Error('Missing required shapefile components in ZIP');
    }

    // Dynamically import shpjs to use it for conversion
    const { default: shp } = await import('shpjs');
    // Use shpjs to read the shapefile data from the extracted buffers
    const geojsonData = await shp({
        shp: shapefileData['.shp'],
        shx: shapefileData['.shx'],
        dbf: shapefileData['.dbf'],
        prj: shapefileData['.prj'] // Optional, if it exists
    });

    return geojsonData; // Returns the GeoJSON data
};

// POST route to upload and process .geojson, .kml, or .zip files
router.post('/upload', upload.single('geojsonFile'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded or invalid file type.');
    }

    const filePath = path.join(uploadsDir, req.file.filename);
    const ext = path.extname(req.file.originalname).toLowerCase();

    try {
        let geojsonData;

        if (ext === '.zip') {
            // Process ZIP file with Shapefiles
            geojsonData = await processZipFile(filePath);
            const geojsonFilePath = path.join(uploadsDir, `${path.basename(filePath, '.zip')}.geojson`);
            fs.writeFileSync(geojsonFilePath, JSON.stringify(geojsonData));
            res.status(200).json({ message: 'ZIP file uploaded, converted to GeoJSON, and stored successfully!', geojsonData });
        } else {
            // Process .geojson or .kml file
            geojsonData = processFile(filePath);
            res.status(200).json({ message: 'File uploaded and processed successfully!', geojsonData });
        }
    } catch (error) {
        console.error('Error processing file:', error);
        res.status(500).send('Error processing file');
    }
});

// Utility function to convert KML to GeoJSON
const convertKMLToGeoJSON = (kmlContent) => {
    const parser = new DOMParser();
    const kmlDom = parser.parseFromString(kmlContent, 'text/xml');
    return toGeoJSON.kml(kmlDom);
};

// Process a single file (.geojson or .kml)
const processFile = (filePath) => {
    const ext = path.extname(filePath).toLowerCase();
    if (ext === '.geojson') {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } else if (ext === '.kml') {
        const kmlContent = fs.readFileSync(filePath, 'utf8');
        return convertKMLToGeoJSON(kmlContent);
    }
};

// GET route to fetch all .geojson files and their contents
router.get('/data', (req, res) => {
    fs.readdir(uploadsDir, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return res.status(500).send('Error reading directory');
        }

        const geojsonFiles = files.filter(file => file.endsWith('.geojson'));

        const fileReadPromises = geojsonFiles.map(file => {
            return new Promise((resolve, reject) => {
                fs.readFile(path.join(uploadsDir, file), 'utf8', (err, data) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({
                            filename: file,
                            content: JSON.parse(data)
                        });
                    }
                });
            });
        });

        Promise.all(fileReadPromises)
            .then(fileContents => {
                res.json({ files: fileContents });
            })
            .catch(err => {
                console.error('Error reading file content:', err);
                res.status(500).send('Error reading file content');
            });
    });
});

// Sub-plot details 
router.get('/plots/:filename', (req, res) => {
    const {filename} = req.params;
    console.log( filename ,'jjafkljdsklksad')
    fs.readFile(path.join(uploadsDir, `${filename}`), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading file');
        }

        const geojson = JSON.parse(data);
        console.log(geojson,'format sended from');
        
        const plot = geojson

        if (!plot) {
            return res.status(404).send('Plot not found');
        }

        res.json(plot); // Return plot details (properties)
    });
});

// Plot details 
router.get('/plots/:filename/:index', (req, res) => {
    const { index ,filename} = req.params;
    console.log(index ,filename ,'jjafkljdsklksad')
    fs.readFile(path.join(uploadsDir, `${filename}`), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading file');
        }

        const geojson = JSON.parse(data);
        const plot = geojson.features.find((feature, i) => i === parseInt(index));

        if (!plot) {
            return res.status(404).send('Plot not found');
        }

        res.json(plot); // Return plot details (properties)
    });
});


module.exports = router;
