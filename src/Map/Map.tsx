import React, { useRef, useState, useEffect } from "react";
import L, { LatLngExpression, LatLngTuple, LatLngBoundsExpression, LayerGroup, GPX, GPXOptions } from "leaflet";
import styled from "styled-components";
import { LayerMakers, PolyLine, PolyLineMap } from "./layers";
import axios from "axios";
import { activeRouteType, wayCustom } from "../service/bicycle_ways";
import { gpxList } from "./GPX";
import {} from "leaflet-gpx";

// @ts-ignore
import { hsl2rgb, rgb2hsl } from '@youc/colorconvert';

let layerControl = L.control;

const redH = 359;

async function getX(fileName: string) {
  return await getGpxs(fileName).then(data => {
    const style = parseStyle;
    return {
      gpx: data,
      style: style
    }
  })
}

async function parseStyle(gpxString:string) {
  const xml:XMLDocument =  new window.DOMParser().parseFromString(gpxString, "text/xml")
  const gpxProps = xml.getRootNode().firstChild?.childNodes[3]
  .childNodes[5].childNodes[1];
  return {
    color: gpxProps?.childNodes[1].firstChild?.nodeValue,
    opacity: gpxProps?.childNodes[3].firstChild?.nodeValue,
    weight: gpxProps?.childNodes[5].firstChild?.nodeValue
  }
}

async function getGpxs(fileName: string) {
  const result = await fetch(fileName)
    .then((response) => response.text())
  return result;
}

  //TILES
  const basemaps = {
    StreetView: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',   {attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}),
    Topography: L.tileLayer.wms('http://ows.mundialis.de/services/service?',   {layers: 'TOPO-WMS'}),
    Places: L.tileLayer.wms('http://ows.mundialis.de/services/service?', {layers: 'OSM-Overlay-WMS'}),
    Arcgis: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    })
  };

  const baseLayers = {
      "StreetView": basemaps.StreetView,
      "Topography": basemaps.Topography,
      "Places": basemaps.Places,
      "ArcGist": basemaps.Arcgis
    }

const css = (h:number, s:number, l:number) => {
  let hsl = [Math.round(h), Math.round(s), Math.round(l)]
  let rgb = hsl2rgb(...hsl)
  let rr = hsl2rgb(359,100,50)
  return 'rgb(' + rgb.map((x:number) => x).join(', ') + ')'
}

type pointNextBike = {
  name: string,
  lat: any,
  lng: any,
}

type tagzType = Map<string, Set<string>>;

// Map container
const StyledMap = styled.div`
  width: 100%;
  height: 90vh;
  z-index: 1;
`;

// Map attributions
const ATTR_OSM =
    'Map data &copy; <a href="http://openstreetmap.org/">OpenStreetMap</a> contributors',
  ATTR_OVERPASS =
    'POI via <a href="http://www.overpass-api.de/">Overpass API</a>';

// Map props
interface MapProps {
  latitude: number;
  longitude: number;
  fullTitle: string;
  activeMarkers: LayerMakers[];
  activeWays?: PolyLine[] | null;
  activeRoutes?: any | null;
  setBounds: (bounds: string) => void;
}

// Map component
const MapLeaflet: React.FC<MapProps> = ({
  latitude,
  longitude,
  fullTitle,
  activeMarkers,
  activeWays,
  activeRoutes,
  setBounds
}) => {

  const [SVGOutline, setSVGOutline] = useState(null);
  const [poi, setPoi] = useState(null);
  const [poiNextBike, setPoiNextBike] = useState(null);
  const [pbike, setPBike] = useState(null);

  const mapRef = useRef<L.Map>();
  const layerGroupRef = useRef<L.LayerGroup>();
  const layerPOIGroupRef = useRef<L.LayerGroup>();
  const layerWaysGroupRef = useRef<L.LayerGroup>();
  const layerShapeGroupRef = useRef<L.LayerGroup>();
  const layerRouteGroupRef = useRef<L.LayerGroup>();
  const layerGPXGroupRef = useRef<L.LayerGroup>();

  // const layerControl = L.control.layers(baseMaps, overlayMaps).addTo(map);
  // const layerControl = L.control;

  // Compute a string version of the map bounds for overpass API requests
  const updateBounds = () => {
    if (!mapRef.current) return;
    const mapBounds = mapRef.current.getBounds();
    const southWest = mapBounds.getSouthWest();
    const northEast = mapBounds.getNorthEast();
  };



  // Initialize the map
  useEffect(() => {
    if (!mapRef.current) {
      const center: LatLngExpression = [latitude, longitude];
      // Create the map
      mapRef.current = L.map("leaflet-map", {
        center,
        zoom: 16,
        layers: [
          L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
            attribution: [ATTR_OSM, ATTR_OVERPASS].join(", ")
          })
        ],
        scrollWheelZoom: false
      });
      // Create layer group
      layerGroupRef.current = L.layerGroup().addTo(mapRef.current);
      layerPOIGroupRef.current = L.layerGroup().addTo(mapRef.current);
      layerRouteGroupRef.current = L.layerGroup().addTo(mapRef.current);
      layerWaysGroupRef.current = L.layerGroup().addTo(mapRef.current);
      layerShapeGroupRef.current = L.layerGroup().addTo(mapRef.current);
      layerGPXGroupRef.current = L.layerGroup().addTo(mapRef.current);

      const layerControl = L.control.layers(baseLayers, {
        "Pahts": layerGroupRef.current,
        "POI": layerPOIGroupRef.current,
        "Routes": layerRouteGroupRef.current,
        "ways": layerWaysGroupRef.current,
        "shape": layerShapeGroupRef.current,
        "GPX": layerGPXGroupRef.current,
      }).addTo(mapRef.current);

      const options:GPXOptions = {
        async: true,
        // polyline_options: {
        //   color: 'green',
        //   opacity: 0.5,
        //   weight: 7,
        //   lineCap: 'round'
        // },
        marker_options: {
          startIcon: undefined,
          endIcon: undefined,
          startIconUrl: undefined,
          endIconUrl: undefined
        },
        gpx_options: {
          parseElements: ['track', 'route', 'waypoint'] 
        }
      }

      gpxList.forEach((gpxFile) => {
        const url = `http://localhost:3000/gpxs/${gpxFile}`;
        console.log('GPX:', url)

        if(mapRef && mapRef?.current) {

          getX(url).then(gpxObject => {
            const gpxFile = gpxObject.gpx;
            // options.polyline_options = gpxObject.style as L.PolylineOptions;
            new GPX(gpxFile, 
              options
              )
              .on("loaded", function (e) {
                console.log("EE", e.target);
                //mapRef?.current.fitBounds(e.target.getBounds());
              })
              .addTo(layerGPXGroupRef?.current as L.LayerGroup);
          })

        }

      });


      // Create marker for central position //actully removed 
      const localisation = L.marker(center);
      localisation.bindPopup(fullTitle);

      // Map bounds update listener //actually disabled 
      mapRef.current.on("moveend", updateBounds);
      updateBounds();
    }
  },[]);

  // Dynamically add markers
  useEffect(() => {
    if (layerGroupRef.current) {
      layerGroupRef.current.clearLayers();

      //TODO: mało tuatj informacji warto mieć więcej
      //TODO: pierwsze to ikonka - zrobić ikonkę
      activeMarkers.forEach((layer) => {
        const icon = new L.Icon({ iconUrl: layer.icon });
        layer.markers.forEach((marker) => {
          if(marker && marker?.lat > 0 && marker?.lon > 0) {
            const pos: LatLngTuple = [marker.lat, marker.lon];
            const mapMarker = L.marker(pos, { icon });
            if (marker.name) {
              mapMarker.bindPopup(marker.name);
            }
            if (layerGroupRef.current) mapMarker.addTo(layerGroupRef.current);
          } else {
            console.log('ERROR MARKER', marker);
          }
        });
      });
    }
  }, [activeMarkers]);

  useEffect(() => {
    if (layerRouteGroupRef.current) {
      let desc:any = null;
      let style:any = {
        color: 'grey',
        weight: 3,
        opacity: 1,
        dashArray: '10, 10', dashOffset: '5'
      };

      let styleBck:any = {
        color: 'white',
        weight: 5,
      }

      activeRoutes?.forEach((route:activeRouteType) => {

        if(route.hasOwnProperty("tags") && route?.tags) {
          desc = Object.entries(route?.tags).map(tag => tag.join(":")).join("\n, ");
        }

        let routeLine:LatLngExpression[] = [];

        route?.members.forEach((way:wayCustom) => {
          routeLine = way.nodes.map((node:any) => {
            return [node?.lat, node?.lon]
          })
          //SET background of line / outline
          const mapLineBck = L.polyline(routeLine, styleBck);
          if (layerRouteGroupRef.current) mapLineBck.addTo(layerRouteGroupRef.current);

          //SET main color of route line
          const mapLineFrd = L.polyline(routeLine, style);
          mapLineFrd.bindPopup(desc).bindTooltip(desc);
          if (layerRouteGroupRef.current) mapLineFrd.addTo(layerRouteGroupRef.current);
        });
        //cycle_network, from, to, state (propsed), networ: rcn, name, ref (nr),
        //description, type=route, distance

        // console.log(route.tags['type']);
        if(route.tags['type'] === "route" || route.tags['route'] === "bicycle") {
          // style["borderStyle"] = "double";
          style["color"] = route.tags?.colour || route.tags?.color || "grey";
          // console.log('style',style);
          // console.log('route.tags',route.tags);
        }
      })
    }
  },[activeRoutes]);

  useEffect(() => {
    if (layerWaysGroupRef.current) {
      // layerGroupRef.current.clearLayers();
      let desc = null;
      let style:any = {
        color: 'grey',
        weight: 5,
        opacity: 0.6,
        dashArray: '10, 10', dashOffset: '5'
      };

      // let tagz = new Set();
      // const tagz:map = new Map()<any>;
      // let tagz:Map<string, Set<string>> = new Map<string, Set<string>>();
      let tagz:tagzType = new Map<string, Set<string>>();

      activeWays?.forEach((way) => {
        desc = null;
        style = {
          // color: 'red',
          // borderStyle: 'solid',
        };
        const line:LatLngExpression[] = way.nodes.map(node => [node?.lat, node?.lon]);
        if(way.hasOwnProperty("tags") && way?.tags) {
          // style.dashArray: '10, 10', dashOffset: '5'
          desc = Object.entries(way?.tags).map(ar => ar.join(":")).join("\n, ");
          Object.entries(way?.tags).forEach((key:(string|any)[]) => {
            if(tagz?.has(key[0])) {
              (tagz.get(key[0]))?.add(key[1]);
            } else {
              tagz?.set(key[0], (new Set<string>()).add(key[1]) );
            }
          });


          const mapSurface = (value:string) => {
            //asphalt, paved, paving_stones
            const mapSurfaceToStyle:{[index: string]:any} = {
              'asphalt' : {},
              'paving_stones' : { dashArray: '5, 5', dashOffset: '3' },
              'paved' : { dashArray: '10, 10', dashOffset: '5' },
              'concrete' : { dashArray: '10, 10', dashOffset: '5' },
              'wood' : { dashArray: '10, 10', dashOffset: '5' }
            }
            return mapSurfaceToStyle[value];
          }
          const mapFriendnesToColor = (key: string, value:any) => {
            //leyer, 1, 2, 3, -1 - zmiana koloru lub natęenia
            //zmiana koloru lepsza byłaby
            let opacity = 1;
            let colorL = 50;
            switch(key) {
              case "layer":
                if(value !== 1) { opacity -= 0.3; colorL -= 0.1; }
                break;
              case "smoothness":
                if(value !== "good") { opacity -= 0.1; colorL -= 0.05; }
                if(value !== "intermediate") { opacity -= 0.3; colorL -= 0.1; }
                break;
            }
            return { 
              opacity: opacity, 
              color: css(redH, colorL, 50)
            }
          }

        type TagsMapType = {
          [index:(string|symbol|number)]:any
        }
          const tagsMap = new Object({
            "width": (value:any) => { return { width: value }},
            "layer": (value:number) => {return mapFriendnesToColor("layer", value)},
            "surface": (value:any) => {return mapSurface(value)},
            "cycleway:surface": (value:any) => {return mapSurface(value)},
            "smoothness": (value:number) => {return mapFriendnesToColor("smoothness", value)}
          });

          const styles = Object.entries(way.tags).map(([key, value]:[string, unknown]) => {
            // const [key, value] = tag;
            
            // if(typeof tagsMap[key] === 'function') {console.log("TAG:", tagsMap[key](value));}
            const fn = (tagsMap as TagsMapType)[key];
            if(typeof fn === 'function') { 
              // console.log('FN', fn(value));
              return fn(value);
            } 
            return null;
          }).filter(style => style !== null);

          // surface -> czy value == asphalt  - ciągłe, przerywane (beton), kropkowane (kostka)
          //{'asphalt', 'paving_stones', 'paved', 'concrete', 'wood', …}
          // - surface / cycleway:surface: asphalt, paved, paving_stones, 
          // - smoothness: intermediate, excellent, good
          // - surface: note
          // - check_data:surface
          // - cyclway: width - nie wprowadzone nigdzie
          // - width: 4, 5, 2
          // - layer: 1, 3, 2, -1
          // - crossing: traffic_singals, uncontrolled, marked
          // - cycleway: width: 1.5
          // - cycleway: crossing

          style = styles.reduce((a, v) => ({ ...a, ...v}), {})
        }
        
        const mapLine = L.polyline(line, style);
        if (desc) {
          mapLine.bindPopup(desc).bindTooltip(desc);
        }

        if (layerWaysGroupRef.current) mapLine.addTo(layerWaysGroupRef.current);
      })
    }
  }, [activeWays])

  const getGPX = (gpxFileName: string, callback:any) => {
    fetch(gpxFileName).then((response) => {
      console.log(response);
      if(callback) { callback(); }
    })
  }

  const getData = (jsonFileName: string, setResult:any) => {
    fetch(jsonFileName
      ,{
        headers : {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    )
      .then(function(response){
        console.log('RESPONSE:', response)
        return response.json();
      })
      .then(function(myJson) {
        console.log('JSON:', myJson);
        setResult(myJson)
      });
  }

  const getParkingiPOI = () => getData('parkingi.json', setPoi);
  const getStacjePOI = () => getData('stacje.json', setPoi);
  const getSosnowiecBoundary = () => getData('sosnowiec.json', setSVGOutline);

  const getGPX1 = () => getGPX('gpxs/Andresa-asfalt-5.gpx', setPBike)

  gpxList.forEach((gpxFile) => {
    const gpxPath = `gpxs/${gpxFile}`
    const getGPX1 = () => getGPX(gpxPath, setPBike)
  })





  //TODO: do włączenia około 1 kwietnia = teraz jest nieaktuwne i nie zwraca danych
  const getNextBike = () => {
    const nextbike_api_url = 'https://api.nextbike.net/maps/nextbike-live.json?city=497';
    axios.get(nextbike_api_url).then(function(response) {
      // console.log('NEXTBIKE', response.data);
      // console.log('NEXTBIKE', response.data.countries[0].cities[0].places);
      const st = response.data.countries[0].cities[0].places;
      setPoiNextBike(st.map((pointNB:any) => {
        // console.log(point);
        return { 
          name: pointNB?.name,
          location: [pointNB?.lat, pointNB?.lng] }
      }))

        st.forEach((pointNB:any) => {
          const pos: LatLngTuple = [pointNB?.lat, pointNB?.lng];
          // const mapMarker = L.marker(pos, { icon });
          const mapMarker = L.marker(pos);
          if (pointNB.name) {
            mapMarker.bindPopup(pointNB.name);
          }
          if (layerGroupRef.current) mapMarker.addTo(layerGroupRef.current);
        });
    }).catch(function(error) {});
  }


  useEffect(() => {
    getSosnowiecBoundary();
    getGPX1();
    // getNextBike() //TODO: 
    // getParkingiPOI()
    // getStacjePOI()
  },[]);

  var myStyle = {
    "color": "#EF9999",
    "weight": 2,
    "opacity": 0.2
};

  useEffect(() => {
    // if(mapRef && mapRef.current) {
    // const url = 'http://localhost:3000/gpxs/Andresa-asfalt-5.gpx',
    // new L.GPX(url, {
    //   async: true,
    //   marker_options: {
    //     startIconUrl: 'images/pin-icon-start.png',
    //     endIconUrl: 'images/pin-icon-end.png',
    //     shadowUrl: 'images/pin-shadow.png'
    //   }
    // }).on('loaded', function(e) {
    //   mapRef.current.fitBounds(e.target.getBounds());
    // }).addTo(mapRef.current);
    // }
  }, [pbike, mapRef])

  useEffect(() =>{
    if(SVGOutline && layerShapeGroupRef?.current) {
      layerShapeGroupRef.current.clearLayers();
      // console.log("SVGOutline", SVGOutline);
      const sosno = L.geoJSON(SVGOutline,{
        style: myStyle
      })
      if(sosno && mapRef.current) {
        sosno.addTo(mapRef.current);
        // .addTo(layerShapeGroupRef.current);
      }
    }

  },[SVGOutline])

  // Render the map
  return <StyledMap id="leaflet-map" />;
};

export default MapLeaflet;


