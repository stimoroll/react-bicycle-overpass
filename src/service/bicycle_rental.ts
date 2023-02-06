/*
{
  "type": "node",
  "id": 5600677152,
  "lat": 50.2737441,
  "lon": 19.1349346,
  "tags": {
    "amenity": "bicycle_rental",
    "brand": "Sosnowiecki Rower Miejski",
    "brand:wikidata": "Q55754308",
    "brand:wikipedia": "pl:Sosnowiecki Rower Miejski",
    "capacity": "10",
    "name": "Rondo Zagłębia Dąbrowskiego",
    "network": "Sosnowiecki Rower Miejski",
    "network:wikidata": "Q55754308",
    "network:wikipedia": "pl:Sosnowiecki Rower Miejski",
    "operator": "Nextbike Polska",
    "ref": "6254",
    "ref:local": "4"
  }
},


[out:json][timeout:100];
(nwr["name"="Sosnowiecki Rower Miejski"];);
out center;
*/

/*
const query = `
  [out:json][timeout:90];
  area[name="Sosnowiec"]->.sosnowiec;
    // (${layerQuery.replace(/\[BOX\]/gi, box).replace(/\[AREA\]/gi, "(area.sosnowiec)")});
    (${layerQuery.replace(/\[BOX\]/gi, box).replace(/\[AREA\]/gi, "(area.sosnowiec)")});
  out;
  >;
  out skel qt;
`;
*/

/*
const BASE_URL = "https://overpass-api.de/api/interpreter";
export const ask = async () => {

// area[name="Sosnowiec"]->.sosnowiec;
// (
//   // query part for: “amenity=bicycle_rental”
//   relation(area.sosnowiec)[amenity="bicycle_rental"]["brand:wikidata" = "Q55754308"];
//   node(area.sosnowiec)[amenity="bicycle_rental"]["brand:wikidata" = "Q55754308"];
//   way(area.sosnowiec)[amenity="bicycle_rental"]["brand:wikidata" = "Q55754308"];  
// );

  try {
    const query = `
      [out:json][timeout:100];
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
}
*/
export {}