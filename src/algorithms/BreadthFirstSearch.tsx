import { NodeType } from "../features/graph/graphSlice";

type NodeState = 'current' | 'queued' | 'visited' | 'searched' | 'target' | '';

export interface BFS_Node extends NodeType {
    visited: boolean,
    previous: NodeType | null,
    state: NodeState
}

let timeline: BFS_Node[][] = [];
let graph: BFS_Node[] = [];
let queue: BFS_Node[] = [];

const applyBreadthFirstSearch = (nodes: NodeType[], start: NodeType, finish: NodeType) => {
    graph = [];
    queue = [];

    graph = nodes.map(node => { return { ...node, visited: false, previous: null, state: '' } });

    timeline.push([...graph]);

    let startNode = graph.find(node => node.label === start.label)!;

    queue.push(startNode);
    changeState(startNode, 'queued')

    while (queue.length > 0) {
        for (let i = 0; i < queue.length; i++) {
            changeState(queue[i], 'current');
            for (let j = 0; j < queue[i].neighbours.length; j++) {

                if (!isVisited(queue[i].neighbours[j])) {

                    changeState(queue[i].neighbours[j] as BFS_Node, 'searched');
                    setPrev(queue[i].neighbours[j], queue[i]);

                    if (queue[i].neighbours[j].label === finish.label) {
                        changeState(queue[i].neighbours[j] as BFS_Node, 'target');
                        return timeline
                    } else changeState(queue[i].neighbours[j] as BFS_Node, '');
                }
            }
        }

        const len = queue.length;

        for (let i = 0; i < len; i++) {
            setVisited(queue[i]);
            queue = [...queue, ...getNeighbours(queue[i])]
        }

        for (let i = 0; i < len; i++) {
            changeState(queue[i], 'visited');
            queue.shift();
        }
    }

    return timeline;
}

const changeState = (node: BFS_Node, state: NodeState) => {
    let index = graph.findIndex(n => n.label === node.label);
    if (index !== -1) {
        graph[index] = { ...graph[index], state };
        timeline.push([...graph]);
    }
}

const setVisited = (node: BFS_Node) => {
    for (let i = 0; i < graph.length; i++) {
        if (graph[i].label === node.label) graph[i].visited = true;
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

        if (!newNode.visited) {
            neighbours.push(newNode);
            changeState(newNode, 'queued')
        }
    }

    return neighbours;
}

export default applyBreadthFirstSearch;