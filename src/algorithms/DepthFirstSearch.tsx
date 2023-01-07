import { NodeType } from "../features/graph/graphSlice";

interface DPS_Node extends NodeType {
    visited: boolean
}

let DPSGraph: DPS_Node[] = [];

const applyDPS = (graph: NodeType[]) => {
    if (graph.length === 0) return undefined;

    DPSGraph = graph.map((e) => { return { ...e, visited: false } as DPS_Node });
    DPS(DPSGraph[0]);

    return DPSGraph
}

export const isConnected = (graph: NodeType[]) => {
    if (graph.length === 0) return false;

    DPSGraph = graph.map((e) => { return { ...e, visited: false } as DPS_Node });
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


export const hasPath = (graph: NodeType[], from: string, to: string) => {
    let pathExists = false;

    DPSGraph = graph.map((e) => { return { ...e, visited: false } as DPS_Node });
    const startNode = DPSGraph.find(e => e.label === from);

    return DPSWithTarget(startNode!, to);

    function DPSWithTarget(node: DPS_Node, target: string) {
        if (node.visited) return;
        if (node.label === target) return true;

        node.visited = true;

        for (let i = 0; i < node.neighbours.length; i++) {
            if (DPSWithTarget(DPSGraph.find(e => e.label === node.neighbours[i].label)!, target)) {
                return true;
            };
        }
    }
}

export default applyDPS;