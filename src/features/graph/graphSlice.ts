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
    weight: number,
    from?: NodeType,
    to?: NodeType
}

export type AlgorithmType =
    undefined |
    'bfs' |
    'dfs' |
    'dijkstra' |
    'kruskal' |
    'prim' |
    'longest_path' |
    'connected_components' |
    'bellman_ford' |
    'eulerian_path' |
    'eulerian_circuit'

export type GraphStateType = {
    nodes: NodeType[],
    addingNode: boolean,
    connecting: boolean,
    removing: boolean,
    algorithm: AlgorithmType,
    nextNodeLabel: string,
    edges: EdgeType[],
    directed: boolean,
    moving: boolean,
    movingNode: string
}

const initialState: GraphStateType = {
    nodes: [],
    addingNode: false,
    connecting: false,
    removing: false,
    algorithm: undefined,
    nextNodeLabel: 'A',
    edges: [],
    directed: false,
    moving: false,
    movingNode: ''
}

export const nodesSlice = createSlice({
    name: 'nodes',
    initialState,

    reducers: {
        addNode: (state, action: PayloadAction<NodeType>) => {
            const newNode = action.payload;

            const sortedNodes = state.nodes.sort((a, b) => a.label.charCodeAt(0) - b.label.charCodeAt(0));

            for (let i = 0; i < state.nodes.length; i++) {
                if (String.fromCharCode(65 + i) !== sortedNodes[i].label) { state.nextNodeLabel = String.fromCharCode(65 + i); break; }
                else if (i === state.nodes.length - 1) state.nextNodeLabel = String.fromCharCode(sortedNodes[state.nodes.length - 1].label.charCodeAt(0) + 1)
            }


            state.nodes.push({ ...newNode, label: state.nextNodeLabel, y: newNode.y! -70 });
            state.nextNodeLabel = String.fromCharCode(state.nextNodeLabel.charCodeAt(0) + 1);
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
        toggleDirected: (state) => {
            state.directed = !state.directed;
        },
        createConnection: (state, action: PayloadAction<{ firstNode: NodeType, secondNode: NodeType }>) => {
            const { firstNode, secondNode } = action.payload;
            state.nodes.forEach(node => {
                if (node.label === firstNode.label && node.neighbours.findIndex(e => e.label === secondNode.label) === -1) { node.neighbours.push(secondNode) }
                if (node.label === secondNode.label &&
                    node.neighbours.findIndex(e => e.label === firstNode.label) === -1 &&
                    !state.directed) { node.neighbours.push(firstNode) }
            })

            let newEdgeWeight = {} as EdgeType;

            if (firstNode.label < secondNode.label) {
                newEdgeWeight = {
                    connectedNodes: firstNode.label + secondNode.label,
                    weight: 1,
                    from: firstNode,
                    to: secondNode
                }
            }
            else {
                newEdgeWeight = {
                    connectedNodes: secondNode.label + firstNode.label,
                    weight: 1,
                    from: firstNode,
                    to: secondNode
                }
            }

            state.edges.push(newEdgeWeight);
        },
        removeNode: (state, action: PayloadAction<string>) => {
            state.nodes.forEach((node, i) => {
                node.neighbours = node.neighbours.filter(neighbour => neighbour.label !== action.payload);
            })

            state.nodes = state.nodes.filter(node => node.label !== action.payload)

            state.edges.forEach((edge, i) => {
                if (edge.connectedNodes.split("").includes(action.payload)) {
                    state.edges[i].connectedNodes = "deleted"
                }
            })

            state.edges = state.edges.filter(edge => edge.connectedNodes !== "deleted")

            for (let i = 0; i < 26; i++) {
                if (String.fromCharCode(65 + i) !== state.nodes.sort((a, b) => a.label.charCodeAt(0) - b.label.charCodeAt(0))[0].label) { state.nextNodeLabel = String.fromCharCode(65 + i); break; }
            }
        },
        changeAlgorithm: (state, action: PayloadAction<AlgorithmType>) => {
            state.algorithm = action.payload;
        },
        updateEdgeWeight: (state, action: PayloadAction<EdgeType>) => {
            const index = state.edges.findIndex(e => e.connectedNodes === action.payload.connectedNodes && e.from?.label === action.payload.from?.label);
            state.edges[index] = action.payload;
        },
        removeEdge: (state, action: PayloadAction<EdgeType>) => {
            state.edges = state.edges.filter(edge => edge.connectedNodes !== action.payload.connectedNodes)
            const labels = action.payload.connectedNodes.split("");

            state.nodes.forEach(node => {
                if (node.label === labels[0]) node.neighbours = node.neighbours.filter(e => e.label !== labels[1]);
                if (node.label === labels[1]) node.neighbours = node.neighbours.filter(e => e.label !== labels[0]);
            });
        },
        inverseGraph: (state) => {
            if (state.directed) return;
            
            const originalEdges = [...state.edges];
            state.edges = [];

            state.nodes = state.nodes.map(node => { return { ...node, neighbours: [] } });

            state.nodes.forEach(node => {
                state.nodes.forEach(neighbour => {
                    if (node.label === neighbour.label) return;

                    const connectedNodes = (node.label < neighbour.label) ? node.label + neighbour.label : neighbour.label + node.label;
                    if (originalEdges.find(e => e.connectedNodes === connectedNodes)) return;

                    node.neighbours.push({ ...neighbour, neighbours: [] });
                    if (!state.edges.find(e => e.connectedNodes === connectedNodes)) state.edges.push({ connectedNodes: connectedNodes, weight: 1, from: node, to: neighbour })
                })
            })
        },
        resetEdgeWeights: (state) => {
            state.edges = state.edges.map(e => { return { ...e, weight: 1 } });
        },
        flipEdge: (state, action: PayloadAction<EdgeType>) => {
            const edges = state.edges.filter(edge => edge.connectedNodes === action.payload.connectedNodes && edge.from?.label === action.payload.to?.label);
            if (edges.length > 0) return;

            const edge = state.edges.find(edge => edge.connectedNodes === action.payload.connectedNodes && edge.from?.label === action.payload.from?.label);

            if (!edge) return;

            const fromNode = { ...edge.from } as NodeType;
            if (!fromNode) return;

            edge.from = edge.to;
            edge.to = fromNode;

            const fromNodeIndex = state.nodes.findIndex(node => node.label === fromNode.label)!;
            state.nodes[fromNodeIndex].neighbours = state.nodes[fromNodeIndex].neighbours.filter(n => n.label !== edge.from?.label)!;
            state.nodes.find(node => node.label === edge.from?.label)?.neighbours.push(fromNode);
        },
        toggleMoving: (state, action: PayloadAction<boolean>) => {
            state.moving = action.payload;
            state.movingNode = '';
        },
        changeMovingNode: (state, action: PayloadAction<string>) => {
            state.movingNode = action.payload
        },
        updateNodePosition: (state, action: PayloadAction<number[]>) => {
            if (action.payload.length !== 2) return;

            const movingNode = state.nodes.find(node => node.label === state.movingNode);
            if (movingNode) {
                movingNode.x = action.payload[0];
                movingNode.y = action.payload[1] - 70;
            }
        },
        clearCanvas: (state) => {
            state.edges = [];
            state.nodes = [];
            state.nextNodeLabel = 'A'
        }
    },
});

export const {
    addNode,
    toggleAddNode,
    toggleConnecting,
    toggleRemoving,
    toggleDirected,
    createConnection,
    removeNode,
    removeEdge,
    changeAlgorithm,
    updateEdgeWeight,
    inverseGraph,
    resetEdgeWeights,
    flipEdge,
    toggleMoving,
    changeMovingNode,
    updateNodePosition,
    clearCanvas
} = nodesSlice.actions;

export const selectNodes = (state: RootState) => state.graph.nodes;
export const selectEdges = (state: RootState) => state.graph.edges;
export const selectAddingNode = (state: RootState) => state.graph.addingNode;
export const selectConnecting = (state: RootState) => state.graph.connecting;
export const selectRemoving = (state: RootState) => state.graph.removing;
export const selectAlgorithm = (state: RootState) => state.graph.algorithm;
export const selectDirected = (state: RootState) => state.graph.directed;
export const selectMoving = (state: RootState) => state.graph.moving;
export const selectMovingNode = (state: RootState) => state.graph.movingNode;

export default nodesSlice.reducer;