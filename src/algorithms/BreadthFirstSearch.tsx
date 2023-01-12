import { NodeType } from "../features/graph/graphSlice";

interface BFS_Node extends NodeType {
    visited: boolean,
    previous: NodeType | null
}

let graph: BFS_Node[] = [];
let queue: BFS_Node[] = [];

const applyBreadthFirstSearch = (nodes: NodeType[], start: NodeType, finish: NodeType) => {
    graph = [];
    queue = [];

    graph = nodes.map(node => { return { ...node, visited: false, previous: null } });

    let startNode = graph.find(node => node.label === start.label)!;

    queue.push(startNode);

    while (queue.length > 0) {
        for (let i = 0; i < queue.length; i++) {
            for (let j = 0; j < queue[i].neighbours.length; j++) {
                if (!isVisited(queue[i].neighbours[j])) {
                    setPrev(queue[i].neighbours[j], queue[i]);

                    if (queue[i].neighbours[j].label === finish.label) return graph;
                }
            }
        }

        const len = queue.length;

        for (let i = 0; i < len; i++) {
            setVisited(queue[i]);
            queue = [...queue, ...getNeighbours(queue[i])]
        }

        for (let i = 0; i < len; i++) {
            queue.shift();
        }
    }
    
    return graph;
}

const setVisited = (node: BFS_Node) => {
    for (let i = 0; i < graph.length; i++) {
        if(graph[i].label === node.label) graph[i].visited = true;
    }
}

const isVisited = (node: NodeType) => {
    for (let i = 0; i < graph.length; i++) {
        if (graph[i].label === node.label && graph[i].visited) return true;
    }

    return false;
}

const setPrev = (node: NodeType, prev: NodeType) => {
    for (let i = 0; i < graph.length; i++) {
        if (graph[i].label === node.label && graph[i].previous === null) {
            graph[i].previous = prev;
        }
    }
}

const getNeighbours = (visitedNode: BFS_Node): BFS_Node[] => {
    let neighbours: BFS_Node[] = [];

    for (let i = 0; i < visitedNode.neighbours.length; i++) {
        const newNode = graph.find(node => node.label === visitedNode.neighbours[i].label)!;

        if (!newNode.visited) neighbours.push(newNode);
    }

    return neighbours;
}

export default applyBreadthFirstSearch;