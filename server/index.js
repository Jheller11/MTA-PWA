const express = require('express')
const app = express()
const compression = require('compression')
const helmet = require('helmet')
const gtfs = require('gtfs')
const mongoose = require('mongoose')
const config = require('./db/config.json')
require('dotenv').config()

// require middleware
app.use(compression())
app.use(helmet())

mongoose.connect('mongodb://localhost/gtfs', { useNewUrlParser: true })

// get subway times from mta and deliver to frontend
app.get('/refresh', async (req, res, next) => {
  gtfs
    .import(config)
    .then(() => {
      console.log('Import Successful')
      return mongoose.connection.close()
    })
    .catch(err => console.log(err))
  res.json({ message: 'refresh' })
})

// home route
app.get('/', (req, res, next) => {
  gtfs
    .getStoptimes({
      agency_key: 'MTA',
      stop_id: '230N'
    })
    .then(stoptimes => {
      res.json(stoptimes)
    })
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
