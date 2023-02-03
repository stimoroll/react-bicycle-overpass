const BASE_URL = "https://overpass-api.de/api/interpreter";


type Elements = {
  type: string;
  lat: number;
  lon: number;
  tags: {
    name: string;
    website: string;
  };
};

export const fetchMarkers = async (
  layerQuery: string,
  box: string
): Promise<Elements[] | boolean> => {
  try {
    const query = `
      [out:json][timeout:25];
      area[name="Sosnowiec"]->.sosnowiec;
      (${layerQuery.replace(/\[BOX\]/gi, box).replace(/\[AREA\]/gi, "(area.sosnowiec)")});
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
