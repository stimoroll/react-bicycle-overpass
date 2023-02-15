import { LayerMapping, LayerType, PolyLine } from "../Map/layers";
import { fetchMarkers } from "./overpass";

export type relationNode = {
  id: number,
  tags: any,
  type: string,
  members: wayNode[]
}

export type wayNode = {
  id: number,
  type: string,
  nodes: number[]
  tags: Object
}

export type wayCustom = {
  id: number,
  nodes: (number|any)[],
  ref: string|number,
  type: string,
}

export type activeRouteType = {
  id: number,
  members: Array<wayCustom|{
    id: number,
    nodes: number[],
    ref: string|number,
    type: string,
  }>,
  tags: any,
  type: string,
}

export const fetchWays = (setActiveWays:any, setActiveRoutes: any, newLayer:LayerMapping | any) => {
  if(newLayer && newLayer.type === LayerType.WAY) {
    
    // It layer was found, fetch its markers
    return fetchMarkers(newLayer.query, null).then((elems) => {
      if (typeof elems !== "boolean") {
        
        // let myMap:Map<string, any> = new Map();
        const nodes:Map<string, any> = new Map<string, any>();
        const ways = new Map<string, any>();
        const relations = new Map<string, any>();

        const relationsArray:Array<any|relationNode> = elems.filter(el => el?.type === "relation")
        
        //TODO: zdefiniuj typ 
        const nodesArray:Array<any> = elems.filter(el => el?.type === "node").map((el:any) => {
          if(el?.type === "node") {
            return [el?.id, { lat: el?.lat, lon: el?.lon }]
          }
        });
        
        const waysArray:Array<any> = elems.filter(el => el?.type === "way")

        const waysArrayByID:Array<any> = elems.filter(el => el?.type === "way").map((el:any) => {
          if(el?.type === "way") {
            return [el?.id, el ]
          }
        });
        
        let map1 = new Map(nodesArray);
        let map2 = new Map(waysArrayByID);
        let wayExcluded = new Set();

        relationsArray.forEach((elem:activeRouteType) => {
          elem.members.map((way:wayCustom) => {
            const way2:any = map2.get(way['ref']);
            wayExcluded.add(way['ref']);
            // console.log("-> ", way, way['ref'], way2)
            way.nodes = way2['nodes'].map((point: any) => {
              const poi = map1.get(point)
              return poi
            })
          })
        })

        //TODO: tutaj trzeba by ograniczyć tylko do tych co są faktycznie drogami i wyłączyć szlaki
        const newLines:PolyLine[] = waysArray.map(way => {
          if(!wayExcluded.has(way?.id)) {
            way.nodes = way?.nodes.map((point: any) => {
              const poi = map1.get(point)
              return poi
            })
            return way
          } else {
            return null
          } //TODO: co jak nic nie zwróci
        }).filter((way) => way !== null);

        setActiveWays([...newLines]);
        setActiveRoutes([...relationsArray]);
      }
    });
  }
}