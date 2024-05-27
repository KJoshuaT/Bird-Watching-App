var width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
    height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

const svg = d3.select("body")
  .append("svg");

svg.attr('viewBox','50 10 ' + width + ' '+height)
  .attr("preserveAspectRatio","xMinYMin");

var map = svg.append('g')
  .attr('class','map');

  d3.json("topojson/ne_110m_admin_0_countries.geojson").then(function(world) {
    drawMap(world);
  });


function drawMap(world) {
  var projection = d3.geoMercator()
    .scale(130)
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

