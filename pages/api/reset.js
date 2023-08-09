import { kv } from '@vercel/kv';

const key = 'yourKey'; // define your key name here

export default async function handler(req, res) {
  kv.del(key)
}
