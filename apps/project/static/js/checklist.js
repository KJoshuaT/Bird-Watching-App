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
      searchQuery: '',
      currentPage: 1,
      itemsPerPage: 16,
      editing: false,
      checklist_id: "new"
    };
  },
  computed: {
    filteredSpecies: function () {
      this.currentPage = 1;
      let searchQuery = this.searchQuery.toLowerCase();
      return this.species.filter(function (species) {
        let name = species.name.toLowerCase();
        return name.indexOf(searchQuery) !== -1;
      });
    },
    paginatedSpecies: function () {
      let index = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredSpecies.slice(index, index + this.itemsPerPage);
    },
    totalPages: function () {
      return Math.ceil(this.filteredSpecies.length / this.itemsPerPage);
    }
  },
  methods: {
    my_function: function () {
      this.my_value += 1;
    },
    validateNumber(species) {
      if (species.count < 0) {
        species.count = 0;
      }
    },
    goToPage(page){
      this.currentPage = page;
    },
    saveChecklist: function () {
      let checklist = {};
      for (let i = 0; i < this.species.length; i++) {
        let s = this.species[i];
        if (s.count > 0) {
          checklist[s.name] = s.count;
        }
      }
      if (this.editing) {
        axios.post(update_checklist_url, {
          checklist: checklist,
          event_id: this.checklist_id
        })
      }
      else{
        axios.post(save_checklist_url, {
          checklist: checklist
        }).then((response) => {
          console.log(response.data);
        });
      }
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
    for (let i = 0; i < app.vue.species.length; i++) {
      let species = app.vue.species[i];
      species.count = 0;
    }
    if (checklist_id !== 'new') {
      app.vue.editing = true;
      app.vue.checklist_id = checklist_id;
      axios.post(get_checklist_url, {
        event_id: checklist_id
      }).then((response) => {
        let content = response.data.checklist;
        for (let key in content) {
          let species = app.vue.species.find(s => s.name === key);
          if (species) {
            species.count = content[key];
          }
        }
      });
    }
  });
}

app.load_data();
