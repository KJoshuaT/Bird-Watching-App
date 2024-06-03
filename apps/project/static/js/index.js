"use strict";

// This will be the object that will contain the Vue attributes
// and be used to initialize it.
let app = {};

app.data = {
    data: function() {
        return {
            // Complete as you see fit.
            my_value: 1, // This is an example.
            drawing: false, // Indicates whether we are currently drawing a rectangle
            rectangle: null, // Holds the rectangle being drawn
            initialLatLng: null // The starting point of the rectangle
        };
    },
    methods: {
        // Complete as you see fit.
        my_function: function() {
            // This is an example.
            this.my_value += 1;
        },
        initMap: function() {
            // Initialize the map
            this.map = L.map('map', {
                center: [51.505, -0.09],
                zoom: 13,
                doubleClickZoom: false // Disable double-click zoom
            });

            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(this.map);

            // Adds listener for clicks
            this.map.on('click', this.click_listener);
            this.map.on('dblclick', this.dblclick_listener);
        },
        click_listener: function(e) {
            // If drawing, update the rectangle
            if (this.drawing && this.rectangle) {
                this.rectangle.setBounds([this.initialLatLng, e.latlng]);
                this.drawing = false; // End drawing on the second click
            }
        },
        dblclick_listener: function(e) {
            // Start a new rectangle
            if (this.rectangle) {
                this.map.removeLayer(this.rectangle);
            }
            this.initialLatLng = e.latlng;
            this.rectangle = L.rectangle([e.latlng, e.latlng], {color: 'red'}).addTo(this.map);
            this.drawing = true; // Start drawing
        }
    },
    mounted: function() {
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
