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
          specieslist: [],
          speciesdata: {}
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
          let checklist_obj = self.datalist.find(x => x.event_id === r.event_id);
          let data = {id: r.event_id, number_seen: r.number_seen, created_on: checklist_obj.created_on};
          if (!(r.species_name in obj)){
            obj[r.species_name] = {count: r.number_seen, data_obj: [data]};
            option_list.push(r.species_name);
          }else{
            let new_data_obj = obj[r.species_name].data_obj;
            new_data_obj.push(data);
            let new_count = obj[r.species_name].count + r.number_seen;
            obj[r.species_name] = {count : new_count, data_obj: new_data_obj};
          }
        })
        self.specieslist = Object.keys(obj).map(key => ({name: key,count: obj[key].count,data_obj:obj[key].data_obj}));

        self.update_select(option_list);
        self.form_data();
      },
      update_select : function(option_list) {
        option_list.sort();
        option_list.unshift('None');
        d3.select('#selectSpecies')
          .selectAll('myOptions')
            .data(option_list)
          .enter()
            .append('option')
          .text(function(d) {return d;})
          .attr('value',function(d) {return d;});
      },
      form_data : function() {
        let self = this;
        
        self.specieslist.forEach(function(obj) {
          let data = []
          obj.data_obj.forEach(function(d) {
            let input_obj = {date: d.created_on,value: d.number_seen}
            data.push(input_obj);
          })
          self.speciesdata[obj.name] = data;
        })


      },
      data_viz_setup : function() {
        let self = this;

        const margin = {top:10,right:30,bottom:30,left:60}
        let width = 700 + margin.left + margin.right;
        let height = 400 + margin.top + margin.bottom;

        const svg = d3.select('#data_viz')
          .append('svg')
            .attr('width',width)
            .attr('height',height)
          .append('g')
            .attr("transform",'translate(60,10)');

        // x-axis
        const x = d3.scaleTime()
          .range([0,width-90])

        const xAxis = svg.append('g')
          .attr('transform', "translate(0,400)")
          .attr('class','myXaxis');

        // y-axis
        const y = d3.scaleLinear()
          .range([height-40,0]);

        const yAxis = svg.append('g')
          .attr('class','myYaxis')

        
        
        d3.select('#selectSpecies').on('change',function(evemt,d) {
          const selectedOption = d3.select(this).property("value");
          self.update_chart(selectedOption,svg,x,y,xAxis,yAxis);
      });
      },
      update_chart : function(name,svg,x,y,xAxis,yAxis) {
        if (name !== 'None') {
          d3.select('#label').remove();
        }

        let self = this;

        let data = self.speciesdata[name];
        const parsedate = d3.timeParse('%Y-%m-%d %H:%M:%S');
        let data_filter = data.map(({date,value}) => ({date: parsedate(date),value}));
        
        //---xAxis
        const dateFormat = d3.timeFormat('%d %b %H:%M');  
        x.domain(d3.extent(data_filter,d => d.date))
        xAxis.transition()
          .duration(1000)
          .call(d3.axisBottom(x)
          .tickFormat((d,i) => {
            return dateFormat(d)
          })
        );      

        //---yAxis

        let maxValue = 0;
        data_filter.forEach(function(obj) {
          if (obj.value > maxValue) {
            maxValue = obj.value;
          }
        })

        y.domain([0,maxValue])
        yAxis.transition()
          .duration(1000)
          .call(d3.axisLeft(y)
          .ticks(maxValue));
        //-- input data

        const j = svg.selectAll('.myLine')
          .data(data_filter)
        j
          .join('line')
          .attr('class','myLine')
          .transition()
          .duration(1000)
            .attr('x1', function(d) {return x(d.date);})
            .attr('x2',function(d) {return x(d.date);})
            .attr('y1',function(d) {return y(d.value);})
            .attr('y2',y(0))
            .attr("stroke",'grey')

        var div = d3.select('#data_viz')
            .append('div')
            .attr('class','tooltip-donut')
            .attr('id','label')
            .style("opacity",0)

        const u = svg.selectAll('circle')
          .data(data_filter)

        u.on('mouseover',function(event,d) {
            console.log(event);
            d3.select(this).transition()
              .duration('50')
              .attr('opacity','.85')
  
            div.transition()
              .duration(50)
              .style('opacity',1)
  
            let info = "Sighted on: " + d.date.toString() + '<br>Number of sighting: ' + d.value.toString();
            div.html(info)
              .style('left',(event.pageX + 10) + 'px')
              .style('top',(event.pageY - 15) + 'px');
  
            })
          .on('mouseout',function(d) {
            d3.select(this).transition()
              .duration('1000')
              .attr('opacity',1)
  
            div.transition()
              .duration('1000')
              .style('opacity',0);
        })
        
        u.join('circle')
          .transition()
          .duration(1000)
            .attr('cx',function(d) { return x(d.date);})
            .attr('cy',function(d) { return y(d.value);})
            .attr('r','4')
            .style('fill','#69b3a2')

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
    app.vue.data_viz_setup();

  });

}

app.load_data();


