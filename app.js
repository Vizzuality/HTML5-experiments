    var articles = [
    {
       title: 'Earthquakes in time',
       img: "img/earthquake.png",
       description: 'Uses D3 to animate earthquake occurrence over time',
       link: 'earthquakes/index.html',
       labels: [
         { name: 'D3' },
         { name: 'Backbone.js'},
         { name: 'Modestmaps'}
       ]
     },

     {
        title: 'Sketch rendering',
        img: "img/sketchy.png",
        description: 'use <a href="https://github.com/vizzuality/VECNIK">VECNIK</a> to render a sketchy like map on client side with canvas',
        link: 'http://vizzuality.github.com/VECNIK/examples/custom_renderer.html#3/13.84/11.75',
        labels: [
          { name: 'VECNIK' },
          { name: 'SQL-API'},
          { name: 'Modestmaps'}
        ]
      },
      {
         title: 'Bic rendering',
         img: "img/bic.jpg",
         description: 'another take on <a href="https://github.com/vizzuality/VECNIK">VECNIK</a> to render a sketchy map, this time with blue bic',
         link: 'http://vizzuality.github.com/VECNIK/examples/ny_map.html#13/40.7251/-73.9585',
         labels: [
           { name: 'VECNIK' },
           { name: 'SQL-API'},
           { name: 'Modestmaps'}
         ]
       },
      {
        title: 'Style animation',
        img: "img/carto_anim.png",
        description: 'use <a href="https://github.com/vizzuality/VECNIK">VECNIK</a> to do animation using <a href="https://github.com/mapbox/carto">Carto</a>',
        link: 'http://vizzuality.github.com/VECNIK/examples/ny_districts_animated.html#12/40.6697/-73.9522',
        labels: [
          { name: 'VECNIK' },
          { name: 'SQL-API'},
          { name: 'Carto'}
        ]
      },
      {
        title: 'Live style editor',
        img: "img/carto_osm.png",
        description: 'London OSM roads rendered with <a href="https://github.com/vizzuality/VECNIK">VECNIK</a> with <a href="https://github.com/mapbox/carto">Carto</a> style live edit',
        link: 'http://vizzuality.github.com/VECNIK/examples/osm_london.html#14/51.5072/-0.1192',
        labels: [
          { name: 'VECNIK' },
          { name: 'SQL-API'},
          { name: 'Carto'}
        ]
      },
      {
        title: '3D world visualization',
        img: "img/d33dglobe.png",
        description: '3d globle visualization using D3',
        link: 'cartodbd3globe/',
        labels: [
          { name: 'D3' },
          { name: 'SQL-API'}
        ]
      },
      {
        title: 'NY Bus animation',
        img: "img/ny_bus.png",
        description: 'animation of a bus line in NY using D3 and SVG. Use modestmaps as map library',
        link: 'ny_bus_animation/',
        labels: [
          { name: 'D3' },
          { name: 'SQL-API'},
          { name: 'Modestmaps'}
        ]
      }  ,
        {
          title: 'MapDig OSM faceting',
          img: "img/mapdig.jpg",
          description: 'Faceted map filtering of OpenStreetMap using <a href="https://github.com/vizzuality/mapdig" target="_blank">MapDig</a> and the CartoDB SQL-API.',
          link: 'http://vizzuality.github.com/mapdig/examples/osm_line.html',
          labels: [
            { name: 'dat.gui.js' },
            { name: 'SQL-API'}
          ]
        },
        {
          title: 'on hover higlighting',
          img: "img/hover.jpg",
          description: 'Canvas render with on hover highlights using the CartoDB SQL-API.',
          link: 'http://dl.dropbox.com/u/193220/cartodb_tile_render/example.html',
          labels: [
            { name: 'Canvas' },
            { name: 'SQL-API'}
          ]
        },
      {
        title: 'US county area with 3 color scale',
        img: "img/d3_1.png",
        link: 'd3/US-county-area.html',
        description: 'Shows US countries using D3 library using the CartoDB SQL API to get the data',
        labels: [
          { name: 'D3' },
          { name: 'SVG' },
          { name: 'SQL-API'}
        ]
      },
      {
        title: 'US states with 2k points + zoom/pan',
        img: "img/d3_2.png",
        description: 'Shows 2k points in a map the user can zoom and pan. ',
        link: 'd3/US-state-2k-points-zoom.html',
        labels: [
          { name: 'D3' },
          { name: 'SVG' },
          { name: 'SQL-API'}
        ]
      },
      {
        title: 'US states with 5k animated points',
        img: "img/d3_3.png",
        description: 'Shows 5k points animated on the map.',
        link: 'd3/US-state-5k-points-anim.html',
        labels: [
          { name: 'D3' },
          { name: 'SVG' },
          { name: 'SQL-API'}
        ]
      },
      {
        title: 'US states with 10k points',
        img: "img/d3_4.png",
        description: '10k on the screen using SVG',
        link: 'd3/US-state-10k-points.html',
        labels: [
          { name: 'D3' },
          { name: 'SVG' },
          { name: 'SQL-API'}
        ]
      },
      {
        title: '38k tweets heatmap',
        img: "img/heatmap_1.png",
        description: 'displays a heatmap of 38k geolocated tweets in Madrid using HTML5 Canvas',
        link: 'heatmaps/madrid_tweets.html',
        labels: [
          { name: 'Canvas' },
          { name: 'SQL-API'}
        ]
      },
      {
        title: 'West coast US Walmart locations',
        img: "img/heatmap_2.png",
        description: 'displays a heatmap of West coast US Walmart locations',
        link: 'heatmaps/walmart.html',
        labels: [
          { name: 'Canvas' },
          { name: 'SQL-API'}
        ]
      }
    ];


    function init() {
      var example_template = document.getElementById('example-tmpl').innerHTML;

      example_template = example_template
        .replace(/%7B/g, '{')
        .replace(/%7D/g, '}')
      var examples = document.getElementById('examples');
      for(var a=0; a < articles.length;  ++a) {
        var article = articles[a];
        examples.innerHTML += Mustache.render(example_template, article);
      }
    }
