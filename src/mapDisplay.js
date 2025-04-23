require([
  "esri/Map",
  "esri/Basemap",
  "esri/views/SceneView",
  "esri/layers/GeoJSONLayer",
  "esri/widgets/Search",
  "esri/symbols/SimpleMarkerSymbol",
  "esri/renderers/UniqueValueRenderer",
  "esri/PopupTemplate"
], (Map, Basemap, SceneView, GeoJSONLayer, Search, SimpleMarkerSymbol, UniqueValueRenderer, PopupTemplate) => {

  const map = new Map({
    basemap: new Basemap({ portalItem: { id: "0560e29930dc4d5ebeb58c635c0909c9" } })
  });

  const view = new SceneView({
    container: "viewDiv",
    map,
    camera: { position: { longitude: -61.535, latitude: 16.267, z: 10000 }, heading: 0, tilt: 45 }
  });

  view.ui.add(new Search({ view }), "top-right");

  // Charger la couche GeoJSON
  const geojsonLayer = new GeoJSONLayer({
    url: "http://localhost:5000/api/batiments",
    renderer: new UniqueValueRenderer({
      field: "classe_consommation_energie",
      defaultSymbol: new SimpleMarkerSymbol({ style: "circle", size: 10, color: "gray" }),
      uniqueValueInfos: [
        { value: "A", symbol: new SimpleMarkerSymbol({ color: "#00FF00", size: 10 }), label: "Classe A" },
        { value: "B", symbol: new SimpleMarkerSymbol({ color: "#66FF33", size: 10 }), label: "Classe B" },
        { value: "C", symbol: new SimpleMarkerSymbol({ color: "#FFFF00", size: 10 }), label: "Classe C" },
        { value: "D", symbol: new SimpleMarkerSymbol({ color: "#FF9900", size: 10 }), label: "Classe D" },
        { value: "E", symbol: new SimpleMarkerSymbol({ color: "#FF3300", size: 10 }), label: "Classe E" },
        { value: "F", symbol: new SimpleMarkerSymbol({ color: "#FF0000", size: 10 }), label: "Classe F" },
        { value: "G", symbol: new SimpleMarkerSymbol({ color: "#990000", size: 10 }), label: "Classe G" },
        { value: "N", symbol: new SimpleMarkerSymbol({ color: "#f032e6", size: 10 }), label: "Classe N" },
        { value: "I", symbol: new SimpleMarkerSymbol({ color: "#bcf60c", size: 10 }), label: "Classe I" }
      ]
    }),
    popupTemplate: new PopupTemplate({
      title: "{tr002_type_batiment_description}",
      content: `
        <div style="border-left: 5px solid {expression/classeColor}; padding-left: 10px;">
          <b>Consommation d'énergie :</b> {consommation_energie} kWh/m²/an<br>
          <b>Classe énergétique :</b> {classe_consommation_energie}<br>
          <b>Estimation GES :</b> {estimation_ges} kgCO₂/m².an<br>
          <b>Classe estimation GES :</b> {classe_estimation_ges}<br>
          <b>Surface thermique :</b> {surface_thermique_lot} m²<br>
          <b>Année de construction :</b> {annee_construction}<br>
          <b>Date d'établissement du DPE :</b> {date_etablissement_dpe}<br>
          <b>Modèle DPE (type) :</b> {tr001_modele_dpe_type_libelle}<br>
          <b>Geo score :</b> {geo_score}<br>
        </div>
      `,
      expressionInfos: [{
        name: "classeColor",
        title: "Couleur Classe DPE",
        expression: `
          When($feature.classe_consommation_energie == 'A', '#00FF00',
          $feature.classe_consommation_energie == 'B', '#66FF33',
          $feature.classe_consommation_energie == 'C', '#FFFF00',
          $feature.classe_consommation_energie == 'D', '#FF9900',
          $feature.classe_consommation_energie == 'E', '#FF3300',
          $feature.classe_consommation_energie == 'F', '#FF0000',
          $feature.classe_consommation_energie == 'G', '#990000',
          $feature.classe_consommation_energie == 'N', '#f032e6',
          $feature.classe_consommation_energie == 'I', '#bcf60c',
          '#999999')
        `
      }]
    })
    
    
  });

  // Ajouter le type "size" pour la couche
  geojsonLayer.renderer.visualVariables = [
    {
      type: "size",
      field: "consommation_energie",
      stops: [
        { value: 100, size: 6 },
        { value: 500, size: 30 }
      ]
    }
  ];

  map.add(geojsonLayer);

  // Créer l'UI du filtre avec boutons toggle colorés
  fetch("http://localhost:5000/api/batiments/classes")
    .then(res => res.json())
    .then(classes => {
      const colorMap = {
        A: "#00FF00",
        B: "#66FF33",
        C: "#FFFF00",
        D: "#FF9900",
        E: "#FF3300",
        F: "#FF0000",
        G: "#990000",
        N: "#f032e6",
        I: "#bcf60c"
      };

      const filtersNode = document.createElement("div");
      filtersNode.className = "filters esri-widget";
      filtersNode.id = "filters";
      filtersNode.style.padding = "10px";

      filtersNode.innerHTML = `  
        <strong>Filtrer par classe DPE :</strong><br/>
        <div id="filterButtons" style="display: flex; flex-wrap: wrap; gap: 5px; margin-top: 5px;">
          ${classes.map(c => `<button class="toggle-btn" data-value="${c}" style="background-color:${colorMap[c]}; color: #fff;">${c}</button>`).join('')}
        </div>
      `;

      const style = document.createElement("style");
      style.textContent = `
        .toggle-btn {
          border: none;
          padding: 5px 10px;
          cursor: pointer;
          border-radius: 4px;
          opacity: 0.6;
        }
        .toggle-btn.active {
          outline: 2px solid #000;
          opacity: 1;
        }
      `;
      document.head.appendChild(style);

      view.ui.add(filtersNode, "bottom-right");

      const geoBtns = filtersNode.querySelectorAll(".toggle-btn");
      function updateFilter() {
        const selected = Array.from(geoBtns)
          .filter(btn => btn.classList.contains("active"))
          .map(btn => `'${btn.dataset.value}'`);

        geojsonLayer.definitionExpression = selected.length
          ? `classe_consommation_energie IN (${selected.join(',')})`
          : "1=0"; // rien si aucun filtre
      }

      geoBtns.forEach(btn => {
        btn.addEventListener("click", () => {
          btn.classList.toggle("active");
          updateFilter();
        });
      });

      updateFilter();
    })
    .catch(err => console.error('Erreur chargement des classes :', err));

});
