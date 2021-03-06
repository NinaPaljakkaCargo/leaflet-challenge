//getting data from JSON URL
function init() {
    // Store JSON URL in variable
    var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";

    //get data from the url using d3.json
    d3.json(url, function (data) {
        createFeatures(data.features);
        console.log(data)
    });
};

function createFeatures(data) {

    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + 'Location: ' + feature.properties.title + 
            "</h3><hr><p>" + 'Magnitude: ' + feature.properties.mag + "<hr>" + 'Depth: ' + new Number(feature.geometry.coordinates[2]) + "</p>");
    };

    function chooseColor(depth){
        return depth > 90 ? '#003300' :
        depth > 70 ?  '#2F713D' :
        depth > 50 ? '#3E9550' :
        depth > 30 ? '#50B665' :
        depth >= 10 ? '#81E481':
        depth < 10 ? '#ABEDAB' :
                '#D5F6D5';
    }


    var earthquakes = L.geoJSON(data, {
        onEachFeature: onEachFeature,
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                radius: feature.properties.mag*3,
                fillColor: chooseColor(feature.geometry.coordinates[2]),
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
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
        "Earthquakes": earthquakes
    };

    var myMap = L.map("map", {
        center: [
            0,0
        ],
        zoom: 5,
        layers: [streetmap, earthquakes]   
    });


    var legend = L.control({
        position: 'bottomright'});

    legend.onAdd = function(myMap) {
        var div = L.DomUtil.create('div', 'info legend'),
        grades=[0,10,30,50,70,90],
        labels=[],
        from, to;

        function chooseColor(grades){
            return grades > 90 ? '#003300' :
            grades > 70 ?  '#2F713D' :
            grades > 50 ? '#3E9550' :
            grades > 30 ? '#50B665' :
            grades >= 10 ? '#81E481':
            grades < 10 ? '#ABEDAB' :
                    '#D5F6D5';
        }



        for (var i =0; i< grades.length; i++) {
            from = grades[i];
            to = grades[i+1];

            labels.push(
                '<i style="background:' + chooseColor(from) + '">[color]</i> ' +
                from + (to ? '&ndash;' + to : '+'));
        }
        div.innerHTML = labels.join('<br>');

        return div;

    };
    legend.addTo(myMap);

    





    //Notes: MapBox is used for visualization. 

    //data markers should reflect the magnitude of the earthquake by their size and and depth of the earth quake
    //by color. Earthquakes with higher magnitudes should appear larger and earthquakes with greater depth should 
    //appear darker in color.


    //DEPTH: geometry->coordinates[2]-> depth
    //MAGNITUDE: properties->mag



};


window.addEventListener('DOMContentLoaded', init);