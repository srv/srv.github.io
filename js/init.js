// Map tile layers
var online_map_layer = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 22,
  maxNativeZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  useCache: true,
  crossOrigin: true
});

var googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
  maxNativeZoom: 20,
  maxZoom: 22,
  subdomains:['mt0','mt1','mt2','mt3']
});

// Mosaic layers
var imageUrl = 'img/Andratx/andratx_s0_mosaic_febrer_2022.png';
var altText = 'Image of Newark, N.J. in 1922. Source: The University of Texas at Austin, UT Libraries Map Collection.';
var latLngBounds = L.latLngBounds([[39.5433740355509116, 2.3778120859159100], [39.5435832663690974, 2.3780889473301854]]);
var imageOverlay = L.imageOverlay(imageUrl, latLngBounds, {
    opacity: 0.9,
    alt: altText,
    interactive: true
});

var imageUrl2 = 'img/Cabrera/cabrera_s0_març_2023.png';
var latLngBounds2 = L.latLngBounds([[39.1503253173739409, 2.9323280685985198], [39.1507624565738013, 2.9327431911758550]]);
var imageOverlay2 = L.imageOverlay(imageUrl2, latLngBounds2, {
    opacity: 0.9,
    alt: altText,
    interactive: true
});

var mosaics = L.layerGroup([imageOverlay, imageOverlay2]);

var baseLayers = {
    "Online OSM": online_map_layer,
    "Google": googleSat,
};
var overlays = {
  "Mosaics": mosaics
};

// Init the web
initMap();
setLoggerHeight();

// Init the map
function initMap() {
  
  // Check if robot pose has received
  var center;
  var zoom;

  // By default, init to Mallorca, Spain.
  center = L.latLng(39.6134979, 2.911652);
  zoom = generalZoom;

  // Create map
  map = L.map('map', {
    center: center,
    zoom: zoom,
    doubleClickZoom: false,
    zoomControl: false,
    attributionControl: false,
    layers: [online_map_layer, mosaics]
  });

  // Create grid
  L.grid({
    redraw: 'moveend',
    xticks: 16,
    yticks: 10,
    coordStyle: 'DMS'
  }).addTo(map);

  // Show/Hide layers
  initLayers();
}

function initLayers() {

  /// Tiles
  online_map_layer.addTo(map);

  // Load mosaic image to map
  imageOverlay.addTo(map);

  var rect =L.rectangle(latLngBounds, {
    fillOpacity: 0.0,
    opacity: 0.0    
  }).addTo(map);
  map.fitBounds(latLngBounds);
  rect.bindPopup("Mosaic Andratx febrer 2022.");

  imageOverlay2.addTo(map);

  var rect2 =L.rectangle(latLngBounds2, {
    fillOpacity: 0.0,
    opacity: 0.0    
  }).addTo(map);
  map.fitBounds(latLngBounds2);
  rect2.bindPopup("Mosaic Cabrera març 2023.");

  // Add scale bar
  L.control.scale({
    position: 'bottomright',
    imperial: false,
  }).addTo(map);

  // Add layers menu
  L.control.layers(baseLayers, overlays, {position: 'topright'}).addTo(map);
}
