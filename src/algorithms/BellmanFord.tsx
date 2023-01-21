import { EdgeType, NodeType } from "../features/graph/graphSlice"; 

interface BF_Node extends NodeType {
    previous: NodeType | undefined,
    dist: number
}

let graph: BF_Node[] = [];
let sortedEdges: EdgeType[] = []

const applyBellmanFord = (startNode: NodeType, nodes: NodeType[], edges: EdgeType[], directed: boolean) => {
    sortedEdges = [];
    orderEdges(startNode, nodes, edges);

    graph = nodes.map(node => { return { ...node, previous: undefined, dist: (node.label === startNode.label) ? 0 : Infinity } })

    for (let i = 0; i < nodes.length - 1; i++) {
        for (let j = 0; j < sortedEdges.length; j++) {
            relaxEdge(sortedEdges[j], nodes, edges, directed);
        }
    }

    return graph
}

const relaxEdge = (relaxedEdge: EdgeType, nodes: NodeType[], edges: EdgeType[], directed: boolean) => {
    const edge = edges.find(e => e.connectedNodes === relaxedEdge.connectedNodes && e.from?.label === relaxedEdge.from?.label);

    if (!edge) return;

    let fromIndex = graph.findIndex(node => node.label === edge.from?.label)
    let toIndex = graph.findIndex(node => node.label === edge.to?.label)

    if(graph[fromIndex].dist === Infinity && !directed) {
        fromIndex = fromIndex + toIndex;
        toIndex = fromIndex - toIndex;
        fromIndex = fromIndex - toIndex
    } 

    if(graph[fromIndex].dist + edge.weight < graph[toIndex].dist){
        graph[toIndex].dist = graph[fromIndex].dist + edge.weight;
        graph[toIndex].previous = edge.from;
    }
}

const orderEdges = (startNode: NodeType, nodes: NodeType[], edges: EdgeType[]) => {
    let queue: NodeType[] = [];
    queue.push(startNode);

    let visited: NodeType[] = [];

    while (queue.length > 0) {
        
        const len = queue.length;

        for (let i = 0; i < len; i++) {
            for (let j = 0; j < queue[i].neighbours.length; j++) {
                if(visited.find(n => n.label === queue[i].neighbours[j].label)) continue;

                const neighbour = queue[i].neighbours[j];
                addEdge(queue[i].label, neighbour.label, edges)
                queue.push(nodes.find(node => node.label === neighbour.label)!)
            }
        }

        for (let i = 0; i < len; i++) {
            visited.push(queue.shift()!);
        }
    }
}

const addEdge = (from: string, to: string, edges: EdgeType[]) => {
    sortedEdges.push(edges.find(e => e.from?.label === from && e.to?.label === to)!);
}

export default applyBellmanFord;