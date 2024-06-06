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

app.drawMap = function(world,data,width,height,map) {
  var projection = d3.geoMercator()
    .scale(300)
    .translate([width/2,height/1.5]);
    
  var path = d3.geoPath().projection(projection);

  var features = world.features;

  var checkList = data.data.data;

  var count_id = {};

  checkList.forEach(function(d) {
    let state = d.address.admin1;
    if (state in count_id === false) {
      count_id[state] = {
        count: 1,
        birdList: [d]
      }
    }else{
      count_id[state].count += 1;
      count_id[state].birdList.push(d);
    }
  });

  console.log(count_id);

  map.append('g')
    .selectAll('path')
    .data(features)
    .enter()
    .append('path')
    .attr('d',path)
}

app.load_data = function () {

  var width = Math.max(document.getElementById('app').clientWidth, window.innerWidth || 0),
    height = Math.max(document.getElementById('app').clientHeight, window.innerHeight || 0);

  const svg = d3.select("#app")
    .append("svg")
    .style('cursor','move');

  svg.attr('viewBox','50 10 ' + width + ' '+height)
    .attr("preserveAspectRatio","xMinYMin");

  var zoom = d3.zoom()
    .on('zoom', function() {
      var transform = d3.zoomTransform(this);
      map.attr('transform',transform);
    });

  svg.call(zoom);

  var map = svg.append('g')
    .attr('class','map');

  Promise.all([d3.json("topojson/10m_admin1.geojson"),
              axios.get(location_data)]).then(function(world) {
    app.drawMap(world[0],world[1],width,height,map);
    });

}

app.load_data();


