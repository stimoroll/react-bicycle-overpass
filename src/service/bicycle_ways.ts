import { LayerMapping, LayerType, PolyLine } from "../Map/layers";
import { fetchMarkers } from "./overpass";

export type wayNode = {
  id: number,
  type: string,
  nodes: number[]
  tags: Object
}

export const fetchWays = (setActiveWays:any, newLayer:LayerMapping | any) => {
  if(newLayer && newLayer.type === LayerType.WAY) {
    
    // It layer was found, fetch its markers
    return fetchMarkers(newLayer.query, null).then((elems) => {
      if (typeof elems !== "boolean") {
        
        // let myMap:Map<string, any> = new Map();
        const nodes = new Map<string, any>();
        const ways = new Map<string, any>();
        
        //TODO: zdefiniuj typ 
        const nodesArray:Array<any> = elems.filter(el => el?.type === "node").map((el:any) => {
          if(el?.type === "node") {
            return [el?.id, { lat: el?.lat, lon: el?.lon }]
          }
        });
        
        const waysArray:Array<any|wayNode> = elems.filter(el => el?.type === "way")
        
        let map1 = new Map(nodesArray);
        let map2 = new Map(waysArray);
        
        
        const newLines:PolyLine[] = waysArray.map(way => {
          way.nodes = way?.nodes.map((point: any) => {
            const poi = map1.get(point)
            return poi
          })
          return way
        });
        
        setActiveWays([...newLines]);
      }
    });
  }
}