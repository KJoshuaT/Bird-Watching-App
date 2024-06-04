"use strict";

// This will be the object that will contain the Vue attributes
// and be used to initialize it.
let app = {};

app.data = {
  data: function () {
    return {
      my_value: 1, // Example data
      map: null,
      drawnItems: null,
      species: [],
    };
  },
  methods: {
    my_function: function () {
      this.my_value += 1;
    },
  }
};

app.vue = Vue.createApp(app.data).mount("#app");

app.load_data = function () {
  axios.get(my_callback_url).then(function (r) {
    app.vue.my_value = r.data.my_value;
  });
  axios.get(load_data_url).then((response) => {
    app.vue.species = response.data.species;
  });
}

app.load_data();
