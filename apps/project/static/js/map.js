"use strict";

// This will be the object that will contain the Vue attributes
// and be used to initialize it.
let app = {};


app.data = {    
    data: function() {
        return {

        };
    },
    methods: {

    }
};

app.vue = Vue.createApp(app.data).mount("#app");

app.drawMap = function(world,width,height,map) {
  var projection = d3.geoMercator()
    .scale(120)
    .translate([width/2,height/1.5]);
    
  var path = d3.geoPath().projection(projection);

  var features = world.features;

  console.log(features);

  map.append('g')
    .selectAll('path')
    .data(features)
    .enter().append('path')
    .attr('d',path)
    .style('fill', 'steelblue')

}

app.load_data = function () {
  var width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
    height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

  const svg = d3.select("#app")
    .append("svg");

  svg.attr('viewBox','50 10 ' + width + ' '+height)
    .attr("preserveAspectRatio","xMinYMin");

  var map = svg.append('g')
    .attr('class','map');

    d3.json("topojson/ne_110m_admin_0_countries.geojson").then(function(world) {
      app.drawMap(world,width,height,map);
    });

}

app.load_data();


