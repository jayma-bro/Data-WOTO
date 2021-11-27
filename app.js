let express = require('express')
let bodyParser = require('body-parser')
let mongoose = require('mongoose')
let Depoll = require('./models/depoll')
let help = require('./views/json/help.json')
let popHelp = require('./models/popHelp')
const dotenv = require('dotenv')

let app = express()

dotenv.config()

mongoose.connect(process.env.DB_PREFIX + process.env.DB_USER + ':' + process.env.DB_PASS + '@' + process.env.DB_HOST,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'))


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
  let volEstDSL = []
  let provenanceDSL = []
  for(var i = 1; i < parseInt(req.body.nbDechetSpecifique) + 1; i++) {
    if (!(req.body['volEstDS'+i] === undefined)) {
      volEstDSL[i-1] = req.body['volEstDS'+i]
    } else {
      volEstDSL[i-1] = ""
    }
    if (!(req.body['provenanceDSL'+i] === undefined)) {
      provenanceDSL[i-1] = req.body['provenanceDSL'+i]
    } else {
      provenanceDSL[i-1] = ""
    }
  }
  let volEstDS = volEstDSL.join(';')
  let provenanceDS = provenanceDSL.join(';')
  let nomDS = req.body.nomDS === undefined ? '' : req.body.nomDS.join(';')
  let volumeDS = req.body.volumeDS === undefined ? '' : req.body.volumeDS.join(';')
  let descDS = req.body.descDS === undefined ? '' : req.body.descDS.join(';')
  let commentaireDS = req.body.commentaireDS === undefined ? '' : req.body.commentaireDS.join(';')
  let poidsDS = req.body.poidsDS === undefined ? '' : req.body.poidsDS.join(';')
  let nombreDS = req.body.nombreDS === undefined ? '' : req.body.nombreDS.join(';')
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
    commentaire: req.body.commentaire,
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
    bouteilleEnPlastique: req.body.bouteilleEnPlastique,
    bouteilleEnVerre: req.body.bouteilleEnVerre,
    canetteEnMetal: req.body.canetteEnMetal,
    masque: req.body.masque,
    megot: req.body.megot,
    pneu: req.body.pneu,
    appareilMenager: req.body.appareilMenager,
    ballonDeBaudruche: req.body.ballonDeBaudruche,
    batonDeSucette: req.body.batonDeSucette,
    batterie: req.body.batterie,
    boiteDAppats: req.body.boiteDAppats,
    boiteDeMedicaments: req.body.boiteDeMedicaments,
    bouchonEnPlastique: req.body.bouchonEnPlastique,
    briquet: req.body.briquet,
    capsule: req.body.capsule,
    cartoucheDeChasse: req.body.cartoucheDeChasse,
    chaussure: req.body.chaussure,
    contenantAlimentaire: req.body.contenantAlimentaire,
    cordagesEmmeles: req.body.cordagesEmmeles,
    cordageEtFicelle: req.body.cordageEtFicelle,
    cotonTige: req.body.cotonTige,
    filetInf50cm: req.body.filetInf50cm,
    filetSup50cm: req.body.filetSup50cm,
    gobelet: req.body.gobelet,
    jouetEnPlastique: req.body.jouetEnPlastique,
    materielDePeche: req.body.materielDePeche,
    mediaFiltrant: req.body.mediaFiltrant,
    mousse: req.body.mousse,
    pailleEnPlastique: req.body.pailleEnPlastique,
    protectionHygienique: req.body.protectionHygienique,
    sacPlastique: req.body.sacPlastique,
    vaisselleEnPlastique: req.body.vaisselleEnPlastique,
    vetement: req.body.vetement,
    nomDS,
    volumeDS,
    descDS,
    volEstDS,
    provenanceDS,
    commentaireDS,
    poidsDS,
    nombreDS
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

module.exports = app
