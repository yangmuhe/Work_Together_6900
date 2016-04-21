
  // initialize the map
var map = L.map('map').setView([42.35683981549443, -71.09], 13);

  // load a tile layer
L.tileLayer('http://tiles.mapc.org/basemap/{z}/{x}/{y}.png',
{
    attribution: 'Tiles by <a href="http://mapc.org">MAPC</a>, Data by <a href="http://mass.gov/mgis">MassGIS</a>',
    maxZoom: 18,
    minZoom: 10

}).addTo(map);

d3_queue.queue()
    .defer(d3.csv,'data/hubway_stations.csv', parse)
    .await(dataLoaded)

function dataLoaded(err, stations) {
	console.log('WOW DATA IS LOADED');
	console.log(stations);

	for (i = 0; i < stations.length; i++) {
            var val = stations[i];
            var markers = new L.Marker(new L.LatLng(val.lat, val.lng));
            //map.addLayer(markers);
            L.circle([stations[i].lat, stations[i].lng], 100, {
            	stroke: null,
				color: 'red',
		    	fillColor: '#f03',
		    	fillOpacity: 0.5}).addTo(map);
    }

    //click to select circle station
	map.on('click', function(e) {
	    alert("Lat, Lon : " + e.latlng.lat + ", " + e.latlng.lng)
	});

	map.on('dbdblclick', function(f){
		alert("Double click, baby")
	});


//sample circle
	// L.circle([42.340021,-71.100812], 30, {
	// 	stroke: null,
	// 	color: 'red',
 	//  fillColor: '#f03',
 	//  fillOpacity: 0.6}).addTo(map)

	

}

function parse(d){
    return d
}
