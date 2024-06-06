"use strict";

// This will be the object that will contain the Vue attributes
// and be used to initialize it.
let app = {};

app.data = {
    data: function() {
        return {
            my_value: 1, // Example data
            map: null,
            drawnItems: null,
            shape: null, // Object to store information about the drawn shape
            heatmap: null, // Heatmap layer
            heatData: [] // Array to store heatmap data points
        };
    },
    methods: {
        my_function: function() {
            this.my_value += 1;
        },
        clearDrawnItems: function() {
            if (this.drawnItems) {
                this.drawnItems.clearLayers(); // Clear existing drawn items
            }
            this.shape = null; // Clear shape information
        },
        initMap: function() {
            var map = L.map('map').setView([51.505, -0.09], 13);
            L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
            
            // FeatureGroup is to store editable layers
            var drawnItems = new L.FeatureGroup();
            map.addLayer(drawnItems);
            this.drawnItems = drawnItems; // Save to Vue instance

            var drawControl = new L.Control.Draw({
                draw: {
                    polygon: false,
                    marker: false,
                    circle: false,
                    circlemarker: false,
                    polyline: false,
                    rectangle: true
                },
                edit: {
                    featureGroup: drawnItems,
                    edit: false,
                    remove: false 
                }
            });
            map.addControl(drawControl);

            var heatmap = L.heatLayer([], {
                radius: 25,  
                max: 1.0,  
                minOpacity: 0.5, 
                gradient: {1.0: 'blue', 1.0: 'lime', 1.0: 'yellow', 1: 'red'}

            }).addTo(map);
            this.heatmap = heatmap; 

            map.on('draw:created', (event) => {
                this.clearDrawnItems(); // Clear existing drawn items
                var layer = event.layer;
                drawnItems.addLayer(layer); 
                
                // Save shape information
                var shapeData = {
                    type: event.layerType,
                    latlngs: layer.getLatLngs()
                };
                this.shape = shapeData;

                // Log the shape data to the console
                console.log('Rectangle data:', shapeData);
            });

            this.map = map; 

            this.addSampleHeatData();
        },
        addSampleHeatData: function() {
            // Add some sample heatmap data points
            var sampleData = [
                [51.505, -0.09, 0.5],
                [51.51, -0.1, 0.6],
                [51.52, -0.12, 0.4],
                [51.50, -0.08, 0.8],
                [51.49, -0.13, 0.7]
            ];
            for (var i = 0; i < sampleData.length; i++) {
                this.heatmap.addLatLng([sampleData[i][0], sampleData[i][1], sampleData[i][2]]);
            }
        }
    },
    mounted: function() {
        // Initialize the map when the component is mounted
        this.initMap();
    }
};

app.vue = Vue.createApp(app.data).mount("#app");

app.load_data = function () {
    axios.get(my_callback_url).then(function (r) {
        app.vue.my_value = r.data.my_value;
    });
}

app.load_data();
