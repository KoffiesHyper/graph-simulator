import { NodeType } from "../features/graph/graphSlice";

let outArray: number[] = [];
let path: string[] = [];

const applyEulerPath = (nodes: NodeType[], directed: boolean, circuit: boolean) => {
    if (!hasEulerianPath(nodes, directed)) return [];
    if (circuit && !hasEulerianCircuit(nodes, directed)) return [];

    outArray = nodes.map(node => node.neighbours.length);
    path = [];

    DFS(getStartingNode(nodes), nodes);

    return path;
}

const DFS = (node: NodeType, nodes: NodeType[]) => {
    console.log(node)
    let index = nodes.findIndex(n => n.label === node.label);

    while (outArray[index] > 0) {
        DFS(getNeighbour(node.neighbours[--outArray[index]], nodes)!, nodes);
    }

    path = [node.label, ...path];
}

const getNeighbour = (node: NodeType, nodes: NodeType[]) => {
    return nodes.find(n => n.label === node.label)
}

const getStartingNode = (nodes: NodeType[]) => {
    let index = 0;

    for (let i = 0; i < nodes.length; i++) {
        if (outDegree(nodes[i]) - inDegree(nodes[i], nodes) === 1) return { ...nodes[i] } as NodeType;
        if (outDegree(nodes[i]) > 0) index = i;
    }

    return { ...nodes[index] } as NodeType;
}
export const hasEulerianPath = (nodes: NodeType[], directed: boolean) => {
    if (!directed) {
        let numOddNodes = 0;
        nodes.forEach(node => { if (node.neighbours.length % 2 !== 0) numOddNodes++ })

        if (numOddNodes === 0 || numOddNodes === 2) return true;
        else return false;
    }
    else {
        let equalDegrees = 0, moreIn = 0, moreOut = 0;

        nodes.forEach(node => {
            if (outDegree(node) === inDegree(node, nodes)) equalDegrees++;
            if (outDegree(node) - inDegree(node, nodes) === 1) moreOut++;
            if (inDegree(node, nodes) - outDegree(node) === 1) moreIn++;
        })

        if (equalDegrees + moreIn + moreOut !== nodes.length) return false;

        if (moreIn <= 1 && moreOut <= 1) return true;
    }
}

export const hasEulerianCircuit = (nodes: NodeType[], directed: boolean) => {
    if (!directed) {
        return nodes.every((node) => node.neighbours.length % 2 === 0);
    }
    else {
        return nodes.every((node) => inDegree(node, nodes) === outDegree(node))
    }
}

const outDegree = (node: NodeType) => {
    return node.neighbours.length;
}

const inDegree = (node: NodeType, nodes: NodeType[]) => {
    let degree = 0;

    nodes.forEach(n => {
        if (n.neighbours.find(neighbour => neighbour.label === node.label)) degree++;
    })

    return degree;
}

export default applyEulerPath;