import { NodeType } from "../features/graph/graphSlice"; 

type NodeState = string;

export interface DPS_Node extends NodeType {
    visited: boolean,
    state: NodeState,
    previous: null
}

let DPSGraph: DPS_Node[] = [];
let timeline: DPS_Node[][] = [];

const applyDPS = (startNode: NodeType, graph: NodeType[]) => {
    timeline = [];

    if (graph.length === 0) return undefined;

    DPSGraph = graph.map((e) => { return { ...e, visited: false, state: '', previous: null } as DPS_Node });
    DFS(DPSGraph.find(node => node.label === startNode.label)!);

    return timeline
}

const changeState = (node: DPS_Node, state: NodeState, save: boolean) => {
    const nodeIndex = DPSGraph.findIndex(n => n.label === node.label);
    if (nodeIndex === -1) return;
    DPSGraph[nodeIndex] = {...DPSGraph[nodeIndex], state};
    if (save) timeline.push([...DPSGraph])
}

export const isConnected = (graph: NodeType[]) => {
    if (graph.length === 0) return false;

    DPSGraph = graph.map((e) => { return { ...e, visited: false } as DPS_Node });
    DFS(DPSGraph[0]);

    if (DPSGraph.find(e => !e.visited)) return false;
    return true;
}

const DFS = (node: DPS_Node) => {
    if (node.visited) return;

    node.visited = true;

    changeState(node, 'visiting', true)

    for (let i = 0; i < node.neighbours.length; i++) {
        DFS(DPSGraph.find(e => e.label === node.neighbours[i].label)!);
    }

    changeState(node, 'visited', true)
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

let cycle = false;

export const hasCycle = (graph: NodeType[]) => {
    cycle = false;
    DPSGraph = graph.map((e) => { return { ...e, visited: false } as DPS_Node });
    
    for (let i = 0; i < DPSGraph.length; i++) {
        CycleSeekingDFS(DPSGraph[i], []);
    }

    return cycle;
}

const CycleSeekingDFS = (node: DPS_Node, ancestors: DPS_Node[]) => {
    if(node.visited) return;
    node.visited = true;

    for (let i = 0; i < node.neighbours.length; i++) {
        if(ancestors.find(ancest => ancest.label === node.neighbours[i].label)) {cycle = true; return}
        CycleSeekingDFS(DPSGraph.find(e => e.label === node.neighbours[i].label)!, [...ancestors, node]);    
    }
}

export default applyDPS;