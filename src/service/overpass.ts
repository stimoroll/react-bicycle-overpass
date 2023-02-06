const BASE_URL = "https://overpass-api.de/api/interpreter";

/*
https://wiki.openstreetmap.org/wiki/Category:Pl:Rowery


DROGI
  "type": "way",
  "id": 84745437,
  "nodes": [],
  "tags": {
    "bicycle": "designated",
    "foot": "designated",
    "highway": "path",
    "segregated": "yes",
    "source": "geoportal.gov.pl:ortofoto",
    "surface": "paving_stones" / surface = asphalt
    cycleway:surface = asphalt
    foot = designated
    footway:surface = paving_stones
    highway = path
    lit = yes
    oneway:bicycle = no
    segregated = yes
    source = geoportal.gov.pl:ortofoto
    surface = paved    
  }  


Relacja: Sosnowiecki Rower Miejski (8343466)
23 człony 


SZLAKI ROWEROWE
type	route
route	bicycle
colour	green
distance	15
name	Szlak Rowerowy Czarnego Morza
network	lcn
osmc:symbol	white_rectangle:green_pointer
route	bicycle
type	route
wikidata	Q48842278
wikipedia	pl:Szlak Rowerowy Czarnego Morza


colour = #FF0000
description = Szlak rowerowy dawnego pogranicza
name = Szlak rowerowy Dawnego Pogranicza
network = lcn
osmc:symbol = white_rectangle:red_pointer
ref = 465C
route = bicycle
type = route
wikidata = Q28673022
wikipedia = pl:Szlak_Rowerowy_Dawnego_Pogranicza


https://wiki.openstreetmap.org/wiki/File:Parking-bicycle-16.svg
amenity	bicycle_parking
bicycle_parking	stands
capacity	8
https://wiki.openstreetmap.org/wiki/Pl:Tag:amenity%3Dbicycle_parking


https://wiki.openstreetmap.org/wiki/File:Bicycle_repair_station-14.svg 
amenity	bicycle_repair_station
fee	no
opening_hours	24/7
opening_hours:covid19	open
service:bicycle:repair	yes
service:bicycle:tools	yes
https://wiki.openstreetmap.org/wiki/Pl:Tag:amenity=bicycle%20repair%20station?uselang=pl

Kompresory
https://wiki.openstreetmap.org/wiki/Pl:Tag:amenity%3Dcompressed_air


Rower miejski
https://wiki.openstreetmap.org/wiki/Pl:Tag:amenity%3Dbicycle_rental
ico: nextbike albo srm
amenity: bicycle_rental
bicycle_rental: docking_station
amenity	bicycle_rental
brand	Sosnowiecki Rower Miejski
bicycle_rental	docking_station
capacity	12
name	Park Kościuszki
network	City by bike
network:wikidata	Q24944379
opening_hours	Apr-Oct
operator	Nextbike Polska
ref	5873

OVERPASS
brand:wikidata = Q55754308


Tags 11
amenity = bicycle_rental
brand = Kołobrzeski Rower Miejski
brand:wikidata = Q97373105
brand:wikipedia = pl:Kołobrzeski Rower Miejski
capacity = 12
name = Dańdówka
network = Kołobrzeski Rower Miejski
network:wikidata = Q97373105
network:wikipedia = pl:Kołobrzeski Rower Miejski
operator = Nextbike Polska
ref = 6269
Coordinates:
50.2686711 / 19.1758234 (lat/lon)





Shop
https://wiki.openstreetmap.org/wiki/Pl:Tag:shop%3Dbicycle
shop=bicycle
service:bicycle:retail=no
service:bicycle:repair=yes
service:bicycle:pump=yes
*/



export type Elements = {
  type: string;
  lat: number;
  lon: number;
  tags: {
    amenity: string;
    name: string;
    website: string;
    higway: string;
  };
};

export const fetchMarkers = async (
  layerQuery: string,
  box: string | undefined | null
): Promise<Elements[] | boolean> => {
  // (${layerQuery.replace(/\[BOX\]/gi, box).replace(/\[AREA\]/gi, "(area.sosnowiec)")});
  try {
    const query = `
      [out:json][timeout:25];
      area[name="Sosnowiec"]->.sosnowiec;
      (${layerQuery.replace(/\[AREA\]/gi, "(area.sosnowiec)")});
      out;
      >;
      out skel qt;
    `;
    const formBody = "data=" + encodeURIComponent(query);
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
      },
      body: formBody
    };
    const response = await fetch(`${BASE_URL}`, requestOptions);
    const data = await response.json();
    return data.elements;
  } catch (err) {
    console.error(err);
    return false;
  }
};

// https://overpass-api.de/api/interpreter?data=[out:json];%20%20%20%20%20%20node%20%20%20%20%20%20%20%20[amenity=college]%20%20%20%20%20%20%20%20(48.835474119784756,2.3644745349884033,48.874784201649106,2.407475709915161);%20%20%20%20%20%20out;
