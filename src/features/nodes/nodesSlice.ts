import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export type NodeType = {
    x: number | undefined,
    y: number | undefined,
    label: string,
    neighbours: NodeType[]
}

type AlgorithmType = undefined | 'dijkstra';

export type NodesState = {
    nodes: NodeType[],
    connecting: boolean,
    removing: boolean,
    algorithm: AlgorithmType
}

const initialState: NodesState = {
    nodes: [],
    connecting: false,
    removing: false,
    algorithm: undefined
}

export const nodesSlice = createSlice({
    name: 'nodes',
    initialState,

    reducers: {
        addNode: (state, action: PayloadAction<NodeType>) => {
            const newNode = action.payload;
            state.nodes.push(newNode);
        },
        toggleConnecting: (state, action: PayloadAction<boolean>) => {
            state.connecting = action.payload;
        },
        toggleRemoving: (state, action: PayloadAction<boolean>) => {
            state.removing = action.payload;
        },
        createConnection: (state, action: PayloadAction<{ firstNode: NodeType, secondNode: NodeType }>) => {
            const { firstNode, secondNode } = action.payload;
            state.nodes.forEach(node => {
                if (node.label === firstNode.label) { node.neighbours.push(secondNode) }
                if (node.label === secondNode.label) { node.neighbours.push(firstNode) }
            })
        },
        removeNode: (state, action: PayloadAction<string>) => {
            state.nodes.forEach((node, i) => {
                if (node.label === action.payload) {
                    state.nodes.splice(i, 1);
                }
                else {
                    node.neighbours.forEach((neighbour, j) => {
                        if (neighbour.label === action.payload) {
                            console.log(node.label + ": " + neighbour.label + ' - ' + action.payload)
                            state.nodes[i].neighbours.splice(j, 1);
                        }
                    })
                }
            })
        },
        changeAlgorithm: (state, action: PayloadAction<AlgorithmType>) => {
            state.algorithm = action.payload;
        }
    }
});

export const { addNode, toggleConnecting, toggleRemoving, createConnection, removeNode, changeAlgorithm } = nodesSlice.actions;

export const selectNodes = (state: RootState) => state.nodes.nodes;
export const selectConnecting = (state: RootState) => state.nodes.connecting;
export const selectRemoving = (state: RootState) => state.nodes.removing;
export const selectAlgorithm = (state: RootState) => state.nodes.algorithm;


export default nodesSlice.reducer;