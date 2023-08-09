require('dotenv').config();
const express = require('express');
const cors = require('cors');
const {kv} = require('@vercel/kv');

const app = express();

app.use(cors());
app.use(express.json());
const key = 'yourKey'; // define your key name here

app.post('/api/data', async function (req, res) {
    try {
        await kv.append(key, JSON.stringify(req.body) + '++');
        res.send({status: 'SUCCESS', message: 'Data added successfully.'});
    } catch (err) {
        console.log(err);
        res.send({status: 'ERROR', message: 'Failed to add data.'});
    }
});

app.get('/api/data', async function (req, res) {
    try {
        const receivedData = await kv.get(key);
        res.send({
            data: receivedData?.split('++').map((d) => {
                try {
                    return JSON.parse(d)
                } catch (_e) {
                    return d
                }
            }).filter(Boolean)
        });
    } catch (err) {
        console.log(err);
        res.send({status: 'ERROR', message: 'Failed to retrieve data.'});
    }
});

app.listen(3000, function () {
    console.log('The server starts running on port 3000');
});

module.exports = app;
