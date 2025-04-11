# 3D Building Visualization App

Application web interactive pour visualiser des données de bâtiments en 3D avec des informations sur la consommation énergétique.

## Fonctionnalités principales

### Visualisation des bâtiments et DPE

L'application affiche les bâtiments sur une carte 3D avec :
- **Couleurs selon la classe énergétique** :
  - A (vert) à G (marron)
  - Taille des marqueurs proportionnelle à la consommation
- **Infobulles détaillées** incluant :
  - Consommation énergétique (kWh/m²/an)
  - Estimation des gaz à effet de serre
  - Surface thermique
  - Année de construction
  - Date du DPE

### Données utilisées
- **Fichier GeoJSON principal** : `data/dpe-france.geojson`
  - Contient toutes les informations DPE
  - Structure 3D des bâtiments
- **Données complémentaires** :
  - `data/consommation-tertiaire-activite.geojson`
  - `data/operat_data.geojson`

### Navigation interactive
- Vue 3D avec contrôle de la caméra
- Barre de recherche intégrée
- Zoom et rotation des bâtiments

## Technologies utilisées

- Frontend:
  - React + TypeScript
  - Vite (build tool)
  - Three.js (rendu 3D)
  - Mapbox (fond de carte)
  
- Backend:
  - Node.js
  - Express

- Données:
  - GeoJSON (consommation énergétique, DPE)

## Installation

1. Cloner le dépôt :
```bash
git clone https://server-rtit-consulting.com/billyan/skills4mind.git
cd 3d-building-visualization-app
```

2. Installer les dépendances :
```bash
npm install
```

3. Lancer l'application :
```bash
npm run dev
```

L'application sera disponible sur http://localhost:5173/

## Configuration technique

### Fichiers clés
- `src/mapDisplay.js` : 
  - Charge et affiche les données GeoJSON
  - Configure le rendu 3D et les infobulles
- `src/components/Map3D.tsx` : 
  - Gère la visualisation interactive
  - Intègre la carte avec React

### Dépendances principales
- **ESRI ArcGIS API** pour JavaScript :
  - Visualisation cartographique 3D
  - Gestion des couches GeoJSON
  - Widgets interactifs
- **Three.js** pour le rendu 3D avancé

## Développement

Commandes utiles :

- `npm run dev` : Lance le serveur de développement
- `npm run build` : Crée une version de production
- `npm run lint` : Vérifie le code avec ESLint
- `npm run preview` : Prévisualise la version de production

## Auteurs

- PIERRE STEVE NGWEHA PENI- Développeur principal
- BILL YANN TUENKAM - Autres contributeurs
- IZAC TIOTE - Autres contributeurs

## Licence

[MIT](LICENSE) - Libre d'utilisation et modification
