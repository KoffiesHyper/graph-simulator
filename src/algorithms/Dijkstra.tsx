import { NodeType } from "../features/graph/graphSlice";

interface DijkstraNodeType extends NodeType {
    previous: NodeType | undefined,
    dist: number
}

let graph = [] as DijkstraNodeType[];
let stack = [] as NodeType[];
let visited = [] as NodeType[];

let startLabel = '';

const applyDijkstra = (start: NodeType, finish: NodeType, nodes: NodeType[]) => {
    graph = [];
    stack = [];
    visited = [];

    startLabel = start.label;

    nodes.forEach(pushNodeToGraph)

    stack.push(start);

    while (stack.length > 0) {
        for (let i = 0; i < stack.length; i++) {

            if (isVisited(stack[i])) continue;

            for (let j = 0; j < stack[i].neighbours.length; j++) {
                if (isVisited(stack[i].neighbours[j])) continue;

                if (getDist(stack[i].label) + 1 < getDist(stack[i].neighbours[j].label)) {
                    setPrev(stack[i].neighbours[j].label, stack[i]);
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

const setPrev = (label: string, prev: NodeType) => {
    for (let i = 0; i < graph.length; i++) {
        if (graph[i].label === label) {
            graph[i].dist = getDist(prev.label) + 1;
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