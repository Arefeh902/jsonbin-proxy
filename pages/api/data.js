import { kv } from '@vercel/kv';

const key = 'yourKey'; // define your key name here

const allowCors = (fn) => async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }
  return await fn(req, res)
}

async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      await kv.append(key, JSON.stringify(req.body) + '++');
      res.status(200).json({ status: 'SUCCESS', message: 'Data added successfully.' });
    } catch (err) {
      console.log(err);
      res.status(500).json({ status: 'ERROR', message: 'Failed to add data.' });
    }
  } else if (req.method === 'GET') {
    try {
      const receivedData = await kv.get(key);
      res.status(200).json({
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
      res.status(500).json({ status: 'ERROR', message: 'Failed to retrieve data.' });
    }
  } else {
    res.status(405).end(); //Method Not Allowed
  }
}

export default allowCors(handler)