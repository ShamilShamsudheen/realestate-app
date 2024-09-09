const express = require('express');
const cors = require('cors')
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3001;
app.use(cors());
// Path GeoJSON file
const geojsonFilePath = path.join(__dirname, 'data', 'your-geojson-file.geojson');

const userRoute = require('./routes/userRoutes');
const adminRoute = require('./routes/adminRoutes');


app.use('/user/',userRoute);
app.use('/admin/',adminRoute);  

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
