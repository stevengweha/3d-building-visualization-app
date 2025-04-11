require([
  "esri/Map",
  "esri/Basemap",
  "esri/views/SceneView",
  "esri/layers/GeoJSONLayer",
  "esri/widgets/Search",
  "esri/symbols/SimpleMarkerSymbol",
  "esri/renderers/SimpleRenderer"
], (Map, Basemap, SceneView, GeoJSONLayer, Search, SimpleMarkerSymbol, SimpleRenderer) => {

  // Créez une carte avec un basemap 3D
  const map = new Map({
    basemap: new Basemap({
      portalItem: {
        id: "0560e29930dc4d5ebeb58c635c0909c9" // Basemap topographique 3D
      }
    })
  });

  // Définition du style de rendu pour le GeoJSONLayer
  const geojsonLayerTertiaire = new GeoJSONLayer({
    url: "data/dpe-france.geojson", // Assurez-vous que ce chemin est correct
    renderer: new SimpleRenderer({
      symbol: new SimpleMarkerSymbol({
        size: 10,
        style: "circle", // toujours le même style
        color: "gray" // valeur par défaut si la variable ne s'applique pas
      }),
      visualVariables: [
        {
          type: "color",
          field: "classe_consommation_energie",
          stops: [
            { value: "A", color: "#2ecc71" }, // vert
            { value: "B", color: "#27ae60" },
            { value: "C", color: "#f1c40f" },
            { value: "D", color: "#e67e22" },
            { value: "E", color: "#e74c3c" },
            { value: "F", color: "#c0392b" },
            { value: "G", color: "#8e44ad" }  // violet
          ]
        },
        {
          type: "size",
          field: "consommation_energie",
          stops: [
            { value: 100, size: 6 },
            { value: 500, size: 30 }
          ]
        }
        ]
      
    }),

    popupTemplate: {
      title: "{tr002_type_batiment_description}",  // Affiche le type de bâtiment
      content: `
        <b>Consommation d'énergie :</b> {consommation_energie} kWh/m²/an<br>
        <b>Classe énergétique :</b> {classe_consommation_energie}<br>
        <b>Estimation GES :</b> {estimation_ges} kgCO₂/m².an<br>
        <b>Classe estimation GES :</b> {classe_estimation_ges}<br>
        <b>Surface thermique :</b> {surface_thermique_lot} m²<br>
        <b>Année de construction :</b> {annee_construction}<br>
        <b>Date d'établissement du DPE :</b> {date_etablissement_dpe}<br>
        <b>Modèle DPE (type) :</b> {tr001_modele_dpe_type_libelle}<br>
        <b>Geo score :</b> {geo_score}<br>
      `
    }
  });

  // Ajoutez le layer au basemap
  map.add(geojsonLayerTertiaire);

  // Créez une vue 3D pour afficher la carte
  const view = new SceneView({
    container: "viewDiv",
    map: map,
    camera: {
      position: {
        longitude: -61.535,
        latitude: 16.267,
        z: 10000 // Zoom plus éloigné (plus grand = plus dézoommé)
      },
      heading: 0,
      tilt: 45
    }
    
  });

  // Ajoutez la barre de recherche à la vue
  const searchWidget = new Search({
    view: view
  });

  view.ui.add(searchWidget, {
    position: "top-right"  // Positionne la barre de recherche en haut à droite
  });

});
searchWidget.on("select-result", (event) => {
  const geometry = event.result.feature.geometry;
  view.goTo({
    target: geometry,
    zoom: 13 // ou un zoom qui montre bien le contexte
  });
});

function updateFilter() {
  const selected = Array.from(document.querySelectorAll("#filters input:checked"))
    .map(cb => `'${cb.value}'`);
  geojsonLayerTertiaire.definitionExpression = selected.length
    ? `classe_consommation_energie IN (${selected.join(",")})`
    : "1=0"; // cache tout si rien sélectionné
}

document.querySelectorAll("#filters input[type=checkbox]").forEach(cb => {
  cb.addEventListener("change", updateFilter);
});

updateFilter(); // filtre initial

// Mettre à jour le filtre quand on change les checkboxes
document.querySelectorAll("#filters input[type=checkbox]").forEach(cb => {
  cb.addEventListener("change", updateFilter);
});

// Appliquer une première fois au chargement
updateFilter();

document.querySelectorAll("#filters input[type=checkbox]").forEach(cb => {
  cb.addEventListener("change", () => {
    const selected = Array.from(document.querySelectorAll("#filters input:checked"))
      .map(cb => `'${cb.value}'`);
    geojsonLayerTertiaire.definitionExpression = selected.length
      ? `classe_consommation_energie IN (${selected.join(",")})`
      : "1=0";
  });
});
