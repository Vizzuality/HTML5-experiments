
var CartoDB = Backbone.CartoDB({ user: '2read' });

var EarthQuake = CartoDB.CartoDBModel.extend({

  getPos: function() {
    var coords = this.get('position').coordinates;
    return new MM.Location(coords[1], coords[0]);
  },

  scaleAt: function(t) {
      var dt = t - this.time.getTime();
      var interpol_time = 3600*7*1000;
      if(dt > 0 && dt < interpol_time) {
          var r = 1 + 20*this.scale*dt/interpol_time;
          return r;

      }
      return 0;
  },

  opacity: function(t) {
      var dt = t - this.time.getTime();
      var interpol_time = 3600*5*1000;
      if(dt > 0 && dt < interpol_time) {
          return (1 - dt/interpol_time)*0.3;
      }
      return 0.0;
  }

});
var EarthQuakes = CartoDB.CartoDBCollection.extend({

  initialize: function(vehicle) {
    _.bindAll(this, 'transform');
    this.bind('reset', this.transform);
  },

  // transform the data and prepare some needs interpolations
  transform: function() {
    this.each(function(m) {
      m.time = new Date(m.get('timestamp'));
    });

    this.each(function(m) {
      m.scale = parseFloat(m.get('magnitude'));
    });

    /*

    this.lat_range = d3.time.scale()
      .domain(this.models.map(function(m) { return m.get('time'); }))
      .range(this.models.map(function(m) { 
          return m.get('position').coordinates[0];
       }));

    this.visible = d3.time.scale()
      .domain(this.models.map(function(m) { return m.get('time'); }))
      .range(this.models.map(function(m) { 
          return m.get('phase');
       }));
    */
  },



  model: EarthQuake, 
  table: 'earthquakes', //public table
  columns: {
      'timestamp': 'date_utc',
      'position': 'the_geom',
      'magnitude': 'magnitude'
  },
  order: 'date_utc'

});


/*
 * animated overlay
 */
function Overlay(map, earthquakes) {

    this.earthquakes = earthquakes;
    this.time = earthquakes.first().time.getTime();

    this.div = document.createElement('div');
    this.div.style.position = 'absolute';
    this.div.style.width =  map.dimensions.x + "px";
    this.div.style.height = map.dimensions.y + "px";
    map.parent.appendChild(this.div);
    this.svg = d3.select(this.div).append("svg:svg")
           .attr("width",  map.dimensions.x)
           .attr("height", map.dimensions.y);

    var self = this;
    var callback = function(m, a) { 
      return self.draw(m); 
    };
    map.addCallback('drawn', callback);
    this.draw(map);

}

Overlay.prototype = {
  draw: function(map) {
    var self = this;
    var node = this.svg.selectAll("g")
          .data(this.earthquakes.models)
            .attr('transform', function(bus) {
                  var p = bus.getPos(self.time);
                  p = map.coordinatePoint(map.locationCoordinate(p));
                  return "translate(" + p.x + "," + p.y +")";
             })
          .enter()
            .append('g')
            .attr('transform', function(bus) {
                  var p = bus.getPos(self.time);
                  p = map.coordinatePoint(map.locationCoordinate(p));
                  return "translate(" + p.x + "," + p.y +")";
          });
    node.append("circle")
      .attr('style', "stroke: #FFF; fill: #F00; fill-opacity: 0.3");

    this.svg.selectAll('g').selectAll('circle')
      .attr("r", function(b) {
        return b.scaleAt(self.time);
      })
      .attr('style', function(b) {
        var o = b.opacity(self.time);
        return "stroke: #FFF; fill: #F00; fill-opacity: " + o + "; stroke-opacity: " + o;
      });
  }
}


function initMap() {
    var map;


    // create map
    var src = document.getElementById('src');
    template = 'http://b.tiles.mapbox.com/v3/mapbox.mapbox-light/{Z}/{X}/{Y}.png64';
    var subdomains = [ '', 'a.', 'b.', 'c.' ];
    var provider = new MM.TemplatedLayer(template, subdomains);

    map = new MM.Map(document.getElementById('map'), provider);
    map.setCenterZoom(new MM.Location(40.67, -73.98), 2);

    var earthquakes = new EarthQuakes();
    var setup_layer = function() {
      var f = new Overlay(map, earthquakes);
      setInterval(function() {
        f.time += 1000000; //1000 seconds
        f.draw(map);
        document.getElementById('date').innerHTML = new Date(f.time).toString().replace(/GMT.*/g,'');
      },10);
    };

    // fetch all data
    earthquakes.bind('reset', setup_layer);
    earthquakes.fetch();
}
