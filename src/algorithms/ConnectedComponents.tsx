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

const DPS = (node: CCNode) => {
    if (node.visited) return;

    node.group = groupNum;
    node.visited = true;

    for (let i = 0; i < node.neighbours.length; i++) {
        DPS(CC_Graph.find(e => e.label === node.neighbours[i].label)!);
    }
}

export default applyConnectedComponents;