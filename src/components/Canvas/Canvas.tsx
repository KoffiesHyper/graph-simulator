import React, { useEffect, useState } from 'react';
import './Canvas.css';
import { addNode, createConnection, EdgeType, NodeType, selectAddingNode, selectAlgorithm, selectConnecting, selectDirected, selectEdges, selectNodes } from '../../features/graph/graphSlice';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import Node from '../Node/Node';
import Edge from '../Edge/Edge';
import applyDijkstra from '../../algorithms/Dijkstra';
import applyKruskal from '../../algorithms/Kruskal';
import { focusEdge, showMessage } from '../../features/menu/menuSlice';
import applyLongestPath from '../../algorithms/LongestPath';
import applyConnectedComponents, { CCNode } from '../../algorithms/ConnectedComponents';
import applyPrim from '../../algorithms/Prim';
import applyBreadthFirstSearch from '../../algorithms/BreadthFirstSearch';

const VIBRANT_COLORS = [
    "rgb(255, 0, 0)", "rgb(255, 153, 51)", "rgb(255, 255, 0)",
    "rgb(0, 255, 0)", "rgb(0, 255, 255)", "rgb(0, 0, 255)",
    "rgb(153, 51, 255)", "rgb(255, 0, 255)", "rgb(255, 102, 0)",
    "rgb(255, 255, 153)", "rgb(51, 153, 255)", "rgb(255, 102, 178)",
    "rgb(0, 153, 204)", "rgb(51, 153, 102)", "rgb(255, 0, 102)",
    "rgb(178, 255, 102)", "rgb(102, 0, 255)", "rgb(102, 255, 204)",
    "rgb(255, 204, 153)", "rgb(153, 255, 51)", "rgb(0, 102, 255)",
    "rgb(153, 51, 0)", "rgb(255, 153, 153)", "rgb(51, 255, 153)",
    "rgb(255, 51, 153)", "rgb(51, 153, 153)", "rgb(153, 153, 153)"
];

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
    const [MST, setMST] = useState<EdgeType[]>([]);
    const [connectedComps, setConnectedComps] = useState<CCNode[]>([]);

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

        if (selectedNodes.length === 2 && algorithm === 'bfs') {
            const graph = applyBreadthFirstSearch(nodes, selectedNodes[0], selectedNodes[1]);
            extractPath(graph, selectedNodes[1]);
            setSelectedNodes([]);
        }

        if (selectedNodes.length === 2 && algorithm === 'longest_path') {
            const graph = applyLongestPath(selectedNodes[0], selectedNodes[1], nodes, edges);
            console.log(graph)
            extractPath(graph, selectedNodes[1]);
            setSelectedNodes([]);
        }
    }, [selectedNodes]);

    useEffect(() => {
        setPath([]);
        setMST([]);
        setConnectedComps([]);

        if (algorithm === 'kruskal') getKruskal();
        if (algorithm === 'prim') getPrim();
        if (algorithm === 'connected_components') getConnectedComponents();
    }, [algorithm]);

    useEffect(() => {
        if (algorithm === 'kruskal') getKruskal();
        if (algorithm === 'connected_components') getConnectedComponents();
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

        if(nodes.length === 26) {
            dispatch(showMessage('Maximum number of nodes reached'))
            return;
        }

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
        let len = 0;

        while (true) {
            for (let i = 0; i < graph.length; i++) {
                if (graph[i].label === currentLabel) {
                    len++;
                    path = [currentLabel, ...path];
                    x = i;
                    break;
                }
            }

            if (len > 100) return path;

            if (graph[x].previous)
                currentLabel = graph[x].previous.label;
            else {
                break;
            }
        }

        for (let i = 0; i < path.length; i++) {
            setTimeout(() => {
                setPath(p => {
                    if(p.length === 0 && i > 0) return [];
                    if(i === 0) return [path[i]]
                    return [...p, path[i]]; 
                })
            }, 500*i)
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
        if (!tree) return;

        for (let i = 0; i < tree.length; i++) {
            setTimeout(() => {
                setMST(mst => {
                    if (mst.length === 0 && i > 0) return mst;
                    return [...mst, tree[i]]
                })
            }, 500 * i)
        }
    }

    const edgeOnKruskal = (edge: string) => {
        if (MST?.find(e => e.connectedNodes === edge)) return true;
        return false;
    }

    const getPrim = () => {
        setMST([]);
        const tree = applyPrim(nodes[0], nodes, edges);

        if (!tree) return;

        for (let i = 0; i < tree.length; i++) {
            setTimeout(() => {
                setMST(mst => {
                    if (mst.length === 0 && i > 0) return mst;
                    return [...mst, tree[i]]
                })
            }, 500 * i)
        }
    }

    const getConnectedComponents = () => {
        const CC_Graph = applyConnectedComponents(nodes);
        setConnectedComps(CC_Graph);
    }

    const getNodeColor = (node: NodeType) => {
        const CC_Node = connectedComps.find(comp => comp.label === node.label);

        if (CC_Node) return VIBRANT_COLORS[CC_Node.group];
        return "rgb(255, 255, 255)"
    }

    const isSelected = (node: NodeType) => {
        for (let i = 0; i < selectedNodes.length; i++) {
            if (selectedNodes[i].label === node.label) return true;
        }

        return false;
    }

    const getBFS = () => {

    }

    const Nodes: React.ReactNode =
        <>
            {
                nodes.map(node => {
                    let color = nodeOnPath(node) ? 'rgb(0, 255, 0)' : 'rgb(255, 255, 255)';
                    if (connectedComps.length > 0) color = getNodeColor(node);
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