const express = require('express')
const app = express()
const compression = require('compression')
const helmet = require('helmet')

app.use(compression())
app.use(helmet())

// home route
app.get('/', (req, res, next) => {
  res.json({ message: 'Welcome to the API' })
  next()
})

// 404 route
app.get('/*', (req, res, next) => {
  res.status(404).json({ message: 'Not Found' })
  next()
})

// set port
app.set('port', process.env.PORT || 4000)

app.listen(app.get('port'), () =>
  console.log('server running on ' + app.get('port'))
)
