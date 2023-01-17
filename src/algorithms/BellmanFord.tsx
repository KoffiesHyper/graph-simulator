import { EdgeType, NodeType } from "../features/graph/graphSlice";

interface BF_Node extends NodeType {
    prev: NodeType | undefined,
    dist: number
}

let graph: BF_Node[] = [];
let sortedEdgeLabels: string[] = []

const applyBellmanFord = (startNode: NodeType, nodes: NodeType[], edges: EdgeType[], directed: boolean) => {
    sortedEdgeLabels = [];
    orderEdges(startNode, nodes);
    console.log(sortedEdgeLabels);

    graph = nodes.map(node => { return { ...node, prev: undefined, dist: (node.label === startNode.label) ? 0 : Infinity } })

    for (let i = 0; i < nodes.length - 1; i++) {
        for (let j = 0; j < sortedEdgeLabels.length; j++) {
            relaxEdge(sortedEdgeLabels[j], nodes, edges, directed);
        }
    }

    return graph
}

const relaxEdge = (connectedNodes: string, nodes: NodeType[], edges: EdgeType[], directed: boolean) => {
    const edge = edges.find(e => e.connectedNodes === connectedNodes);

    if (!edge) return;

    let fromIndex = graph.findIndex(node => node.label === edge.from?.label)
    let toIndex = graph.findIndex(node => node.label === edge.to?.label)

    if(graph[fromIndex].dist === Infinity && !directed) {
        fromIndex = fromIndex + toIndex;
        toIndex = fromIndex - toIndex;
        fromIndex = fromIndex - toIndex
    } 

    if(graph[fromIndex].dist + edge.weight < graph[toIndex].dist){
        if(connectedNodes.includes('F')) console.log('nice')
        graph[toIndex].dist = graph[fromIndex].dist + edge.weight;
        graph[toIndex].prev = edge.from;
    }
}

const orderEdges = (startNode: NodeType, nodes: NodeType[]) => {
    let queue: NodeType[] = [];
    queue.push(startNode);

    let visited: NodeType[] = [];

    while (queue.length > 0) {
        
        const len = queue.length;

        for (let i = 0; i < len; i++) {
            for (let j = 0; j < queue[i].neighbours.length; j++) {
                if(visited.find(n => n.label === queue[i].neighbours[j].label)) continue;

                const neighbour = queue[i].neighbours[j];
                addEdge(queue[i].label, neighbour.label)
                queue.push(nodes.find(node => node.label === neighbour.label)!)
            }
        }

        for (let i = 0; i < len; i++) {
            visited.push(queue.shift()!);
        }
    }
}

const addEdge = (from: string, to: string) => {
    const connectedNodes = (from < to) ? from + to : to + from;
    if (!sortedEdgeLabels.includes(connectedNodes)) sortedEdgeLabels.push(connectedNodes);
}

export default applyBellmanFord;