import { NodeType } from "../features/graph/graphSlice";

interface DPS_Node extends NodeType {
    visited: boolean
}

let DPSGraph: DPS_Node[] = [];

const applyDPS = (graph: NodeType[]) => {
    if(graph.length === 0) return undefined;

    DPSGraph = graph.map((e) => { return {...e, visited: false} as DPS_Node });
    DPS(DPSGraph[0]);

    return DPSGraph
}

export const isConnected = (graph: NodeType[]) => {
    if(graph.length === 0) return false;

    DPSGraph = graph.map((e) => { return {...e, visited: false} as DPS_Node });
    DPS(DPSGraph[0]);

    if (DPSGraph.find(e => !e.visited)) return false;
    return true;
}

const DPS = (node: DPS_Node) => {
    if (node.visited) return;

    node.visited = true;
    
    for (let i = 0; i < node.neighbours.length; i++) {
        DPS(DPSGraph.find(e => e.label === node.neighbours[i].label)!);
    }
}

export default applyDPS;