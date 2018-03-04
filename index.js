const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

var client = require('redis').createClient(process.env.REDIS_URL);

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/matches', (req, res) => client.smembers('matches'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
