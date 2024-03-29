import Edge from "../components/Edge/Edge"; 
import { EdgeType, NodeType } from "../features/graph/graphSlice";

interface DijkstraNodeType extends NodeType {
    previous: NodeType | undefined,
    dist: number
}

let graph = [] as DijkstraNodeType[];
let stack = [] as NodeType[];
let visited = [] as NodeType[];

let startLabel = '';

const applyDijkstra = (start: NodeType, finish: NodeType, nodes: NodeType[], edges: EdgeType[], directed: boolean) => {
    graph = [];
    stack = [];
    visited = [];

    startLabel = start.label;

    nodes.forEach(pushNodeToGraph)

    stack.push(start);

    while (stack.length > 0) {
        for (let i = 0; i < stack.length; i++) {

            for (let j = 0; j < stack[i].neighbours.length; j++) {
                if (getDist(stack[i].label) + parseInt(getWeight(stack[i].label, stack[i].neighbours[j].label, edges, directed).toString()) < getDist(stack[i].neighbours[j].label)) {
                    setPrev(stack[i].neighbours[j].label, stack[i], edges, directed);
                    if (visited.find(e => e.label === stack[i].neighbours[j].label)) stack.push(getNodeWithLabel(stack[i].neighbours[j].label)!)
                }
            }

            visited.push(stack[i]);
        }

        const len = stack.length;

        for (let i = 0; i < len; i++) {
            for (let j = 0; j < stack[i].neighbours.length; j++) {
                if (!isVisited(stack[i].neighbours[j])) stack.push(getNodeWithLabel(stack[i].neighbours[j].label)!);
            }
        }

        for (let i = 0; i < len; i++) {
            stack.shift();
        }
    }

    return graph;
}

const getWeight = (nodeLabel: string, neighbourLabel: string, edges: EdgeType[], directed: boolean): number => {
    const connectedNodes = (nodeLabel < neighbourLabel) ? nodeLabel + neighbourLabel : neighbourLabel + nodeLabel;

    const weight = edges.find(edge => edge.connectedNodes === connectedNodes && (!directed || edge.from?.label === nodeLabel))?.weight;

    if (weight) return weight; else return 0;
}

const pushNodeToGraph = (node: NodeType) => {
    graph.push(
        {
            ...node,
            previous: undefined,
            dist: (node.label === startLabel) ? 0 : Infinity
        } as DijkstraNodeType
    );
}

const isVisited = (node: NodeType) => {
    for (let i = 0; i < visited.length; i++) {
        if (visited[i].label === node.label) return true;
    }

    return false;
}

const getDist = (label: string) => {
    for (let i = 0; i < graph.length; i++) {
        if (graph[i].label === label) return graph[i].dist!;
    }

    return 0;
}

const setPrev = (label: string, prev: NodeType, edges: EdgeType[], directed: boolean) => {
    for (let i = 0; i < graph.length; i++) {
        if (graph[i].label === label) {
            graph[i].dist = getDist(prev.label) + parseInt(getWeight(prev.label, label, edges, directed).toString());
            graph[i].previous = prev
        }
    }
}

const getNodeWithLabel = (label: string): NodeType | null => {
    let nodeWithLabel = null;

    graph.forEach(isNodeWithLabel);

    function isNodeWithLabel(node: NodeType) {
        if (node.label === label) {
            nodeWithLabel = node;
            return;
        }
    }

    return nodeWithLabel;
}

export default applyDijkstra;