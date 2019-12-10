

function placeColorLookup(id) {
    switch (id) {
        case 1:
            return '#FFA500'
        case 2:
            return '#FFD700'
        case 3:
            return '#B56A02'
        case 4:
            return '#00CC00'
        case 5:
            return '#007700'
        case 6:
            return '#F8F8F8'
        case 7:
            return '#FFD829'
        case 8:
            return '#FF7700'
        case 9:
            return '#C0C0C0'
        case 10:
            return '#000077'
        case 11:
            return '#0000CC'
    }
}

function placeTypeLookup(id) {
    if (id == undefined) return 'Unknown'
    switch(id) {
        case 1:
            return 'Town'
        case 2:
            return 'City'
        case 3:
            return 'Farm'
        case 4:
            return 'Grassland'
        case 5:
            return 'Forest'
        case 6:
            return 'Tundra'
        case 7:
            return 'Desert'
        case 8:
            return 'Village'
        case 9:
            return 'Road'
        case 10: return 'Ocean'
        case 11: return 'River'
        default:
            return 'Unknown'
    }
}

var gridLines = L.layerGroup()

for (var x = -270; x <= 270; x++) {
    gridLines.addLayer(L.polyline([[x, -480], [x, 480]], {color: 'black', weight: 0.1, opacity: 1}))
}
for (var y = -480; y <= 480; y++) {
    gridLines.addLayer(L.polyline([[-270, y], [270, y]], {color: 'black', weight: 0.1, opacity: 1}))
}

var locations = L.layerGroup()

fetch('http://localhost:5000/locations')
    .then(response => response.json())
    .then(data => {
        //console.log(data['data'])
        data['data'].forEach(location => {
            if (location['place_id'] !== null) {
                var locationRectangle = L.rectangle(
                    [[location['y'], location['x']], [location['y'] + 1, location['x'] + 1]],
                    {fillColor: placeColorLookup(location['place_type_id']), stroke: false}
                ).bindPopup(
                    '<b>(' + location['x'] + ',' + location['y'] + ')</b> <br> Place: ' + location['name'] + ' <br> Type: ' + placeTypeLookup(location['place_type_id']) + ''
                )
                locations.addLayer(locationRectangle)
            }
        })
    })

var characterLocations = L.layerGroup()

fetch('http://localhost:5000/characterLocations')
    .then(response => response.json())
    .then(data => {
        //console.log(data['data'])
        data['data'].forEach(character => {
            console.log(character)
            var randomSpot = (Math.random() * 0.75)
            var characterLocation = L.rectangle(
                [[character['y'] + randomSpot, character['x'] + randomSpot], [character['y'] + randomSpot + 0.25, character['x'] + randomSpot + 0.25]],
                {stroke: false, fillOpacity: 1, pane: 'markerPane'}
            ).bindPopup(
                '<b>' + character['name'] + '</b><br>(' + character['x'] + ',' + character['y'] + ')'
            )
            characterLocations.addLayer(characterLocation)
        })
    })

var bounds = [[270, -480], [-270, 480]];
var biomeMap = L.imageOverlay('maps/biomeMap.svg', bounds)
var physicalMap = L.imageOverlay('maps/physicalMap.svg', bounds)
var temperatureMap = L.imageOverlay('maps/temperatureMap.svg', bounds)
var precipitationMap = L.imageOverlay('maps/precipitationMap.svg', bounds)
var populationMap = L.imageOverlay('maps/populationMap.svg', bounds)
var politicalMap = L.imageOverlay('maps/politicalMap.svg', bounds)

var baseLayer = {
    'Political Map': politicalMap,
    'Biomes': biomeMap,
    'Height Map': physicalMap,
    'Temperature Map': temperatureMap,
    'Rainfall Map': precipitationMap,
    'Population Map': populationMap
}

var overlayLayer = {
    'Locations': locations,
    'Players': characterLocations,
    'Gridlines': gridLines
}

var mymap = L.map('mapid', {
    crs: L.CRS.Simple,
    minZoom: 1,
    maxZoom: 7,
    layers: [politicalMap, locations, characterLocations, gridLines]
})

L.control.layers(baseLayer, overlayLayer).addTo(mymap).setPosition('topleft')

var popup = L.popup();

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("Lat (y): " + Math.floor(e.latlng.lat) + ' Lng (x): ' + Math.floor(e.latlng.lng))
        .openOn(mymap);
}

mymap.on('click', onMapClick);

mymap.fitBounds(bounds);
mymap.setView([0,0], 0)