"use strict";

// This will be the object that will contain the Vue attributes
// and be used to initialize it.
let app = {};

app.data = {
    data: function() {
        return {
            // Complete as you see fit.
            my_value: 1, // This is an example.
        };
    },
    methods: {
        // Complete as you see fit.
        my_function: function() {
            // This is an example.
            this.my_value += 1;
        },
    },
    mounted: function() {
        // Initialize the map when the component is mounted
        this.initMap();
    },
    methods: {
        my_function: function() {
            // This is an example.
            this.my_value += 1;
        },
        initMap: function() {
            // initiate map
            var map = L.map('map').setView([51.505, -0.09], 13);

            // Tiles
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(map);

            // Adds the marker, may not need this
            var marker = L.marker([51.5, -0.09]).addTo(map)
                .bindPopup("<b>Hello world!</b><br>I am a popup.")
                .openPopup();
        }
    }
};

app.vue = Vue.createApp(app.data).mount("#app");

app.load_data = function () {
    axios.get(my_callback_url).then(function (r) {
        app.vue.my_value = r.data.my_value;
    });
}

app.load_data();
