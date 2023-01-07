import React, { useEffect, useState } from 'react';
import './Canvas.css';
import { addNode, createConnection, EdgeType, NodeType, selectAddingNode, selectAlgorithm, selectConnecting, selectEdges, selectNodes } from '../../features/graph/graphSlice';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import Node from '../Node/Node';
import Edge from '../Edge/Edge';
import applyDijkstra from '../../algorithms/Dijkstra';
import { isConnected } from '../../algorithms/DepthFirstSearch';
import applyKruskal from '../../algorithms/Kruskal';

const Canvas = () => {
    const nodes = useAppSelector(selectNodes);
    const edges = useAppSelector(selectEdges);
    const addingNode = useAppSelector(selectAddingNode);
    const connecting = useAppSelector(selectConnecting);
    const algorithm = useAppSelector(selectAlgorithm);

    const dispatch = useAppDispatch();

    const [selectedNodes, setSelectedNodes] = useState([] as NodeType[]);
    const [dPath, setDPath] = useState<any[]>([]);
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
            console.log(graph)
            extractPath(graph, selectedNodes[1]);
            setSelectedNodes([]);
        }
    }, [selectedNodes]);

    useEffect(() => {
        if (algorithm !== 'dijkstra') setDPath([]);
    }, [algorithm]);

    useEffect(() => {
        const MST = applyKruskal(nodes, edges);
        if(MST)
            setKruskalMST(MST);
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

            dispatch(createConnection(connection));
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
                setDPath(path);
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

    const nodeOnDPath = (node: NodeType) => {
        for (let i = 0; i < dPath.length; i++) {
            if (node.label === dPath[i]) {
                return true;
            }
        }

        return false;
    }

    const edgeOnDPath = (node1: NodeType, node2: NodeType) => {
        for (let i = 0; i < dPath.length; i++) {
            if (node1.label === dPath[i]) {
                if ((i > 0 && dPath[i - 1] === node2.label) || (i < dPath.length - 1 && dPath[i + 1] === node2.label)) return true;
            }
        }

        return false;
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
                    const color = nodeOnDPath(node) ? 'rgb(0, 255, 0)' : 'rgb(255, 0, 0)';
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
                                    if (node.label > neighbour.label)
                                        return <></>;


                                    return <Edge
                                        from={node}
                                        to={neighbour}
                                        color={edgeOnDPath(node, neighbour) || edgeOnKruskal(node.label + neighbour.label) ? 'rgb(0, 255, 0)' : 'rgb(255, 0, 0)'}
                                        connectedNodes={node.label + neighbour.label}
                                        key={node.label + neighbour.label}
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