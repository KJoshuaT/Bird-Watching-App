"use strict";

// Assuming get_checklist_url is defined somewhere in your HTML or JavaScript
// For example, in your HTML: <script>let get_checklist_url = "{{=URL('get_checklist', signer=url_signer)}}";</script>

let app = {};

app.data = function() {
    return {
        checklist_items: [], // This will store the checklist items
    };
};

app.methods = {
    fetchChecklist: function(event_id) {
        // Prepare the request payload
        const payload = { event_id: event_id };
        axios.post(get_checklist_url, payload).then((response) => {
            // Assuming the server responds with a JSON object that has a 'checklist' key
            this.checklist_items = response.data.checklist;
        }).catch((error) => {
            console.error('Error fetching checklist:', error);
        });
    },
};

app.mounted = function() {
    // Example: Fetch checklist for a specific event_id when the Vue app is mounted
    // Replace 'your_event_id_here' with the actual event_id you want to fetch
    this.fetchChecklist('your_event_id_here');
};

app.vue = Vue.createApp({
    data: app.data,
    methods: app.methods,
    mounted: app.mounted,
}).mount("#app");