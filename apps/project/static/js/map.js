"use strict";

// This will be the object that will contain the Vue attributes
// and be used to initialize it.
let app = {};


app.data = {    
    data: function() {
        return {
          datalist: []
        };
    },
    methods: {
      regioncheck : function(bird_location) {
        return bird_location
      },

      filldatalist : function() {
        let self = this;
        self.checklist.forEach(function(d) {
          let event_id = d.event_id;
          let sighting_obj = self.sighting.find(obj => obj.event_id === event_id);
          if (sighting_obj != undefined){
            let name_obj = self.species[sighting_obj.species_id]
            if (name_obj != undefined) {
              self.datalist.push({
              species_name: name_obj.name,
              sighting: sighting_obj.number_seen,
              created_on: d.created_on,
              user_id: d.user_id,
              content: d.content,
              location: d.location
            
              });
            }
          }
  
          
        })

      }




    }
};

app.vue = Vue.createApp(app.data).mount("#app");

// app.drawMap = function(world,data,width,height,map) {
//   var projection = d3.geoMercator()
//     .scale(300)
//     .translate([width/2,height/1.5]);
    
//   var path = d3.geoPath().projection(projection);

//   var features = world.features;

//   var checkList = data.data.data;

//   var count_id = {};

//   checkList.forEach(function(d) {
//     let state = d.address.admin1;
//     if (state in count_id === false) {
//       count_id[state] = {
//         count: 1,
//         birdList: [d]
//       }
//     }else{
//       count_id[state].count += 1;
//       count_id[state].birdList.push(d);
//     }
//   });

//   features.forEach(function(d) {
//       d.details = count_id[d.properties.name] ? count_id[d.properties.name] : {};
//   });

//   map.append('g')
//     .selectAll('path')
//     .data(features)
//     .enter()
//     .append('path')
//     .attr('name',function(d) {
//       return d.properties.name
//     })
//     .attr('id',function(d) {
//       return d.id;
//     })
//     .attr('d',path)
//     .on('mouseover', function(d) {
//       d3.select(this)
//         .style('stroke','white')
//         .style('stroke-width',1)
//         .style('cursor','pointer');
//     })
//     .on('mouseout',function(d) {
//       d3.select(this)
//         .style('stroke',null)
//         .style('stroke-width',0.25);
//     })
//     .on('click', function(d) {
//       let data = d.target.__data__;
//       console.log(data);

//     })
// }

app.load_data = function () {
  axios.get(location_data).then(function(r) {
    let data = r.data.data;
    data.forEach(function(d) {
      app.vue.datalist.push({
        species: d.species_name,
        count: d.sighting

      })
    })
  });

  // var width = Math.max(document.getElementById('app').clientWidth, window.innerWidth || 0),
  //   height = Math.max(document.getElementById('app').clientHeight, window.innerHeight || 0);

  // const svg = d3.select("#app")
  //   .append("svg")
  //   .style('cursor','move');

  // svg.attr('viewBox','50 10 ' + width + ' '+height)
  //   .attr("preserveAspectRatio","xMinYMin");

  // var zoom = d3.zoom()
  //   .on('zoom', function() {
  //     var transform = d3.zoomTransform(this);
  //     map.attr('transform',transform);
  //   });

  // svg.call(zoom);

  // var map = svg.append('g')
  //   .attr('class','map');

  // Promise.all([d3.json("topojson/10m_admin1.geojson"),
  //             axios.get(location_data)]).then(function(world) {
  //   app.drawMap(world[0],world[1],width,height,map);
  //   });

}

app.load_data();


