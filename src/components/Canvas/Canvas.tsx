import React, { useEffect, useState } from 'react';
import './Canvas.css';
import { addNode, createConnection, EdgeType, NodeType, selectAddingNode, selectAlgorithm, selectConnecting, selectDirected, selectEdges, selectNodes } from '../../features/graph/graphSlice';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import Node from '../Node/Node';
import Edge from '../Edge/Edge';
import applyDijkstra from '../../algorithms/Dijkstra';
import { isConnected } from '../../algorithms/DepthFirstSearch';
import applyKruskal from '../../algorithms/Kruskal';
import { focusEdge } from '../../features/menu/menuSlice';
import applyLongestPath from '../../algorithms/LongestPath';

const Canvas = () => {
    const nodes = useAppSelector(selectNodes);
    const edges = useAppSelector(selectEdges);
    const addingNode = useAppSelector(selectAddingNode);
    const connecting = useAppSelector(selectConnecting);
    const algorithm = useAppSelector(selectAlgorithm);
    const directed = useAppSelector(selectDirected);

    const dispatch = useAppDispatch();

    const [selectedNodes, setSelectedNodes] = useState([] as NodeType[]);
    const [path, setPath] = useState<any[]>([]);
    const [kruskalMST, setKruskalMST] = useState<EdgeType[]>([]);

    useEffect(() => {
        window.addEventListener('mouseclick', handleClick);
    }, []);

    useEffect(() => {
        if (selectedNodes.length === 2 && connecting) {
            handleNewConnection();
        }

        if (selectedNodes.length === 2 && algorithm === 'dijkstra') {
            const graph = applyDijkstra(selectedNodes[0], selectedNodes[1], nodes, edges);
            extractPath(graph, selectedNodes[1]);
            setSelectedNodes([]);
        }

        if (selectedNodes.length === 2 && algorithm === 'longest_path') {
            const graph = applyLongestPath(selectedNodes[0], selectedNodes[1], nodes, edges);
            extractPath(graph, selectedNodes[1]);
            setSelectedNodes([]);
        }
    }, [selectedNodes]);

    useEffect(() => {
        if (algorithm !== 'dijkstra') setPath([]);
        if (algorithm !== 'kruskal') setKruskalMST([]);
        
        if (algorithm === 'kruskal') getKruskal();
    }, [algorithm]);

    useEffect(() => {
        if (algorithm !== 'kruskal') return;
        getKruskal();
    }, [nodes, edges]);

    const nodeRadius = 25;

    interface PositionType {
        x: number | undefined,
        y: number | undefined
    }

    const handleNewConnection = () => {
        setTimeout(() => {
            const connection = {
                firstNode: selectedNodes[0],
                secondNode: selectedNodes[1]
            }

            const connectedNodes = [selectedNodes[0].label, selectedNodes[1].label].sort().join("");
            const newEdge: EdgeType = {
                connectedNodes: connectedNodes,
                weight: 1
            }

            dispatch(createConnection(connection));
            dispatch(focusEdge(newEdge));
            setSelectedNodes([]);
        }, 100);
    }

    const handleClick = (ev: any) => {
        if (!addingNode) return;

        const pos: NodeType = {
            x: ev.clientX - nodeRadius,
            y: ev.clientY - nodeRadius,
            label: "",
            neighbours: []
        }

        if (isOnOtherNode(pos)) {
            return;
        }

        dispatch(addNode(pos));
    }

    const extractPath = (graph: any, finish: any) => {
        let currentLabel = finish.label;
        let path: string[] = [];
        let x = 0;

        while (true) {
            for (let i = 0; i < graph.length; i++) {
                if (graph[i].label === currentLabel) {
                    path = [currentLabel, ...path];
                    x = i;
                    break;
                }
            }

            if (graph[x].previous)
                currentLabel = graph[x].previous.label;
            else {
                setPath(path);
                return;
            }
        }
    }

    const isOnOtherNode = (pos: PositionType) => {
        let on = false;

        nodes.forEach(node => {
            const distanceToNode = Math.sqrt(Math.pow(node.x! - pos.x!, 2) + Math.pow(node.y! - pos.y!, 2));
            if (distanceToNode < nodeRadius * 2 + 10) { on = true; return; }
        })

        return on;
    }

    const nodeOnPath = (node: NodeType) => {
        for (let i = 0; i < path.length; i++) {
            if (node.label === path[i]) {
                return true;
            }
        }

        return false;
    }

    const edgeOnPath = (node1: NodeType, node2: NodeType) => {
        for (let i = 0; i < path.length; i++) {
            if (node1.label === path[i]) {
                if ((i > 0 && path[i - 1] === node2.label) || (i < path.length - 1 && path[i + 1] === node2.label)) return true;
            }
        }

        return false;
    }

    const getKruskal = () => {
        const tree = applyKruskal(nodes, edges);
        if (tree) setKruskalMST(tree);
    }

    const edgeOnKruskal = (edge: string) => {
        if (kruskalMST?.find(e => e.connectedNodes === edge)) return true;
        return false;
    }

    const isSelected = (node: NodeType) => {
        for (let i = 0; i < selectedNodes.length; i++) {
            if (selectedNodes[i].label === node.label) return true;
        }

        return false;
    }

    const Nodes: React.ReactNode =
        <>
            {
                nodes.map(node => {
                    const color = nodeOnPath(node) ? 'rgb(0, 255, 0)' : 'rgb(255, 255, 255)';
                    return <Node key={node.label} node={node} color={color} selected={isSelected(node)} setSelectedNodes={setSelectedNodes} />
                })
            }
        </>

    const Edges: React.ReactNode =
        <>
            {
                nodes.map(node => {
                    return (
                        <>
                            {
                                node.neighbours.map(neighbour => {
                                    const connectedNodes = [node.label, neighbour.label].sort().join('');
                                    if (node.label > neighbour.label && !directed)
                                        return <></>;


                                    return <Edge
                                        from={node}
                                        to={neighbour}
                                        color={edgeOnPath(node, neighbour) || edgeOnKruskal(connectedNodes) ? 'rgb(0, 255, 0)' : 'rgb(255, 255, 255)'}
                                        connectedNodes={connectedNodes}
                                        key={connectedNodes}
                                    />
                                })
                            }
                        </>
                    )
                })
            }
        </>

    return (
        <div className="canvas" onClick={handleClick}>
            {Nodes}
            {Edges}
        </div>
    );

}

export default Canvas;