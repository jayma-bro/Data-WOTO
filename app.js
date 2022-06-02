const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const path = require('path')
const history = require('connect-history-api-fallback')

const depollRoutes = require('./routes/depoll')
const statsRoutes = require('./routes/stats')
const crewRoutes = require('./routes/crew')
const crewTypeRoutes = require('./routes/crewType')
const lieuRoutes = require('./routes/lieu')

const app = express()

dotenv.config()

mongoose
  .connect(
    process.env.DB_PREFIX +
      process.env.DB_USER +
      ':' +
      process.env.DB_PASS +
      '@' +
      process.env.DB_HOST +
      '/' +
      process.env.DB_COLLEC +
      '?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'))

// Middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  )
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  next()
})
// app.use((req, res, next) => {
//   if (!req.headers.authorization) {
//     return res
//       .status(401)
//       .send("Pour cette route une clé d'authentification est nécésaire")
//   } else if (req.headers.authorization === process.env.AUT_KEY) {
//     next()
//   } else {
//     return res.status(401).send("La clé d'authentification est pas correct")
//   }
// })

// Routes
app.use('/api/depolls', depollRoutes)
app.use('/api/stats', statsRoutes)
app.use('/api/crews', crewRoutes)
app.use('/api/crew_types', crewTypeRoutes)
app.use('/api/lieux', lieuRoutes)

app.use(history())
app.use(express.static(path.join(__dirname, './dist')))
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './dist'))
})

module.exports = app
