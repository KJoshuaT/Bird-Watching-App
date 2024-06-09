"use strict";

// This will be the object that will contain the Vue attributes
// and be used to initialize it.
let app = {};

app.data = {    
    data: function() {
        return {
            user_checklist_list: [],
            totals: {},
            species: [],
            searchQuery: ""
        };
    },
    computed: {
        filteredTotals: function() {
            let query = this.searchQuery.toLowerCase();
            return Object.fromEntries(
                Object.entries(this.totals).filter(([key, value]) => key.toLowerCase().includes(query))
            );
        }
    },
    methods: {
        // Complete. 
    }
};

app.vue = Vue.createApp(app.data).mount("#app");

app.load_data = function () {
    // Complete.
    axios.get(load_data_url).then(function(r) {
            // Initialize totals object.
            let totals = {};
            let user_checklist_list = r.data.user_checklist_list;
            // Iterate through each checklist.
            for (let checklist of user_checklist_list) {
                // Iterate through each species in the checklist.
                for (let species in checklist.content) {
                    if (totals[species]) {
                        // If species already in totals, add the count.
                        totals[species] += checklist.content[species];
                    } else {
                        // If species not in totals, initialize with the count.
                        totals[species] = checklist.content[species];
                    }
                }
            }
            app.vue.totals = totals;
    });
}

// Ensure app.vue is initialized before calling load_data
app.load_data();