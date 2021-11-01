let express = require('express')
let bodyParser = require('body-parser')
let mongoose = require('mongoose')
let Depoll = require('./models/depoll')


mongoose.connect('mongodb+srv://rogue:turluberlu@warg.w1e1b.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'))

  let app = express()


// Moteur de template
app.set('view engine', 'ejs')

// Middleware
app.use('/assets', express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


// Routes
app.get('/', (req, res) => {
  res.render('pages/index')
})

app.post('/retour', (req, res) => {
  console.log(req.body)
  let dateEvenement = new Date(req.body.dateEvenement)
  let depoll = new Depoll({
    lieu: req.body.lieu,
    ville: req.body.ville,
    dateEvenement: dateEvenement,
    dureeEvenement: req.body.dureeEvenement,
    nombreParticipantsWings: req.body.nombreParticipantsWings,
  })
  depoll.save()
    .then(() => {
      res.status(201)
      res.render('pages/retour')
    })
    .catch(error => {
      res.status(400).json({ error })
    });
})

app.listen(8080)
console.log('test')
