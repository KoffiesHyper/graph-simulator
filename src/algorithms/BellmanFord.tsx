import { EdgeType, NodeType } from "../features/graph/graphSlice";

interface BF_Node extends NodeType {
    prev: NodeType | undefined,
    dist: number
}

let graph: BF_Node[] = [];
const applyBellmanFord = (startNode: NodeType, nodes: NodeType[], edges: EdgeType[]) => {
    graph = nodes.map(node => { return { ...node, prev: undefined, dist: 0 } })


}

export default applyBellmanFord;