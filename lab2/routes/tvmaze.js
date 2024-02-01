const express = require('express');
const router = express.Router();
const redis = require('redis');
const client = redis.createClient();
const axios = require('axios');
client.connect().then(() => {});
router.get('/', async (req, res) => {
  console.log('Show List not cached');
  let {data} = await axios.get('http://api.tvmaze.com/shows');
  res.render('shows/showlist', {shows: data}, async (err, html) => {
    await client.set('showListHomepage', html);
    res.send(html);
  });
});

router.get('/popularsearches', async (req, res) => {
  //Display the top 10 search terms
  const scores = await client.zRange('searchTerms', 0, 9, {REV: true});

  console.log(scores);
  let upperFirstChar = scores.map((element) => {
    return element.charAt(0).toUpperCase() + element.slice(1);
  });

  res.render('shows/topsearches', {scores: upperFirstChar});
});

router.get('/:id', async (req, res) => {
  //if the show is not in cache, then query the API for the show, render handlebars and
  //cache the HTML and add rendered html to cache
  console.log('Show not in cache');
  let {data} = await axios.get(`http://api.tvmaze.com/shows/${req.params.id}`);
  res.render('shows/show', {show: data}, async (err, html) => {
    await client.set(req.params.id, html);
    res.send(html);
  });
});

router.post('/search', async (req, res) => {
  const searchQuery = req.body.searchTerm;
  if (!searchQuery.trim()) {
    res.render('shows/searchresults', {hasError: true});
    return;
  }
  //first let's check to see if it's in the search term list
  let existsInScoreBoard = await client.zRank(
    'searchTerms',
    searchQuery.toLowerCase()
  );
  if (existsInScoreBoard !== null) {
    console.log('found search term in sorted set');
    // It has been found in the list so let's increment it by 1
    await client.zIncrBy('searchTerms', 1, searchQuery.toLowerCase());
  } else {
    console.log('search term in sorted set NOT found');
    //If the search term is not found in the list, then we know to add it
    await client.zAdd('searchTerms', {
      score: 1,
      value: searchQuery.toLowerCase(),
    });
  }

  //check to see if we have results cached for that search term already
  let exists = await client.exists(searchQuery.toLowerCase());
  if (exists) {
    console.log('Results  in cache');
    //if we do, then send that to the client
    let searchResults = await client.get(searchQuery.toLowerCase());
    console.log('Sending HTML from Redis....');
    res.send(searchResults);
  } else {
    //if we don't, then query the api, render the results and cache them
    console.log('Results not in cache');
    let {data} = await axios.get(
      `http://api.tvmaze.com/search/shows?q=${req.body.searchTerm}`
    );
    res.render('shows/searchresults', {shows: data}, async (err, html) => {
      await client.set(searchQuery.toLowerCase(), html);
      res.send(html);
    });
  }
});

module.exports = router;
