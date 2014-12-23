// Initialize the map
var map = L.map( 'nycmap', {
    center: [40.72, -73.9],
    minZoom: 11,
    zoom: 11
});

// Set attribution
L.tileLayer.grayscale('http://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org/">OpenStreetMap</a> contributors',
    maxZoom: 12, minZoom: 11
}).addTo(map);

var myURL = jQuery( 'script[src$="nyc-map.js"]' ).attr( 'src' ).replace( 'nyc-map.js', '' );

// Define the marker
var myIcon = L.icon({
    iconUrl: myURL + '../img/pin24.png',
    iconRetinaUrl: myURL + '../img/pin48.png',
    iconSize: [29, 24],
    iconAnchor: [9, 21],
    popupAnchor: [0, -14]
});

// Create the individual cards
for ( var i=0; i < markers.length; ++i ) 
{
   L.marker( [markers[i].lat, markers[i].lng], {icon: myIcon} )
      .bindPopup( '<div><p class="card-title">' + markers[i].Name + ', ' + markers[i].Age + '</p><br>' + markers[i].Gender + '  -  ' + markers[i].Race + '<br>' + markers[i].Address + '  -  ' + markers[i].Date + '<div class="card-image"><img src="' + markers[i].Image + '"></div>' + markers[i].Description + '<p><a href="' + markers[i].More + '">News Link</a></p></div>' )
      .addTo( map );
}

L.geoJson(nycZips, {
    style: function (feature) {
        return {color: feature.properties.color};
    },
    onEachFeature: function (feature, layer) {
        layer.bindPopup(feature.properties.PO_NAME);
    }
}).addTo(map);


function style(feature) {
    return {
        fillColor: "#ece7f2",
        weight: 1,
        opacity: 0.5,
        color: 'white',
        dashArray: '1',
        fillOpacity: 0.3
    };
}

L.geoJson(nycZips, {style: style}).addTo(map);

// control that shows state info on hover
		var info = L.control();

		info.onAdd = function (map) {
			this._div = L.DomUtil.create('div', 'info');
			this.update();
			return this._div;
		};

		info.update = function (props) {
			this._div.innerHTML =  (props ?
				'<p><b>' + props.PO_NAME + '</b><br />' + props.postalCode + '</p>'
				: 'Zipcode Info');
		};

		info.addTo(map);


var geojson;

function highlightFeature(e) {
var layer = e.target;

layer.setStyle({
    fillColor: "#2b8cbe",
    weight: 2,
    color: '#fff',
    dashArray: '2',
    fillOpacity: 0.6
});

if (!L.Browser.ie && !L.Browser.opera) {
    layer.bringToFront();
	}
info.update(layer.feature.properties);
	
}

function resetHighlight(e) {
	geojson.resetStyle(e.target);
	info.update();
}

function onEachFeature(feature, layer) {
	layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlight,
	});
}

geojson = L.geoJson(nycZips, {
style: style,
onEachFeature: onEachFeature
}).addTo(map);




