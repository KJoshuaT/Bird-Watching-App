"use strict";

// This will be the object that will contain the Vue attributes
// and be used to initialize it.
let app = {};


app.data = {    
    data: function() {
        return {
          num_checklist: 0,
          total_sighting: 0,
          datalist: [],
          sightinglist: [],
        };
    },
    methods: {
      cal_sighting : function() {
        let self = this;

        self.sightinglist.forEach(function(s) {
          self.total_sighting += s.number_seen;
        })

      }
    }
};

app.vue = Vue.createApp(app.data).mount("#app");

app.load_data = function () {
  var url = new URLSearchParams(window.location.search);
  var point1 = JSON.parse(url.get(0));
  var point2 = JSON.parse(url.get(1));
  var point3 = JSON.parse(url.get(2));
  var point4 = JSON.parse(url.get(3));

  var lat1 = point1.lat;
  var lng1 = point1.lng;
  
  var lat2 = point2.lat;
  var lng2 = point2.lng;

  var lat3 = point3.lat;
  var lng3 = point3.lng;

  var lat4 = point4.lat;
  var lng4 = point4.lng;

  let maxLat = Math.max(lat1,lat2,lat3,lat4);
  let minLat = Math.min(lat1,lat2,lat3,lat4);

  let maxLng = Math.max(lng1,lng2,lng3,lng4);
  let minLng = Math.min(lng1,lng2,lng3,lng4);

  axios.post(location_data,{
    maxlat: maxLat,
    minlat: minLat,
    maxlng: maxLng,
    minlng: minLng
  }).then(function(r) {
    let data = r.data;
    app.vue.datalist = data.checklist;
    app.vue.sightinglist = data.sighting;
    app.vue.num_checklist = data.checklist.length;
    app.vue.cal_sighting();

    console.log(app.vue.datalist);
    console.log(app.vue.sightinglist);
    console.log(app.vue.num_checklist);
    console.log(app.vue.total_sighting);



  });



}

app.load_data();


