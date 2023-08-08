const express = require('express');
const cors = require('cors');
const app = express();

let receivedData = [];

app.use(cors());
app.use(express.json());

app.post('/api/data', function(req, res) {
    receivedData.push(req.body);
    res.send({ status: 'SUCCESS', message: 'Data added successfully' });
});

app.get('/api/data', function(req, res) {
    res.send({ data: receivedData });
});

app.listen(3000, function() {
    console.log('The server starts running on port 3000');
});
