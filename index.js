const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

var app = express();
app.use(express.json());
var redis = require('redis').createClient(process.env.REDIS_URL);

app.get('/api/match', (req, res) => redis.get(req.query.id, function(err, reply) {
  if (!err) {
    if (reply == null) {
      res.status(404).send('');
    } else {
      res.send(reply);
    }
  } else {
    res.status(500).send(err);
  }
}));

app.post('/api/match', (req, res) => {
  // validate input
  // generate id
  var id = "1";
  redis.set(id, "{}", function(err, reply) {
    if (!err) {
      redis.sadd('matches', id);
      res.send(id);
    } else {
      res.status(500).send(err);
    }
  });
});

app.get('/api/user', (req, res) => redis.get(req.query.username, function(err, reply) {
  if (!err) {
    if (reply == null) {
      res.status(404).send('');
    } else {
      res.send(reply);
    }
  } else {
    res.status(500).send(err);
  }
}));

app.post('/api/user', (req, res) => {
  // validate input
  if (!req.body || !req.body.username) {
    res.status(400).send("No username specified");
    return;
  }
  redis.get(req.body.username, function(err, reply) {
    if (!err) {
      if (reply == null) {
        // add new user
        var newUser = {'username':req.body.username, 'matches':[]};
        redis.set(req.body.username, JSON.stringify(newUser), function(err, reply) {
          if (!err) {
            res.send("success");
          } else {
            res.status(500).send(err);
          }
        });
      } else {
        res.status(409).send("User already exists with that username");
      }
    } else {
      res.status(500).send(err);
    }
  });
});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
