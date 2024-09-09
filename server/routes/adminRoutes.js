const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
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
        // Accept only .geojson files
        if (path.extname(file.originalname) === '.geojson') {
            cb(null, true);
        } else {
            cb(new Error('Only .geojson files are allowed!'), false);
        }
    }
});

// POST route to upload a .geojson file
router.post('/upload', upload.single('geojsonFile'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded or invalid file type.');
    }
    // File is saved successfully to the uploads directory
    res.status(200).json({ message: 'File uploaded successfully!', filename: req.file.filename });
});

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

module.exports = router;
