import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export interface NodeType {
    x: number | undefined,
    y: number | undefined,
    label: string,
    neighbours: NodeType[]
}

export type EdgeType = {
    connectedNodes: string,
    weight: number
}

type AlgorithmType = undefined | 'dijkstra' | 'kruskal';

export type GraphStateType = {
    nodes: NodeType[],
    addingNode: boolean,
    connecting: boolean,
    removing: boolean,
    algorithm: AlgorithmType,
    nextNodeLabel: string,
    edges: EdgeType[]
}

const initialState: GraphStateType = {
    nodes: [],
    addingNode: false,
    connecting: false,
    removing: false,
    algorithm: undefined,
    nextNodeLabel: 'A',
    edges: []
}

export const nodesSlice = createSlice({
    name: 'nodes',
    initialState,

    reducers: {
        addNode: (state, action: PayloadAction<NodeType>) => {
            const newNode = action.payload;
            newNode.label = state.nextNodeLabel;
            state.nextNodeLabel = String.fromCharCode(state.nextNodeLabel.charCodeAt(0) + 1);
            state.nodes.push(newNode);
        },
        toggleAddNode: (state, action: PayloadAction<boolean>) => {
            state.addingNode = action.payload;
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
                if (node.label === firstNode.label && node.neighbours.findIndex(e => e.label === secondNode.label) === -1) { node.neighbours.push(secondNode) }
                if (node.label === secondNode.label && node.neighbours.findIndex(e => e.label === firstNode.label) === -1) { node.neighbours.push(firstNode) }
            })

            let newEdgeWeight = {} as EdgeType;

            if (firstNode.label < secondNode.label) {
                newEdgeWeight = {
                    connectedNodes: firstNode.label + secondNode.label,
                    weight: 1
                }
            }
            else {
                newEdgeWeight = {
                    connectedNodes: secondNode.label + firstNode.label,
                    weight: 1
                }
            }

            state.edges.push(newEdgeWeight);
        },
        removeNode: (state, action: PayloadAction<string>) => {
            state.nodes.forEach((node, i) => {
                if (node.label === action.payload) {
                    state.nodes.splice(i, 1);
                }
                else {
                    node.neighbours.forEach((neighbour, j) => {
                        if (neighbour.label === action.payload) {
                            state.nodes[i].neighbours.splice(j, 1);
                        }
                    })
                }
            })

            state.edges.forEach((edge, i) => {
                if (edge.connectedNodes.split("").includes(action.payload)) {
                    state.edges[i].connectedNodes = "deleted"
                }
            })

            state.edges = state.edges.filter(edge => edge.connectedNodes !== "deleted")
        },
        changeAlgorithm: (state, action: PayloadAction<AlgorithmType>) => {
            state.algorithm = action.payload;
        },
        updateEdgeWeight: (state, action: PayloadAction<EdgeType>) => {
            const index = state.edges.findIndex(e => e.connectedNodes === action.payload.connectedNodes);
            state.edges[index] = action.payload;
        },
        removeEdge: (state, action: PayloadAction<EdgeType>) => {
            state.edges = state.edges.filter(edge => edge.connectedNodes !== action.payload.connectedNodes)
            const labels = action.payload.connectedNodes.split("");

            state.nodes.forEach(node => {
                if(node.label === labels[0]) node.neighbours = node.neighbours.filter(e => e.label !== labels[1]);
                if(node.label === labels[1]) node.neighbours = node.neighbours.filter(e => e.label !== labels[0]);
            });
        }
    }
});

export const { addNode, toggleAddNode, toggleConnecting, toggleRemoving, createConnection, removeNode, removeEdge, changeAlgorithm, updateEdgeWeight } = nodesSlice.actions;

export const selectNodes = (state: RootState) => state.graph.nodes;
export const selectEdges = (state: RootState) => state.graph.edges;
export const selectAddingNode = (state: RootState) => state.graph.addingNode;
export const selectConnecting = (state: RootState) => state.graph.connecting;
export const selectRemoving = (state: RootState) => state.graph.removing;
export const selectAlgorithm = (state: RootState) => state.graph.algorithm;

export default nodesSlice.reducer;