import { EdgeType, NodeType } from "../features/graph/graphSlice";

interface BF_Node extends NodeType {
    prev: NodeType | undefined,
    dist: number
}

let graph: BF_Node[] = [];

const applyBellmanFord = (startNode: NodeType, nodes: NodeType[], edges: EdgeType[]) => {
    graph = nodes.map(node => { return { ...node, prev: undefined, dist: 0 } })


}

const orderEdges = (startNode: NodeType, nodes: NodeType[], edges: EdgeType[]) => {
    let queue: NodeType[] = [];
    queue.push(startNode);

    while (queue.length > 0) {
        for (let i = 0; i < queue.length; i++) {
            for (let i = 0; i < array.length; i++) {
                const element = array[i];
                
            }            
        }
    }
}

export default applyBellmanFord;