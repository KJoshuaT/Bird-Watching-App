"use strict";

// This will be the object that will contain the Vue attributes
// and be used to initialize it.
let app = {};


app.data = {    
    data: function() {
        return {
          selected: 'None',
          options: [],
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
        self.total_sighting = 0;
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
        let obj = {};
        let option_list = [];
        self.sightinglist.forEach(function(r) {
          if (!(r.species_name in obj)){
            obj[r.species_name] = {count: r.number_seen, event_id: [r.event_id]};
            option_list.push(r.species_name);
          }else{
            let new_event_id = obj[r.species_name].event_id;
            new_event_id.push(r.event_id);
            let new_count = obj[r.species_name].count + r.number_seen;
            obj[r.species_name] = {count : new_count, event_id: new_event_id};
          }
        })
        self.specieslist = Object.keys(obj).map(key => ({name: key,count: obj[key].count,event_id:obj[key].event_id}));
        
        option_list.sort();
        option_list.unshift('None');
        d3.select('#selectSpecies')
          .selectAll('myOptions')
            .data(option_list)
          .enter()
            .append('option')
          .text(function(d) {return d;})
          .attr('value',function(d) {return d;});

        console.log(self.specieslist);
      },
      data_viz_setup : function() {
        let self = this;

        const margin = {top:10,right:30,bottom:30,left:60}
        let width = 460 - margin.left - margin.right;
        let height = 400 - margin.top - margin.bottom;

        const svg = d3.select('#data_viz')
          .append('svg')
            .attr('width',width)
            .attr('height',height)
          .append('g')
            .style("transform",'translate(${margin.left},${maring.top})');
        

        const formatdate = d3.timeFormat("%m %Y");
        const xAxis = d3.axisBottom(x)
          .tickValues(d3.timeMonth,formatdate);

        svg.append('g')
          .attr('transform','translate(0,${height})')
          .call(xAxis)
        
      }
    }
};

app.vue = Vue.createApp(app.data).mount("#app");

app.parse_url = function() {
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

  return [maxLat,minLat,maxLng,minLng];

}

app.load_data = function () {
  let points = app.parse_url();
  let maxLat = points[0];
  let minLat = points[1];
  let maxLng = points[2];
  let minLng = points[3];

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
    //app.vue.data_viz_setup();

    console.log(app.vue.datalist);
    console.log(app.vue.sightinglist);

  });

}

app.load_data();


