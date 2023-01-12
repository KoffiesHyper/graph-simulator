import { startTrackValue } from "@testing-library/user-event/dist/types/document/trackValue";
import { NodeType } from "../features/graph/graphSlice";

interface BFS_Node extends NodeType {
    visited: boolean,
    prev: BFS_Node
}

let queue: BFS_Node[] = [];

const applyBreadthFirstSearch = (nodes: NodeType[], start: NodeType, finish: NodeType) => {
    let graph: BFS_Node[] = nodes.map(node => { return { ...node, visited: false, prev: {} as BFS_Node } });

    let startNode = graph.find(node => node.label === start.label)!;

    queue.push(startNode);

    while(queue.length > 0){
        for (let i = 0; i < queue.length; i++) {
            for (let j = 0; j < queue[i].neighbours.length; j++) {
                if(!isVisited(queue[i].neighbours[j])){
                    setPrev
                }
            }
        }
    }
}

const isVisited = (node: NodeType) => {

}

export default applyBreadthFirstSearch;