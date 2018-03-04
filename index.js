const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

var app = express();
var redis = require('redis').createClient(process.env.REDIS_URL);

app.get('/api/matches', (req, res) => redis.smembers('matches', function(err, reply) {
  if (!err) {
    res.send(reply);
  } else {
    res.status(500).send('error: ' + err);
  }
}));

app.get('/api/match', (req, res) => redis.get(req.query.id, function(err, reply) {
  if (!err) {
    if (reply == null) {
      res.status(404).send("");
    } else {
      res.send(reply);
    }
  } else {
    res.status(500).send('error: ' + err);
  }
}));

app.put('/api/match', (req, res) => {
  // validate input
  // generate id
  var id = "1";
  redis.set(id, "{}", function(err, reply) {
    if (!err) {
      redis.sadd('matches', id);
      res.send(id);
    } else {
      res.status(500).send("error: " + err);
    }
  });
});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
