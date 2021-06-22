//getting data from JSON URL
function init() {
    // Store JSON URL in variable
    var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson";

    //get data from the url using d3.json
    d3.json(url, function (data) {
        createFeatures(data.features);
        console.log(data)
    });
};

function createFeatures(data) {

    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.mag +
            "</h3><hr><p>" + new Number(feature.geometry.coordinates[2]) + "</p>");
    };

    var earthquakes = L.geoJSON(data, {
        onEachFeature: onEachFeature,
        layer: function (feature, latlng) {
            var markers = {
                radius: 4*feature.properties.mag,
                fillColor: color,
                color: "green",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
                };
            return L.circleMarker(latlng, geojsonMarkerOptions);
            }
    });

    // Sending earthquakes layer to the createMap function
    createMap(earthquakes);
};

function createMap(earthquakes) {

    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
    });

    var baseMaps = {
        "Street Map": streetmap,
    };

    var overlayMaps = {
        Earthquakes: earthquakes
    };

    var myMap = L.map("map", {
        center: [
            0,0
        ],
        zoom: 5,
        layers: [streetmap, earthquakes]
    });



    //data markers should reflect the magnitude of the earthquake by their size and and depth of the earth quake
    //by color. Earthquakes with higher magnitudes should appear larger and earthquakes with greater depth should 
    //appear darker in color.

    // Create a circle and pass in some initial options
    L.circle([45.52, -122.69], {
    color: "green",
    fillColor: "green",
    fillOpacity: 0.75,
    radius: 500
    }).addTo(myMap);




    //the array. . .
    //DEPTH: geometry->coordinates[2]-> depth

    //var d = 

    //MAGNITUDE: properties->mag



};






window.addEventListener('DOMContentLoaded', init);