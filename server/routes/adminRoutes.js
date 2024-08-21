const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const { PythonShell } = require('python-shell');

const uploadsDir = path.join(__dirname, '../uploads'); // Absolute path to uploads directory
const scriptPath = path.join(__dirname, '../scripts'); // Absolute path to scripts directory

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir); // Use absolute path for uploads directory
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.post('/upload', upload.single('dwgFile'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    // Absolute path to the uploaded file
    const filePath = path.join(uploadsDir, path.basename(req.file.path));

    const options = {
        pythonPath: 'C:\\Users\\user\\AppData\\Local\\Programs\\Python\\Python312\\python.exe',
        scriptPath: scriptPath, // Path to the script directory
        args: [filePath] // Absolute path to the uploaded file
    };

    PythonShell.run('extract_coordinates.py', options, (err, results) => {
        
        if (err) {
            console.error('PythonShell error:', err);
            return res.status(500).send('Error processing the file.');
        }

        if (!results || results.length === 0) {
            console.error('No results returned from Python script.');
            return res.status(500).send('No results from Python script.');
        }

        try {
            const plots = JSON.parse(results[0]);
            res.send({ plots });
        } catch (jsonErr) {
            console.error('JSON parsing error:', jsonErr);
            res.status(500).send('Error parsing the results.');
        }
    });
});

router.put('/plots/:id', (req, res) => {
    const plotId = req.params.id;
    const { status } = req.body;
    // Update plot status in the database
    res.json({ message: 'Plot status updated' });
});

module.exports = router;
