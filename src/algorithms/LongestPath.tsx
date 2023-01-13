import Edge from "../components/Edge/Edge";
import { EdgeType, NodeType } from "../features/graph/graphSlice";

interface LPNodeType extends NodeType {
    previous: NodeType | undefined,
    dist: number
}

let graph = [] as LPNodeType[];
let stack = [] as NodeType[];
let visited = [] as NodeType[];

let startLabel = '';

const applyLongestPath = (start: NodeType, finish: NodeType, nodes: NodeType[], edges: EdgeType[]) => {
    graph = [];
    stack = [];
    visited = [];

    startLabel = start.label;

    nodes.forEach(pushNodeToGraph)

    stack.push(start);

    let x = 0;
    while (stack.length > 0) {
        console.log({...stack})
        for (let i = 0; i < stack.length; i++) {
            
            // x++;
            // if (x > 20) return;
            for (let j = 0; j < stack[i].neighbours.length; j++) {
                if (getDist(stack[i].label) + parseInt(getWeight(stack[i].label, stack[i].neighbours[j].label, edges).toString()) > getDist(stack[i].neighbours[j].label)) {
                    setPrev(stack[i].neighbours[j].label, stack[i], edges);
                    // if (visited.find(e => e.label === stack[i].neighbours[j].label)) stack.push(getNodeWithLabel(stack[i].neighbours[j].label)!)
                }
            }
            console.log({...stack})

            visited.push(stack[i]);
        }

        const len = stack.length;

        for (let i = 0; i < len; i++) {
            for (let j = 0; j < stack[i].neighbours.length; j++) {
                if (!isVisited(stack[i].neighbours[j])) stack.push(getNodeWithLabel(stack[i].neighbours[j].label)!);
            }
        }
        console.log({...stack})

        for (let i = 0; i < len; i++) {
            stack.shift();
        }
    }

    return graph;
}

const getWeight = (nodeLabel: string, neighbourLabel: string, edges: EdgeType[]): number => {
    const connectedNodes = (nodeLabel < neighbourLabel) ? nodeLabel + neighbourLabel : neighbourLabel + nodeLabel;

    const weight = edges.find(edge => edge.connectedNodes === connectedNodes)?.weight;

    if (weight) return weight; else return 0;
}

const pushNodeToGraph = (node: NodeType) => {
    graph.push(
        {
            ...node,
            previous: undefined,
            dist: 0
        } as LPNodeType
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

const setPrev = (label: string, prev: NodeType, edges: EdgeType[]) => {
    for (let i = 0; i < graph.length; i++) {
        if (graph[i].label === label) {
            graph[i].dist = getDist(prev.label) + parseInt(getWeight(label, prev.label, edges).toString());
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

export default applyLongestPath;