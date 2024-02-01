const express = require('express');
const app = express();
const static = express.static(__dirname + '/public');
const configRoutes = require('./routes');
const exphbs = require('express-handlebars');
const redis = require('redis');
const client = redis.createClient();
client.connect().then(() => {});

const handlebarsInstance = exphbs.create({
  defaultLayout: 'main'
  // Specify helpers which are only registered on this instance.
});

app.use('/public', static);
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/shows', async (req, res, next) => {
  if (req.originalUrl === '/shows') {
    let exists = await client.exists('showListHomepage');
    if (exists) {
      //if we do have it in cache, send the raw html from cache
      console.log('Show List from cache');
      let showsHomePage = await client.get('showListHomepage');
      console.log('Sending HTML from Redis....');
      res.send(showsHomePage);
      return;
    } else {
      next();
    }
  } else {
    next();
  }
});

app.use('/shows/:id', async (req, res, next) => {
  //lets check to see if we have the show detail page for this show in cache
  if (
    req.originalUrl !== '/shows/search' &&
    req.originalUrl !== '/shows/popularsearches'
  ) {
    let exists = await client.exists(req.params.id);
    if (exists) {
      //if we do have it in cache, send the raw html from cache
      console.log('Show in Cache');
      let showDetailPage = await client.get(req.params.id);
      console.log('Sending HTML from Redis....');
      res.send(showDetailPage);
    } else {
      next();
    }
  } else {
    next();
  }
});

app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

configRoutes(app);
app.listen(3000, async () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});
