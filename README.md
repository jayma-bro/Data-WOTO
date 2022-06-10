
# Data-WOTO
Dépôt du suivie de dépollution de l'association [Wings Of The Ocean](https://www.wingsoftheocean.com/).
donc ce site regroupe pour l'instant à la fois l'enregistrement des données par un formulaire et une API, mais aussi la visualisation de ces données.

ce dépôt regroue à la fois le Frontend et le Backend.
le site est disponible à [cette adresse](https://data-woto.herokuapp.com/)
## les API
toutes les APIs commencent par la même url qui est celle du site suivi de 'api' :
``https://data-woto.herokuapp.com/api/``

### Index
- [Depolls](#Depolls)
	- [GET](#GET:-/depolls/{Id})
	- [GET array](#GET:-/depolls/array/{crewId})
	- [PUT](#PUT:-/depolls/{Id})
	- [DELETE](#DELETE:-/depolls/{Id})
	- [POST](#POST:-/depolls/)
- [Lieux](#Lieux)
	- [GET](#GET:-/lieux/{Id})
	- [PUT](#PUT:-/lieux/{Id})
	- [DELETE](#DELETE:-/lieux/{Id})
	- [POST](#POST:-/lieux/)
- [Crew](#Crew)
	- [GET](#GET:-/crews/{Id})
	- [PUT](#PUT:-/crews/{Id})
	- [DELETE](#DELETE:-/crews/{Id})
	- [POST](#POST:-/crews/)
- [Crew Type](#Crew-Type)
	- [GET](#GET:-/crew_types/{Id})
- [Dechet Specifiques](#Dechet-Specifiques)
	- [GET](#GET:-/dechet_specifiques/{Id})
	- [PUT](#PUT:-/dechet_specifiques/{Id})
	- [DELETE](#DELETE:-/dechet_specifiques/{Id})
	- [POST](#POST:-/dechet_specifiques/)
### Depolls
#### GET: /depolls/{Id}
pour récupérer les données tel qu'elles sont stocké dans la base de donnée
pour chaque valeur qui appel une autre table, l'element correspondant est affiché
##### **Request**
**URL param**: ``Id`` pour ne récupérer qu'une seul depoll (facultatif)
##### **Response**
**Body type**: ``application/json``
```json
{
	"_id": ObjectId,
	"createdAt": Date,
	"updatedAt": Date,
	"relecture": Boolean,
	"lieuId": {
		"_id": ObjectId,
		"createdTime": Date,
		"lieu": String,
		"ville": String,
		"localisation": [Number],
		"polyline": [[Number, Number]],
		"polygon": [[Number, Number]],
		"pays": String,
		"longueur": Number,
		"surface": Number,
		"typeLieu": String
	},
	"dateEvenement": Date,
	"dureeEvenement": Number,
	"nombreParticipantsWings": Number,
	"nombreParticipantsExterne": Number,
	"crewId": [ {
		"_id": ObjectId,
		"createdTime": Date,
		"crewName": String,
		"crewTypeId": {
			"_id": ObjectId,
			"name": String,
			"value": String
		},
	} ],
	"autresStructures": [String],
	"typesDechet": [String],
	"activites": [String],
	"frequentation": String,
	"quantiteDechet": String,
	"pourquoiIlEnReste": [String],
	"commentaire": String,
	"dechetQuantitatifPoids": {
		"poidsPlastiqueNonRecy": Number,
		"poidsPlastiqueRecy": Number,
		"poidsMetal": Number,
		"poidsVerreEtCeramique": Number,
		"poidsTextile": Number,
		"poidsPapierEtCarton": Number,
		"poidsBois": Number,
		"poidsCaoutchouc": Number,
		"poidsAutre": Number
	},
	"dechetQuantitatifVolume": {
		"volumePlastiqueNonRecy": Number,
		"volumePlastiqueRecy": Number,
		"volumeMetal": Number,
		"volumeVerreEtCeramique": Number,
		"volumeTextile": Number,
		"volumePapierEtCarton": Number,
		"volumeBois": Number,
		"volumeCaoutchouc": Number,
		"volumeAutre": Number
	},
	"dechetIndicateur": { Map_of: Number },
	"dechetSpecifiqueId": [ {
		"_id": ObjectId,
		"nom": String,
		"volume": Number,
		"desc": String,
		"volEst": String,
		"provenance": [String],
		"commentaire": String,
		"poids": Number,
		"nombre": Number
	} ],
	"polyline": [[Number, Number]],
	"polygon": [[Number, Number]],
	"longueur": Number,
	"surface": Number
}
```

#### GET: /depolls/array/{crewId}
permet d'avoir toutes les données dans un seul objet simple sans arborésence (pratique pour exporter en exel)
##### **Request**
**URL param**: ``crewId`` pour ne récupérer toutes les dépoll d'un même crew de depoll (facultatif)
##### **Response**
**Body type**: ``application/json``
```json
{
	"id": ObjectId,
	"createdAt": Date,
	"relecture": Boolean,
	"dateEvenement": Date,
	"dureeEvenement": Number,
	"lieu": String,
	"localisation": String,
	"ville": String,
	"pays": String,
	"longueur": Number,
	"surface": Number,
	"typeLieu": String,
	"nombreParticipantsWings": Number,
	"nombreParticipantsExterne": Number,
	"autresStructures": String,
	"typesDechet": String,
	"activites": String,
	"frequentation": String,
	"quantiteDechet": String,
	"pourquoiIlEnReste": String,
	"commentaire": String,
	"poidsPlastiqueNonRecy": Number,
	"poidsPlastiqueRecy": Number,
	"poidsMetal": Number,
	"poidsVerreEtCeramique": Number,
	"poidsTextile": Number,
	"poidsPapierEtCarton": Number,
	"poidsBois": Number,
	"poidsCaoutchouc": Number,
	"poidsAutre": Number,
	"volumePlastiqueNonRecy": Number,
	"volumePlastiqueRecy": Number,
	"volumeMetal": Number,
	"volumeVerreEtCeramique": Number,
	"volumeTextile": Number,
	"volumePapierEtCarton": Number,
	"volumeBois": Number,
	"volumeCaoutchouc": Number,
	"volumeAutre": Number,
	"crewName": String,
	"crewType": String,
	"DSnom": String,
	"DSvolume": String,
	"DSdesc": String,
	"DSvolEst": String,
	"DSprovenance": String,
	"DScommentaire": String,
	"DSpoids": String,
	"DSnombre": String
}
```

#### PUT: /depolls/{Id}
pour faire une modification sur une depoll deja enregistré
##### **Request**
**URL param**: ``Id`` pour définir la dépoll à modifier
**HEADER Authorization**: ``clé`` il faut renseigner la clé d'authorisation
**Body type**: ``application/json`` il faut renseigner les champs à modifier
**Exemple**:
```json
{
	"updatedAt": Date.now(),
	"dureeEvenement": 120,
	"autresStructures": ["MerTerre"]
}
```
##### **Response**
**Body type**: ``application/json``
la dépollution modifié est retourné

#### DELETE: /depolls/{Id}
pour supprimer une dépollution
##### **Request**
**URL param**: ``Id`` pour définir la dépoll à modifier
**HEADER Authorization**: ``clé`` il faut renseigner la clé d'authorisation
##### **Response**
**Body type**: ``application/json``
la dépollution qui à été supprimé

#### POST: /depolls/
pour ajouter une nouvelle dépollution
##### **Request**
**Body type**: ``application/json`` toutes les informations de la depoll
```json
{
	"lieuId": ObjectId, // requis
	"dateEvenement": Date, // requis
	"dureeEvenement": Number, // requis
	"nombreParticipantsWings": Number,
	"nombreParticipantsExterne": Number,
	"crewId": [ ObjectId ], // requis
	"autresStructures": [String],
	"typesDechet": [String],
	"activites": [String],
	"frequentation": String,
	"quantiteDechet": String,
	"pourquoiIlEnReste": [String],
	"commentaire": String,
	"dechetQuantitatifPoids": {
		"poidsPlastiqueNonRecy": Number,
		"poidsPlastiqueRecy": Number,
		"poidsMetal": Number,
		"poidsVerreEtCeramique": Number,
		"poidsTextile": Number,
		"poidsPapierEtCarton": Number,
		"poidsBois": Number,
		"poidsCaoutchouc": Number,
		"poidsAutre": Number
	},
	"dechetQuantitatifVolume": {
		"volumePlastiqueNonRecy": Number,
		"volumePlastiqueRecy": Number,
		"volumeMetal": Number,
		"volumeVerreEtCeramique": Number,
		"volumeTextile": Number,
		"volumePapierEtCarton": Number,
		"volumeBois": Number,
		"volumeCaoutchouc": Number,
		"volumeAutre": Number
	},
	"dechetIndicateur": { Map_of: Number },
	"dechetSpecifiqueId": [ ObjectId ],
	"polyline": [[Number, Number]],
	"polygon": [[Number, Number]],
	"longueur": Number,
	"surface": Number
}
```
##### **Response**
**Body type**: ``application/json``
petit méssage de confirmation

### Lieux
#### GET: /lieux/{Id}
pour récupérer les données tel qu'elles sont stocké dans la base de donnée
##### **Request**
**URL param**: ``Id`` pour ne récupérer qu'un seul lieu (facultatif)
##### **Response**
**Body type**: ``application/json``
```json
{
	"_id": ObjectId,
	"createdTime": Date,
	"lieu": String,
	"ville": String,
	"localisation": [Number],
	"polyline": [[Number, Number]],
	"polygon": [[Number, Number]],
	"pays": String,
	"longueur": Number,
	"surface": Number,
	"typeLieu": String
}
```


#### PUT: /lieux/{Id}
pour faire une modification sur un lieu deja enregistré
##### **Request**
**URL param**: ``Id`` pour définir le lieu à modifier
**HEADER Authorization**: ``clé`` il faut renseigner la clé d'authorisation
**Body type**: ``application/json`` il faut renseigner les champs à modifier
**Exemple**:
```json
{
	"lieu": "chemin des olivier",
	"longueur": 130
}
```
##### **Response**
**Body type**: ``application/json``
le lieu modifié est retourné

#### DELETE: /lieux/{Id}
pour supprimer un lieu
##### **Request**
**URL param**: ``Id`` pour définir le lieu à modifier
**HEADER Authorization**: ``clé`` il faut renseigner la clé d'authorisation
##### **Response**
**Body type**: ``application/json``
le lieu qui à été supprimé

#### POST: /lieux/
pour ajouter un nouveau lieu
##### **Request**
**Body type**: ``application/json`` toutes les informations du lieu
```json
{
	"lieu": String, // requis
	"ville": String,
	"localisation": [Number], // requis
	"polyline": [[Number, Number]], // requis
	"polygon": [[Number, Number]], // requis
	"pays": String,
	"longueur": Number,
	"surface": Number, // requis
	"typeLieu": String // requis
}
```
##### **Response**
**Body type**: ``application/json``
petit message de confirmation, et le lieu renseigné

### Crew
#### GET: /crews/{Id}
pour récupérer les données tel qu'elles sont stocké dans la base de donnée
le type des crew est directement renseigné
##### **Request**
**URL param**: ``Id`` pour ne récupérer qu'un seul crew (facultatif)
##### **Response**
**Body type**: ``application/json``
```json
{
	"_id": ObjectId,
	"createdTime": Date,
	"crewName": String,
	"crewTypeId": {
		"_id": ObjectId,
		"name": String,
		"value": String
}
```

#### PUT: /crews/{Id}
pour faire une modification sur un crew deja enregistré
##### **Request**
**URL param**: ``Id`` pour définir le crew à modifier
**HEADER Authorization**: ``clé`` il faut renseigner la clé d'authorisation
**Body type**: ``application/json`` il faut renseigner les champs à modifier
**Exemple**:
```json
{
	"crewName": "Avignon"
}
```
##### **Response**
**Body type**: ``application/json``
le crew modifié est retourné

#### DELETE: /crews/{Id}
pour supprimer un crew
##### **Request**
**URL param**: ``Id`` pour définir le crew à modifier
**HEADER Authorization**: ``clé`` il faut renseigner la clé d'authorisation
##### **Response**
**Body type**: ``application/json``
le crew qui à été supprimé

#### POST: /crews/
pour ajouter un nouveau crew
##### **Request**
**Body type**: ``application/json`` toutes les informations du crew
```json
{
	"crewName": String, // requis
	"crewTypeId": ObjectId // requis
}
```
##### **Response**
**Body type**: ``application/json``
petit message de confirmation, et le crew renseigné

### Crew Type
#### GET: /crew_types/{Id}
pour récupérer les données tel qu'elles sont stocké dans la base de donnée
##### **Request**
**URL param**: ``Id`` pour ne récupérer qu'un seul type de crew (facultatif)
##### **Response**
**Body type**: ``application/json``
```json
{
	"_id": ObjectId,
	"name": String,
	"value": String
}
```

### Dechet Specifiques
#### GET: /dechet_specifiques/{Id}
pour récupérer les données tel qu'elles sont stocké dans la base de donnée
##### **Request**
**URL param**: ``Id`` pour ne récupérer qu'un seul Dechet Specifique (facultatif)
##### **Response**
**Body type**: ``application/json``
```json
{
	"_id": ObjectId,
	"nom": String,
	"volume": Number,
	"desc": String,
	"volEst": String,
	"provenance": [String],
	"commentaire": String,
	"poids": Number,
	"nombre": Number
}
```


#### PUT: /dechet_specifiques/{Id}
pour faire une modification sur un Dechet Specifique deja enregistré
##### **Request**
**URL param**: ``Id`` pour définir le Dechet Specifique à modifier
**HEADER Authorization**: ``clé`` il faut renseigner la clé d'authorisation
**Body type**: ``application/json`` il faut renseigner les champs à modifier
**Exemple**:
```json
{
	"commentaire": "trouvé dans le fossé",
	"poids": 20,
	"nombre": 4
}
```
##### **Response**
**Body type**: ``application/json``
le Dechet Specifique modifié est retourné

#### DELETE: /dechet_specifiques/{Id}
pour supprimer un Dechet Specifique
##### **Request**
**URL param**: ``Id`` pour définir le Dechet Specifique à modifier
**HEADER Authorization**: ``clé`` il faut renseigner la clé d'authorisation
##### **Response**
**Body type**: ``application/json``
le Dechet Specifique qui à été supprimé

#### POST: /dechet_specifiques/
pour ajouter un nouveau Dechet Specifique
##### **Request**
**Body type**: ``application/json`` toutes les informations du Dechet Specifique
```json
{
	"nom": String, // requis
	"volume": Number, // requis
	"desc": String,
	"volEst": String, // requis
	"provenance": [String],
	"commentaire": String,
	"poids": Number,
	"nombre": Number
}
```
##### **Response**
**Body type**: ``application/json``
petit message de confirmation, et le Dechet Specifique renseigné