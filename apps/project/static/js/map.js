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
          top_5: [],
          specieslist: []
        };
    },
    methods: {
      cal_sighting : function() {
        let self = this;
        self.sightinglist.forEach(function(s) {
          self.total_sighting += s.number_seen;
        })
      },
      find_top_contributor : function() {
        let self = this;
        let contributor_list = {};

        self.datalist.forEach(function(d) {
          if (contributor_list[d.user_id] === undefined) {
            contributor_list[d.user_id] = 1;
          }else{
            contributor_list[d.user_id] += 1;
          }
        });
        
        let keys = Object.keys(contributor_list);
        keys.sort((a,b) => { return contributor_list[b] - contributor_list[a]});
        
        let BreakException = {}
        let i = 1
        try {
          keys.forEach(function(r) {
            if(i <= 5) {
              self.top_5.push({user_id : r,
                                          number: contributor_list[r]});
              } else throw BreakException;
            i += 1;

          })
        } catch(e) {
          if (e !== BreakException) throw e;
        }
      },
      get_species_list : function() {
        let self = this;
        let obj = [];
        self.sightinglist.forEach(function(r) {
          if (obj !== undefined){
            obj[r.species_name] = r.number_seen;
          }else{
            obj[r.species_name] += r.number_seen;
          }
        })
        self.specieslist = Object.keys(obj).map(key => ({name: key,count: obj[key]}));
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
    app.vue.find_top_contributor();
    app.vue.get_species_list();
    console.log(app.vue.specieslist)

  });



}

app.load_data();


