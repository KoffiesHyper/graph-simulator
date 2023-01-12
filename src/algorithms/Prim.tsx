import { EdgeType, NodeType } from "../features/graph/graphSlice";
import { isConnected } from "./DepthFirstSearch";

let tree: EdgeType[] = [];
let treeGraph: NodeType[] = [];
let visited: NodeType[] = [];

const applyPrim = (startingNode: NodeType, nodes: NodeType[], edges: EdgeType[]) => {
    treeGraph = nodes.map(node => { return { ...node, neighbours: [] } })
    visited = [startingNode];

    let edgeSet: EdgeType[] = [];

    let i = 0;

    while (!isConnected(treeGraph)) {
        i++;
        for (let i = 0; i < visited.length; i++) {
            for (let j = 0; j < visited[i].neighbours.length; j++) {
                if (!isVisited(visited[i].neighbours[j])) {
                    edgeSet.push(getEdge(visited[i], visited[i].neighbours[j], edges));
                }
            }
        }

        edgeSet.sort((a, b) => a.weight - b.weight);
        if (edgeSet.length > 0) addEdge(edgeSet[0]);
        edgeSet = [];

        if (i === 20) break;
    }

    return tree;
}

const isVisited = (node: NodeType) => {
    if (visited.find(e => e.label === node.label)) return true;
    return false;
}

const getEdge = (from: NodeType, to: NodeType, edges: EdgeType[]) => {
    const connectedNodes = [from.label, to.label].sort().join('');
    const edge = edges.find(edge => edge.connectedNodes === connectedNodes)!;
    return edge;
}

const addEdge = (edge: EdgeType) => {
    tree.push(edge);
    const labels = edge.connectedNodes.split('');

    let firstNode = treeGraph.findIndex(node => node.label === labels[0]);
    let secondNode = treeGraph.findIndex(node => node.label === labels[1]);

    treeGraph[firstNode].neighbours.push(treeGraph[secondNode]);
    treeGraph[secondNode].neighbours.push(treeGraph[firstNode]);

    if (!visited.find(node => node.label === labels[0])) visited.push(treeGraph[firstNode]);
    if (!visited.find(node => node.label === labels[1])) visited.push(treeGraph[secondNode])

}

export default applyPrim;