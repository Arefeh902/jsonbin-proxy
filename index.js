const express = require('express');
const cors = require('cors');
const { kv } = require('@vercel/kv');

const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/data', async function(req, res) {
    let key = 'yourKey'; // define your key name here
    try {
        await kv.append(key, JSON.stringify(req.body) + ',');
        res.send({ status: 'SUCCESS', message: 'Data added successfully.' });
    } catch(err) {
        console.log(err);
        res.send({ status: 'ERROR', message: 'Failed to add data.' });
    }
});

app.get('/api/data', async function(req, res) {
    let key = 'yourKey'; // the same key name you used in POST request
    try {
        let dataBlobs = (await kv.get(key)).split(',');
        let receivedData = dataBlobs.map(JSON.parse).filter(Boolean); // filter to remove any empty strings
        res.send({ data: receivedData });
    } catch(err) {
        console.log(err);
        res.send({ status: 'ERROR', message: 'Failed to retrieve data.' });
    }
});

app.listen(3000, function() {
    console.log('The server starts running on port 3000');
});

module.exports = app;
