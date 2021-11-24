let express = require('express')
let bodyParser = require('body-parser')
let mongoose = require('mongoose')
let Depoll = require('./models/depoll')
let help = require('./views/json/help.json')
let popHelp = require('./models/popHelp')


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
  res.render('pages/index', {help, popHelp})
})

app.post('/', (req, res) => {
  console.log(req.body)
  let dateEvenement = new Date(req.body.dateEvenement)
  let createdTime = new Date(Date.now())
  let dureeEvenement = parseInt(req.body.dureeEvenement.slice(0,2))*60 + parseInt(req.body.dureeEvenement.slice(3,5))
  let crew = req.body.crew === undefined ? '' : req.body.crew.join(';')
  let typesDechet = req.body.typesDechet === undefined ? '' : req.body.typesDechet.join(';')
  let activites = req.body.activites === undefined ? '' : req.body.activites.join(';')
  let pourquoiIlEnReste = req.body.pourquoiIlEnReste === undefined ? '' : req.body.pourquoiIlEnReste.join(';')
  let depoll = new Depoll({
    createdTime,
    lieu: req.body.lieu,
    ville: req.body.ville,
    dateEvenement,
    dureeEvenement,
    nombreParticipantsWings: req.body.nombreParticipantsWings,
    nombreParticipantsExterne: req.body.nombreParticipantsExterne,
    crew,
    autresStructures: req.body.autresStructures,
    longueur: req.body.longueur,
    surface: req.body.surface,
    typeLieu: req.body.typeLieu,
    typesDechet,
    activites,
    frequentation: req.body.frequentation,
    quantiteDechet: req.body.quantiteDechet,
    pourquoiIlEnReste,
    Commentaire: req.body.Commentaire,
    poidsPlastiqueNonRecy: req.body.poidsPlastiqueNonRecy,
    volumePlastiqueNonRecy: req.body.volumePlastiqueNonRecy,
    poidsPlastiqueRecy: req.body.poidsPlastiqueRecy,
    volumePlastiqueRecy: req.body.volumePlastiqueRecy,
    poidsMetal: req.body.poidsMetal,
    volumeMetal: req.body.volumeMetal,
    poidsVerreEtCeramique: req.body.poidsVerreEtCeramique,
    volumeVerreEtCeramique: req.body.volumeVerreEtCeramique,
    poidsTextile: req.body.poidsTextile,
    volumeTextile: req.body.volumeTextile,
    poidsPapierEtCarton: req.body.poidsPapierEtCarton,
    volumePapierEtCarton: req.body.volumePapierEtCarton,
    poidsBois: req.body.poidsBois,
    volumeBois: req.body.volumeBois,
    poidsCaoutchouc: req.body.poidsCaoutchouc,
    volumeCaoutchouc: req.body.volumeCaoutchouc,
    poidsAutre: req.body.poidsAutre,
    volumeAutre: req.body.volumeAutre,
  })
  depoll.save()
    .then(() => {
      res.status(201)
      res.render('pages/retour')
    })
    .catch(error => {
      // res.status(400).render('pages/index', {help, popHelp})
      res.status(400).json({error})
    });
})
app.listen(8080)
