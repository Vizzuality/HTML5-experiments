
var CartoDB = Backbone.CartoDB({ user: 'viz2' });
var BusRoutes = CartoDB.CartoDBCollection.extend({

  initialize: function(vehicle) {
    _.bindAll(this, 'transform');
    this.where =  "vehicle_id = '" + vehicle.id + "' and timestamp >= '2011/04/14'  and timestamp < '2011/04/15' order by timestamp offset 80";
    this.bind('reset', this.transform);
  },

  // transform the data and prepare some needs interpolations
  transform: function() {
    this.each(function(m) {
      m.set({'time': new Date(m.get('timestamp'))});
    });
    this.lat_range = d3.time.scale()
      .domain(this.models.map(function(m) { return m.get('time'); }))
      .range(this.models.map(function(m) { 
          return m.get('position').coordinates[0];
       }));
    this.lon_range = d3.time.scale()
      .domain(this.models.map(function(m) { return m.get('time'); }))
      .range(this.models.map(function(m) { 
          return m.get('position').coordinates[1];
       }));

    this.visible = d3.time.scale()
      .domain(this.models.map(function(m) { return m.get('time'); }))
      .range(this.models.map(function(m) { 
          return m.get('phase');
       }));
  },

  getPosAt: function(time) {
    return new MM.Location(this.lon_range(time), this.lat_range(time));
  },

  startTime: function() {
    return this.first().get('time');
  },

  endTime: function() {
    return this.last().get('time');
  },

  visibleAt: function(t) {
    var pos = d3.bisect(this.lat_range.domain(), t);
    if(pos >= 1) {
        var dist = this.models[pos].get('time').getTime() - this.models[pos-1].get('time').getTime();
        if(dist > 200*1000) {
            return false;
        }
    }
    return this.visible(t) == 'IN_PROGRESS';
  },

  table: 'ny_bus', //public table
  columns: {
      'timestamp': 'timestamp',
      'position': 'the_geom',
      'vehicle_id': 'vehicle_id',
      'phase': 'phase'
  }
});

function init_buses() {
   var vehicles = [ "7588", "7561", "7579", "7564", "7566", "7562", "7578",
    "7582", "7584", "7574", "7577", "7585", "9864", "7576", "7583", "7570",
    "7568", "7587", "7571", "7560", "7580", "7575", "7565", "7586", "7589",
    "7573", "7581", "7572", "7569", "7563" 
   ]

   var buses = _.map(vehicles, function(v) {
      return new BusRoutes({id: v});
   });
   return buses;
}

/*
 * animated overlay
 */
function Overlay(map, buses) {
    this.buses = buses;
    this.time = buses[0].startTime().getTime();

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
              .data(this.buses)
                .attr('transform', function(bus) {
                      var p = bus.getPosAt(self.time);
                      p = map.coordinatePoint(map.locationCoordinate(p));
                      return "translate(" + p.x + "," + p.y +")";
                 })
              .enter()
                .append('g')
                .attr('transform', function(bus) {
                      var p = bus.getPosAt(self.time);
                      p = map.coordinatePoint(map.locationCoordinate(p));
                      return "translate(" + p.x + "," + p.y +")";
              });
        node.append("circle")
          .attr('style', "stroke: #333; fill: #F00;");

        this.svg.selectAll('g').selectAll('circle')
          .attr("r", function(b) {
            return (b.visibleAt(self.time) && b.startTime().getTime() < self.time && b.endTime().getTime() > self.time)?8:0;
          });
      }
    }


function initMap() {
    var map;

    // init model
    var buses = init_buses();

    // create map
    var src = document.getElementById('src');
    template = 'http://b.tiles.mapbox.com/v3/mapbox.mapbox-light/{Z}/{X}/{Y}.png64';
    var subdomains = [ '', 'a.', 'b.', 'c.' ];
    var provider = new MM.TemplatedLayer(template, subdomains);

    map = new MM.Map(document.getElementById('map'), provider);
    map.setCenterZoom(new MM.Location(40.67, -73.98), 13);

    var setup_layer = function() {
      // remove tracks with no data
      buses = _.filter(buses, function(b) { return b.models.length > 0;  });
      buses.sort(function(a, b) {
        return a.startTime().getTime() - b.startTime().getTime();
      });

      var f = new Overlay(map, buses);
      setInterval(function() {
        f.time += 100000; //100 seconds
        f.draw(map);
        document.getElementById('date').innerHTML = new Date(f.time).toString().replace(/GMT.*/g,'');
      },100);
    };

    // fetch all data
    var after_load = _.after(buses.length, setup_layer);
    _.each(buses, function(b) {
      b.bind('reset', after_load);
      b.fetch();
    });
}
