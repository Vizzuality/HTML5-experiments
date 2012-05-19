if (document.body && document.body.offsetWidth) {
 winW = document.body.offsetWidth;
 winH = document.body.offsetHeight;
}
if (document.compatMode=='CSS1Compat' &&
    document.documentElement &&
    document.documentElement.offsetWidth ) {
 winW = document.documentElement.offsetWidth;
 winH = document.documentElement.offsetHeight;
}
if (window.innerWidth && window.innerHeight) {
 winW = window.innerWidth;
 winH = window.innerHeight;
}


var
MODE       = "orthographic",
SCALE      = 380,
WIDTH      = winW,
HEIGHT     = winH,
feature,
projection = d3.geo.azimuthal().scale(SCALE).origin([-71.03,42.37]).mode(MODE).translate([winW/2, winH/2]),
circle     = d3.geo.greatCircle().origin(projection.origin()),
path       = d3.geo.path().projection(projection),
svg        = d3.select("#body").append("svg:svg").attr("width", WIDTH).attr("height", HEIGHT).on("mousedown", mousedown),
url        = "http://saleiva.cartodb.com/api/v2/sql?q=SELECT cartodb_id, name, pop2005, ST_SimplifyPreserveTopology(the_geom, 0.1) as the_geom FROM countries_base&format=geojson";

// TODO fix d3.geo.azimuthal to be consistent with scale
var scale = {
  orthographic: 380,
  stereographic: 380,
  gnomonic: 380,
  equidistant:380 / Math.PI * 2,
  equalarea: 380 / Math.SQRT2
};

var title = document.getElementById("title");

d3.json(url, function(collection) {

  function calculateColor(n){

    if (n <= 67827) {
      return "#FFFFCC";
    }

    if (n <= 1067285) {
      return "#A1DAB4";
    }

    if (n <= 5416945) {
      return "#41B6C4";
    }

    if (n <= 18642586) {
      return "#2C7FB8";
    }

    if (n <= 1312978855) {
      return "#253494";
    }
  }

  feature = svg.selectAll("path")
  .data(collection.features)
  .enter()
  .append("svg:path")
  .attr("d", clip)
  .style("fill", function (d) {return calculateColor(d.properties.pop2005)})
  .on("mouseover", fade(true, 0.4))
  .on("mouseout", fade(false, 1));

});

d3.select(window)
.on("mousemove", mousemove)
.on("mouseup", mouseup);

d3.select("select").on("change", function() {
  projection.mode(this.value).scale(scale[this.value]);
  refresh(750);
});

var m0,
o0;

function mousedown() {
  m0 = [d3.event.pageX, d3.event.pageY];
  o0 = projection.origin();
  d3.event.preventDefault();
}

function mousemove() {
  if (!m0) return

  var
    m1 = [d3.event.pageX, d3.event.pageY],
    o1 = [o0[0] + (m0[0] - m1[0]) / 8, o0[1] + (m1[1] - m0[1]) / 8];

  projection.origin(o1);
  circle.origin(o1);
  refresh();
}

function mouseup() {
  if (!m0) return;

  mousemove();
  m0 = null;
}

function fade(fadeIn, opacity) {
  return function(g, i) {
    svg.selectAll("path")
    .filter(function(d) {

      if (d === g) {
        title.innerHTML = d.properties.name;
        fadeIn ? title.classList.remove('fade') : title.classList.add('fade');
      }

      return  d === g
    })
    .transition()
    .style("opacity", opacity);
  };
}

function refresh(duration) {
  (duration ? feature.transition().duration(duration) : feature).attr("d", clip);
}

function clip(d) {
  return path(circle.clip(d));
}

