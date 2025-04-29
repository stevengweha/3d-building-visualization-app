# 🏢 3D Building Visualization App

Application web interactive pour visualiser en 3D les données énergétiques des bâtiments en France.  
Affichage cartographique, classes DPE, estimation des GES, et moteur IA pour enrichissement des données.

## 🚀 Fonctionnalités principales

- 🌍 Carte 3D interactive via Three.js + Mapbox  
- 🎨 Coloration par classe DPE (A à G)  
- 🔎 Infobulles : consommation, surface, GES, année, DPE  
- 📁 Chargement de fichiers GeoJSON  
- 🤖 Module IA Node.js pour traitement ou enrichissement  
- 🔧 Architecture modulaire & conteneurisée (Docker)  

## 🧱 Structure du projet

```
3d-building-visualization-app/
├── backend/          # Serveur Express (API + IA)
│   ├── server.js
│   ├── Dockerfile.backend
│   └── IA/           # Module IA personnalisé
│       └── recoveD.mjs
├── src/         # Application React + Three.js
│   ├── index.html
│   └── Dockerfile.frontend
├── data/             # Données GeoJSON
│   ├── dpe-france.geojson
│   └── ...
├── docker-compose.yml
```

## ⚙️ Technologies

### Frontend
- React (TypeScript)
- Vite
- Three.js pour le rendu 3D
- Mapbox GL JS pour la cartographie

### Backend
- Node.js 18
- Express.js
- Mysql + IA

### IA
- Module en ES Module (.mjs) compatible avec Node.js
- Nécessite `"type": "module"` dans package.json

### Données
- `data/dpe-france.geojson` : principaux bâtiments
- `data/consommation-tertiaire-activite.geojson`
- `data/operat_data.geojson`


##  recuperer le code de l'application

```bash
git clone https://server-rtit-consulting.com/billyan/skills4mind.git
cd 3d-building-visualization-app
git checkout steve-app-v1

```


## 🐳 Utilisation avec Docker

Assurez-vous d’avoir Docker installé.

## 🛠️ Initialisation de la base de données

Si vous utilisez XAMPP/WAMP avec MySQL :

1. Assurez-vous que le serveur MySQL fonctionne (localhost, port 3306 par défaut)
2. Modifiez les identifiants dans `backend/setupDB.js` si nécessaire
3. Exécutez le script de création :

```bash
node setupDB.js
```
Cela va :
- Créer une base de données `dpe-france`
- Créer les tables nécessaires


si il y a une erreur, ouvrez un terminal et faites :

```bash
npm install mysql2
```
ou 

```bash
npm install mysql
```


Insérer automatiquement les données GeoJSON

```bash
node insertDataJSON.mjs
```

la base de donnees est cree et les donnees sont pret a l'emploi

### Lancer l’application

```bash
# construction des images Docker
docker-compose build
```

en suite 

```bash
# Démarrage des contenneur
docker-compose up
```

Services disponibles :
- Frontend : http://localhost:5173  
- Backend API : http://localhost:5000  
- IA (si activée) : http://localhost:5000/ia  








## 🔍 Commandes utiles en développement

### Frontend

```bash
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install
node server.js
```

### Module IA

```bash
cd backend/IA
node recoveD.mjs
```

## 📝 Astuces techniques

### Utilisation des ESModules

Si vous obtenez cette erreur :

```
SyntaxError: Cannot use import statement outside a module
```

Ajoutez `"type": "module"` dans le fichier `backend/package.json` :

```json
{
  "type": "module",
  ...
}
```

Et utilisez `.mjs` comme extension pour les fichiers qui utilisent `import`.

## 👨‍💻 Auteurs

- Pierre Steve NGWEHA PENI – Développeur principal  
- Bill Yann TUENKAM – Contributeur  
- Izac Tiote – Contributeur  

## 📄 Licence

MIT
