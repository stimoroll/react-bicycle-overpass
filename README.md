#react-bicycle-overpass
CreatedwithCodeSandbox


0
	key : "bicycle"
	value :  {'designated'}
1
	key : "foot"
	value :  {'designated', 'no', 'yes'}
2
	key : "highway"
	value :  {'path', 'cycleway'}
3
	key : "motorcar"
	value :  {'no'}
4
	key : "oneway:bicycle"
	value :  {'no', 'yes'}
5
	key : "segregated"
	value :  {'yes', 'no'}
6
	key : "surface"
	value :  {'asphalt', 'paving_stones', 'paved', 'concrete', 'wood', …}
7
	key : "lit"
	value :  {'no', 'yes'}
8
	key : "source"
	value :  {'geoportal.gov.pl:ortofoto', 'Geoportal 2: Ortofotomapa', 'survey', 'geoportal.gov.pl/ortofoto', 'Geoportal.gov.pl: Ortofoto', …}
9
	key : "width"
	value :  {'4', '5', '2'}
10
	key : "smoothness"
	value :  {'intermediate', 'excellent', 'good'}
11
	key : "cycleway:surface"
	value :  {'asphalt', 'paved', 'paving_stones'}
12
	key : "footway:surface"
	value :  {'paving_stones', 'asphalt', 'compacted', 'sett'}
13
	key : "oneway"
	value :  {'no', 'yes'}
14
	key : "bridge"
	value :  {'yes', 'viaduct'}
15
	key : "layer"
	value :  {'1', '3', '2', '-1'}
16
	key : "crossing"
	value :  {'traffic_signals', 'uncontrolled', 'marked'}
17
	key : "footway"
	value :  {'crossing', 'sidewalk'}
18
	key : "historic:railway"
	value :  {'rail'}
19
	key : "name"
	value :  {'Most piszo-rowerowy na Środuli'}
20
	key : "wikimedia_commons"
	value :  {'File:Most rowerowy w Sosnowcu Środuli.jpg', 'File:Sosnowiec Stawiki 01.jpg', 'File:Droga rowerowa w Parku Sieleckim.jpg'}
21
	key : "psv"
	value :  {'no'}
22
	key : "path"
	value :  {'crossing'}
23
	key : "cycleway:width"
	value :  {'1.5'}
24
	key : "surface:note"
	value :  {'trochę żwiru trochę ubitej ziemi'}
25
	key : "incline"
	value :  {'-10%'}
26
	key : "cycleway"
	value :  {'crossing'}
27
	key : "check_date:surface"
	value :  {'2023-01-04'}
28
	key : "covered"
	value :  {'yes'}
29
	key : "abandoned:railway"
	value :  {'rail'}


== TODO ==
* add markers and other useful points
* add Line drawing; GPX class helps to convert it to GPX https://github.com/fabulator/gpx-builder


==DOCS ==
* for GPX : https://github.com/mpetazzoni/leaflet-gpx/blob/main/README.md
* GPX https://github.com/mpetazzoni/leaflet-gpx
* GeoSeaRCH https://github.com/smeijer/leaflet-geosearch
* Sidebar https://github.com/dwilhelm89/LeafletSlider
* Elevation - taki wykres pod mapą wyświetla https://raruto.github.io/leaflet-elevation/
* Route find https://github.com/perliedman/leaflet-routing-machine
* Editable path https://github.com/Leaflet/Leaflet.Editable
* Draw https://github.com/alex3165/react-leaflet-draw
* Measure https://github.com/ljagis/leaflet-measure
* Image https://github.com/mapbox/leaflet-image
* Print https://github.com/Igor-Vladyka/leaflet.browser.print
* Casto CSS Style: https://github.com/cyclosm/cyclosm-cartocss-style
* Opacity control https://github.com/dayjournal/Leaflet.Control.Opacity
* Gesture https://github.com/Raruto/leaflet-gesture-handling


Example
https://radservice.radroutenplaner.nrw.de/rrp/nrwrs/cgi?lang=DE&view=342489,5697435,417997,5726583&shapes=Radschnellwege,Stationen#


OSM OVERPASS
https://wiki.openstreetmap.org/wiki/Poland/Podział_administracyjny#Miasta
https://wiki.openstreetmap.org/wiki/Tag:boundary%3Dadministrative#10_admin_level_values_for_specific_countries
https://overpass-turbo.eu/ - saved queires
https://wiki.openstreetmap.org/wiki/Tag:network=rcn?uselang=pl
https://github.com/tyrasd/osmtogeojson#readme


OWN TILE
https://wiki.openstreetmap.org/wiki/Creating_your_own_tiles


