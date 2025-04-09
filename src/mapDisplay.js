require(["esri/Map", "esri/Basemap", "esri/views/SceneView", "esri/layers/GeoJSONLayer"], (
  Map,
  Basemap,
  SceneView,
  GeoJSONLayer
) => {
  const map = new Map({
    basemap: new Basemap({
      portalItem: {
        id: "0560e29930dc4d5ebeb58c635c0909c9" // References the 3D Topographic Basemap
      }
    })
  });

  const geojsonLayer = new GeoJSONLayer({
    url: "data/operat_data.geojson", // Assurez-vous que ce chemin est correct
    renderer: {
      type: "simple",
      symbol: {
        type: "simple-marker",
        color: "blue",
        size: "8px"
      },
      visualVariables: [
        {
          type: "size",
          field: "consommation_declaree",
          stops: [
            { value: 1000000, size: "4px" },
            { value: 50000000, size: "20px" }
          ]
        }
      ]
    },
    popupTemplate: {
      title: "{nom_commune}",
      content: `
        <b>Consommation :</b> {consommation_declaree} kWh<br>
        <b>Zone climatique :</b> {zone_climatique}<br>
        <b>Vecteur énergie :</b> {vecteur_energie}
      `
    }
  });

  map.add(geojsonLayer);

  const view = new SceneView({
    container: "viewDiv",
    map: map,
    camera: {
      position: {
        longitude: -61.535,
        latitude: 16.267,
        z: 500
      },
      heading: 0,
      tilt: 45
    }
  });
});
