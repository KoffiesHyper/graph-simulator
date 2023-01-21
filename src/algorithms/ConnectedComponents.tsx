import { NodeType } from "../features/graph/graphSlice"; 

export interface CCNode extends NodeType {
    group: number,
    visited: boolean
}

let CC_Graph: CCNode[] = [];
let groupNum = 0;

const applyConnectedComponents = (graph: NodeType[]) => {
    groupNum = 0;

    CC_Graph = graph.map(node => { return {...node, group: 0, visited: false }});

    for (let i = 0; i < CC_Graph.length; i++) {
        if(CC_Graph[i].visited) continue;

        DPS(CC_Graph[i])
        groupNum++;
    }

    return CC_Graph;
}

export const checkOrderIsomorphism = (graph: NodeType[]) => {
    const connectedComps = applyConnectedComponents(graph);

    const graph1 = connectedComps.filter(node => node.group === 0);
    const graph2 = connectedComps.filter(node => node.group === 1);

    if (graph1.length + graph2.length !== connectedComps.length || graph2.length === 0) return 'not_two_graphs';

    let sameNumNodes = graph1.length === graph2.length;

    let graph1NumEdges = 0;
    let graph2NumEdges = 0;

    let graph1NumLoops = 0;
    let graph2NumLoops = 0;

    for (let i = 0; i < graph1.length; i++) {
        for (let j = 0; j < graph1[i].neighbours.length; j++) {
            if(graph1[i].label > graph1[i].neighbours[j].label) continue;
            graph1NumEdges++;
            if(graph1[i].label === graph1[i].neighbours[j].label) graph1NumLoops++;
        }
    }

    for (let i = 0; i < graph2.length; i++) {
        for (let j = 0; j < graph2[i].neighbours.length; j++) {
            if(graph2[i].label > graph2[i].neighbours[j].label) continue;
            graph2NumEdges++;
            if(graph2[i].label === graph2[i].neighbours[j].label) graph2NumLoops++;
        }
    }

    let sameNumEdges = graph1NumEdges === graph2NumEdges;
    let sameNumLoops = graph1NumLoops === graph2NumLoops;

    if(!sameNumNodes) return 'not_isomorphic';

    let graph1DegreeList = graph1.map((node) => node.neighbours.length).sort();
    let graph2DegreeList = graph2.map((node) => node.neighbours.length).sort();

    let sameDegreeList = graph1DegreeList.every((val, index) => val === graph2DegreeList[index]);
    
    if(sameNumEdges && sameDegreeList && sameNumLoops) return 'is_isomorphic'
    else return 'not_isomorphic'
}

const DPS = (node: CCNode) => {
    if (node.visited) return;

    node.group = groupNum;
    node.visited = true;

    for (let i = 0; i < node.neighbours.length; i++) {
        DPS(CC_Graph.find(e => e.label === node.neighbours[i].label)!);
    }
}

export default applyConnectedComponents;