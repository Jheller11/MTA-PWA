const express = require('express')
const app = express()
const compression = require('compression')
const helmet = require('helmet')
const request = require('request')
const GtfsRealtimeBindings = require('gtfs-realtime-bindings')
require('dotenv').config()

// require middleware
app.use(compression())
app.use(helmet())

// get subway times from mta and deliver to frontend
app.get('/refresh', async (req, res, next) => {
  request(
    {
      method: 'GET',
      url: `http://datamine.mta.info/mta_esi.php?key=${
        process.env.MTA_KEY
      }&feed_id=1`,
      encoding: null
    },
    (error, response, body) => {
      if (!error && response.statusCode == 200) {
        var feed = GtfsRealtimeBindings.FeedMessage.decode(body)
        console.log(feed.entity[0].trip_update.stop_time_update)
      }
    }
  )
})

// home route
app.get('/', (req, res, next) => {
  res.json({ message: 'Welcome to the API' })
})

// 404 route
app.get('/*', (req, res, next) => {
  res.status(404).json({ message: 'Not Found' })
})

// set port
app.set('port', process.env.PORT || 4000)

app.listen(app.get('port'), () =>
  console.log('server running on ' + app.get('port'))
)
