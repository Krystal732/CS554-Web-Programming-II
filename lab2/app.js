import express from 'express';
const app = express();
import configRoutes from './routes/index.js';
import redis from 'redis'
const client = redis.createClient();
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


app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api/rockets', async (req, res, next) => {
  if (req.originalUrl === '/api/rockets') {
    let exists = await client.exists('rocketsList');
    if (exists) {
      console.log('Rockets List from cache');
      let rocketsList = await client.get('rocketsList');
      return res.status(200).json(rocketsList)
    } else {
      next();
    }
  } else {
    next();
  }
});

app.use('/api/rockets/:id', async (req, res, next) => {
  try{
    req.params.id = checkAndTrimString(req.params.id, "rocketID")
  }catch(e){
    return res.status(400).json({error:e})
  }
  if(req.originalUrl !== '/api/rockets/history'){
    let exists = await client.exists(req.params.id);
    if (exists) {
      console.log('Show rocket in Cache');
      let rocket = await client.get(req.params.id); 
      //push to history
      await client.lPush('history', rocket)
      res.status(200).json(rocket)
    } else {
      next();
    }
  }else{
    next()
  }
});

app.use('/api/launches', async (req, res, next) => {
  if (req.originalUrl === '/api/launches') {
    let exists = await client.exists('launchesList');
    if (exists) {
      console.log('Launches List from cache');
      let launchesList = await client.get('launchesList');
      return res.status(200).json(launchesList)
    } else {
      next();
    }
  } else {
    next();
  }
});

app.use('/api/launches/:id', async (req, res, next) => {
  try{
    req.params.id = checkAndTrimString(req.params.id, "launchID")
  }catch(e){
    return res.status(400).json({error:e})
  }
  let exists = await client.exists(req.params.id);
  if (exists) {
    console.log('Show launch in Cache');
    let launch = await client.get(req.params.id); 
    res.status(200).json(launch)
  } else {
    next();
  }
});

app.use('/api/capsules', async (req, res, next) => {
  if (req.originalUrl === '/api/capsules') {
    let exists = await client.exists('capsulesList');
    if (exists) {
      console.log('Capsules List from cache');
      let capsulesList = await client.get('capsulesList');
      return res.status(200).json(capsulesList)
    } else {
      next();
    }
  } else {
    next();
  }
});

app.use('/api/capsules/:id', async (req, res, next) => {
  try{
    req.params.id = checkAndTrimString(req.params.id, "capsuleID")
  }catch(e){
    return res.status(400).json({error:e})
  }
  let exists = await client.exists(req.params.id);
  if (exists) {
    console.log('Show capusle in Cache');
    let capsule = await client.get(req.params.id); 
    res.status(200).json(capsule)
  } else {
    next();
  }
});


configRoutes(app);
app.listen(3000, async () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});
