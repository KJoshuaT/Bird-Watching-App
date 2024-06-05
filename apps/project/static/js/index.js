"use strict";

// This will be the object that will contain the Vue attributes
// and be used to initialize it.
let app = {};

app.data = {
    data: function() {
        return {
            my_value: 1, // Example data
            map: null,
            drawnItems: null
        };
    },
    methods: {
        my_function: function() {
            this.my_value += 1;
        },
        initMap: function() {
            var map = L.map('map').setView([51.505, -0.09], 13);
            L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
            // FeatureGroup is to store editable layers
            var drawnItems = new L.FeatureGroup();
            map.addLayer(drawnItems);
            var drawControl = new L.Control.Draw({
                draw: {
                    polygon: false,
                    marker: false,
                    circle: false,
                    circlemarker: false,
                    polyline: false
                },  
                edit: {
                    featureGroup: drawnItems
                }
            });
            map.addControl(drawControl);

            // Listen for draw:created event to add the created layer to the drawnItems
            map.on('draw:created', (event) => {
                var layer = event.layer;
                drawnItems.addLayer(layer); // Add the layer to the feature group
            });

            this.map = map; // Save to Vue instance
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
