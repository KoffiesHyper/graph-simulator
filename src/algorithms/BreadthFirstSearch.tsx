import { NodeType } from "../features/graph/graphSlice";

type NodeState = string;

export interface BFS_Node extends NodeType {
    visited: boolean,
    previous: NodeType | null,
    state: NodeState
}

let timeline: BFS_Node[][] = [];
let graph: BFS_Node[] = [];
let queue: BFS_Node[] = [];

const applyBreadthFirstSearch = (nodes: NodeType[], start: NodeType, finish: NodeType) => {
    timeline = [];
    graph = [];
    queue = [];

    graph = nodes.map(node => { return { ...node, visited: false, previous: null, state: '' } });

    saveState();

    let startNode = graph.find(node => node.label === start.label)!;

    queue.push(startNode);
    changeState(startNode, 'queued', false)

    while (queue.length > 0) {
        for (let i = 0; i < queue.length; i++) {
            changeState(queue[i], 'current', true);
            for (let j = 0; j < queue[i].neighbours.length; j++) {

                if (!isVisited(queue[i].neighbours[j])) {
                    const originState = getNodeState(queue[i].neighbours[j])
                    changeState(queue[i].neighbours[j] as BFS_Node, 'searched', true);
                    setPrev(queue[i].neighbours[j], queue[i]);

                    if (queue[i].neighbours[j].label === finish.label) {
                        changeState(queue[i].neighbours[j] as BFS_Node, 'target', true);
                        return timeline
                    } else changeState(queue[i].neighbours[j] as BFS_Node, originState, false);
                }
            }
            changeState(queue[i], 'visited', true);
        }

        const len = queue.length;

        for (let i = 0; i < len; i++) {
            setVisited(queue[i]);
            queue = [...queue, ...getNeighbours(queue[i])]
        }

        saveState();

        for (let i = 0; i < len; i++) {
            changeState(queue[i], 'visited', false);
            queue.shift();
        }
    }

    return timeline;
}

const getNodeState = (node: NodeType) => {
    const index = graph.findIndex(n => n.label === node.label);
    if(index > -1) return graph[index].state;
    return '';
}

const saveState = () => {
    timeline.push([...graph]);
}

const changeState = (node: BFS_Node, state: NodeState, save: boolean) => {
    let index = graph.findIndex(n => n.label === node.label);
    if (index !== -1) {
        if(graph[index].state === 'visited') return;
        if(state === 'searched' && !graph.find(n => n.state === 'current')) return
        graph[index] = { ...graph[index], state };
        if (save) timeline.push([...graph]);
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
            changeState(newNode, 'queued', false)
        }
    }

    return neighbours;
}

export default applyBreadthFirstSearch;