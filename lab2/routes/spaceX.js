import Router from 'express';
const router = Router();
import redis from 'redis'
const client = redis.createClient();
import axios from 'axios'
client.connect().then(() => {});

function checkAndTrimString(s, varName) {
  if (typeof s !== "string") {
    throw `${varName || 'provided variable'} is not a string`;
  }
  s = s.trim()
  if(s.length === 0){
      throw `String must not be empty`
  }
  return s
}


router.get('/rockets/history', async (req, res) => {
  let list = await client.lRange("history", 0, 19)
  return res.status(200).json(list)
});


router.get('/rockets/:id', async (req, res) => {
  try{
    req.params.id = checkAndTrimString(req.params.id, "rocketID")
  }catch(e){
    return res.status(400).json({error:e})
  }
  console.log('rocket not in cache');
  let data = undefined
  try{
    data = await axios.get(`https://api.spacexdata.com/v4/rockets/${req.params.id}`);
    let jsonData = JSON.stringify(data.data)
    await client.set(req.params.id, jsonData) //add to cache
    //push data to list
    await client.lPush('history', jsonData)
    return res.status(200).json(jsonData)
  }catch(e){
    return res.status(e.response.status).json({error:e})
  }
});

router.get('/rockets', async (req, res) => {
  console.log('Rockets List not cached');
  let data = undefined
  try{
    data = await axios.get('https://api.spacexdata.com/v4/rockets');
  }catch(e){
    res.status(500).json({error:e})
  }

  let jsonData = JSON.stringify(data.data)
  await client.set('rocketsList', jsonData);
  return res.status(200).json(jsonData)

});


router.get('/launches/:id', async (req, res) => {
  try{
    req.params.id = checkAndTrimString(req.params.id, "launchID")
  }catch(e){
    return res.status(400).json({error:e})
  }
  console.log('launch not in cache');
  let data = undefined
  try{
    data = await axios.get(`https://api.spacexdata.com/v4/launches/${req.params.id}`);
    let jsonData = JSON.stringify(data.data)
    await client.set(req.params.id, jsonData) //add to cache
    return res.status(200).json(jsonData)

  }catch(e){
    return res.status(e.response.status).json({error:e})
  }
});

router.get('/launches', async (req, res) => {
  console.log('Launch List not cached');
  let data = undefined
  try{
    data = await axios.get('https://api.spacexdata.com/v4/launches');
  }catch(e){
    res.status(500).json({error:e})
  }

  let jsonData = JSON.stringify(data.data)
  await client.set('launchesList', jsonData);
  return res.status(200).json(jsonData)

});

router.get('/capsules/:id', async (req, res) => {
  try{
    req.params.id = checkAndTrimString(req.params.id, "capsuleID")
  }catch(e){
    return res.status(400).json({error:e})
  }
  console.log('capsule not in cache');
  let data = undefined
  try{
    data = await axios.get(`https://api.spacexdata.com/v4/capsules/${req.params.id}`);
    let jsonData = JSON.stringify(data.data)
    await client.set(req.params.id, jsonData) //add to cache
    return res.status(200).json(jsonData)
  }catch(e){
    return res.status(e.response.status).json({error:e})
  }
});


router.get('/capsules', async (req, res) => {
  console.log('Capsules List not cached');
  let data = undefined
  try{
    data = await axios.get('https://api.spacexdata.com/v4/capsules');
  }catch(e){
    res.status(500).json({error:e})
  }

  let jsonData = JSON.stringify(data.data)
  await client.set('capsulesList', jsonData);
  return res.status(200).json(jsonData)

});

export default router;
