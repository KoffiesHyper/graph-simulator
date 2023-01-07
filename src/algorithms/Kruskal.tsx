import { EdgeType, NodeType } from "../features/graph/graphSlice";
import { isConnected } from "./DepthFirstSearch";

const applyKruskal = (nodes: NodeType[], edges: EdgeType[]) => {
    let tree

    const graph: NodeType[] = nodes.map(node => { return {...node, neighbours: [] } })
    const sortedEdges = edges.sort((a, b) => a.weight - b.weight);

    for (let i = 0; i < sortedEdges.length; i++) {
        addEdge(sortedEdges[i]);
        if (isConnected(nodes)) return 
        
    }
}

export default applyKruskal;