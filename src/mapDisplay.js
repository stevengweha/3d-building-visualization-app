require([
  "esri/Map",
  "esri/Basemap",
  "esri/views/SceneView",
  "esri/layers/GeoJSONLayer",
  "esri/widgets/Search",
  "esri/symbols/SimpleMarkerSymbol",
  "esri/renderers/SimpleRenderer"
], (Map, Basemap, SceneView, GeoJSONLayer, Search, SimpleMarkerSymbol, SimpleRenderer) => {

  const map = new Map({
    basemap: new Basemap({
      portalItem: {
        id: "0560e29930dc4d5ebeb58c635c0909c9"
      }
    })
  });

  const geojsonLayerTertiaire = new GeoJSONLayer({
    url: "data/dpe-france.geojson",
    renderer: new SimpleRenderer({
      symbol: new SimpleMarkerSymbol({
        size: 10,
        style: "circle",
        color: "gray"
      }),
      visualVariables: [
        {
          type: "color",
          field: "classe_consommation_energie",
          stops: [
            { value: "A", color: "#2ecc71" },
            { value: "B", color: "#27ae60" },
            { value: "C", color: "#f1c40f" },
            { value: "D", color: "#e67e22" },
            { value: "E", color: "#e74c3c" },
            { value: "F", color: "#c0392b" },
            { value: "G", color: "#8e44ad" },
            { value: "H", color: "#34495e" },
            { value: "I", color: "#2c3e50" },
            { value: "J", color: "#95a5a6" },
            { value: "K", color: "#7f8c8d" },
            { value: "L", color: "#bdc3c7" },
            { value: "M", color: "#ecf0f1" },
            { value: "N", color: "#ffffff" },
            
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
      title: "{tr002_type_batiment_description}",
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

  geojsonLayerTertiaire.when(() => {
    console.log("Calque GeoJSON chargé avec succès");
    if (geojsonLayerTertiaire.features && geojsonLayerTertiaire.features.length > 0) {
      geojsonLayerTertiaire.features.forEach(feature => {
        console.log(feature.attributes);
      });
    } else {
      console.error("Aucune donnée trouvée dans le calque GeoJSON.");
    }
  }, (error) => {
    console.error("Erreur lors du chargement du calque GeoJSON :", error);
  });

  map.add(geojsonLayerTertiaire);

  const view = new SceneView({
    container: "viewDiv",
    map: map,
    camera: {
      position: {
        longitude: -61.535,
        latitude: 16.267,
        z: 10000
      },
      heading: 0,
      tilt: 45
    }
  });

  const searchWidget = new Search({ view: view });
  view.ui.add(searchWidget, { position: "top-right" });

  function updateFilter() {
    const selected = Array.from(document.querySelectorAll("#filters input:checked"))
      .map(cb => `'${cb.value}'`);
    
    geojsonLayerTertiaire.definitionExpression = selected.length
      ? `classe_consommation_energie IN (${selected.join(",")})`
      : "1=1"; // Affiche tous les bâtiments si aucun filtre n'est sélectionné

    console.log("Expression de définition appliquée : ", geojsonLayerTertiaire.definitionExpression);
  }

  document.querySelectorAll("#filters input[type=checkbox]").forEach(cb => {
    cb.addEventListener("change", updateFilter);
  });

  const filtersNode = document.createElement("div");
  filtersNode.className = "filters esri-widget";
  filtersNode.innerHTML = `
    <strong>Filtrer par classe DPE :</strong><br />
    <label><input type="checkbox" value="A" checked /> A</label>
    <label><input type="checkbox" value="B" /> B</label>
    <label><input type="checkbox" value="C" /> C</label>
    <label><input type="checkbox" value="D" /> D</label>
    <label><input type="checkbox" value="E" /> E</label>
    <label><input type="checkbox" value="F" /> F</label>
    <label><input type="checkbox" value="G" /> G</label>
    <label><input type="checkbox" value="H" /> H</label>
    <label><input type="checkbox" value="I" /> I</label>
    <label><input type="checkbox" value="J" /> J</label>
    <label><input type="checkbox" value="K" /> K</label>
    <label><input type="checkbox" value="L" /> L</label>
    <label><input type="checkbox" value="M" /> M</label>
    <label><input type="checkbox" value="N" /> N</label>
  `;
  
  view.ui.add(filtersNode, "top-right");
  updateFilter(); // Applique le filtre initial
});