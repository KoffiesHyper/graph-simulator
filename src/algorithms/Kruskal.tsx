import { EdgeType, NodeType } from "../features/graph/graphSlice"; 
import { hasPath, isConnected } from "./DepthFirstSearch";

const applyKruskal = (nodes: NodeType[], edges: EdgeType[]) => {
    if(!isConnected(nodes)) return [];

    let tree: EdgeType[] = [];
    edges = [...edges];

    const graph: NodeType[] = nodes.map(node => { return { ...node, neighbours: [] } })
    const sortedEdges = edges.sort((a, b) => a.weight - b.weight);

    for (let i = 0; i < sortedEdges.length; i++) {
        if(edgeCreatesCycle(graph, sortedEdges[i])) continue;
        addEdge(sortedEdges[i]);
        if (isConnected(graph)) return tree;
    }

    function addEdge(edge: EdgeType) {
        const labels = edge.connectedNodes.split("");
        tree.push(edge);

        graph.forEach(node => {
            if (node.label === labels[0]) { node.neighbours.push(graph.find(e => e.label === labels[1])!) }
            if (node.label === labels[1]) { node.neighbours.push(graph.find(e => e.label === labels[0])!) }
        })
    }
}

const edgeCreatesCycle = (graph: NodeType[], edge: EdgeType) => {
    return hasPath(graph, edge.connectedNodes.charAt(0), edge.connectedNodes.charAt(1));
}

export default applyKruskal;