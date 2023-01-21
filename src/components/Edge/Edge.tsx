import React, { useEffect, useState } from "react";
import './Edge.css';
import { NodeType, removeEdge, selectAlgorithm, selectDirected, selectEdges, selectNodes, selectRemoving } from "../../features/graph/graphSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { focusEdge, selectWeighted } from "../../features/menu/menuSlice";
import { BFS_Node } from "../../algorithms/BreadthFirstSearch";
import { DPS_Node } from "../../algorithms/DepthFirstSearch";

type EdgePropsType = {
    from: NodeType,
    to: NodeType,
    color?: string,
    connectedNodes: string,
    animState: BFS_Node[],
    path: string[]
}

const Edge = ({ from, to, color, connectedNodes, animState, path }: EdgePropsType) => {
    const edges = useAppSelector(selectEdges);
    const weighted = useAppSelector(selectWeighted);
    const directed = useAppSelector(selectDirected);
    const removing = useAppSelector(selectRemoving);
    const algorithm = useAppSelector(selectAlgorithm);
    const nodes = useAppSelector(selectNodes);
    const dispatch = useAppDispatch();

    const [stateColor, setStateColor] = useState('');

    useEffect(() => {
        if (animState.length === 0) { setStateColor(''); return; }

        const fromState = animState.find(node => node.label === from.label)!;
        const toState = animState.find(node => node.label === to.label)!;

        if ((fromState.state === 'searched' && toState.state === 'current') ||
            (toState.state === 'searched' && fromState.state === 'current')) setStateColor('rgb(255, 255, 0)')
        else if ((fromState.state === 'target' && toState.state === 'current') ||
            (toState.state === 'target' && fromState.state === 'current')) setStateColor('rgb(0, 255, 0)')
        else if (fromState.state === 'visited' || toState.state === 'visited') setStateColor('grey')
        else setStateColor('');
    }, [animState])

    const width = Math.sqrt(Math.pow(from.x! - to.x!, 2) + Math.pow(from.y! - to.y!, 2));
    const height = 5;

    const deltaX = from.x! - to.x!;
    const deltaY = from.y! - to.y!;
    const m = deltaY / deltaX;
    let angle = Math.atan(m);

    const shadowColor = `rgba(${color!.substring(4, color!.length - 1)}, 0.2)`;

    let styles: React.CSSProperties = {};

    const isLoop = from.label === to.label;

    const getOffset = (dir: string) => {
        const parralelEdges = edges.filter(e => e.connectedNodes === connectedNodes);
        if (parralelEdges.length <= 1) return 0;

        let dist = 15;

        const parralelEdge = edges.find(e => e.connectedNodes === connectedNodes && from.label === e.from?.label);
        if (parralelEdge?.from?.label! < parralelEdge?.to?.label!) return (dir === 'vert') ? dist * Math.cos(angle) : dist * Math.cos(Math.PI / 2 - angle)
        else if (parralelEdge?.from?.label! > parralelEdge?.to?.label!) return (dir === 'vert') ? -dist * Math.cos(angle) : -dist * Math.cos(Math.PI / 2 - angle)

        return 0;
    }

    if (isLoop) {
        styles = {
            width: '40px',
            height: '40px',
            position: 'absolute',
            left: from.x! - 2,
            top: from.y! - 40,
            border: '5px solid white',
            borderRadius: '50%',
            transform: 'scaleY(1.1)'
        }
    }
    else {
        styles = {
            width: width,
            height: height,
            position: 'absolute',
            left: ((from.x! + to.x!) / 2) - width / 2 + 25 + getOffset('hori'),
            top: ((from.y! + to.y!)) / 2 - height / 2 + 25 + getOffset('vert'),
            transform: `rotate(${angle}rad)`
        }
    }


    let highlighted = false;

    if (color !== 'rgb(255, 255, 255)') {
        // styles.backgroundColor = color;
        highlighted = true;
    }

    if (stateColor.length > 0) {
        styles.backgroundColor = stateColor;
    }

    const getColor = () => {
        return (stateColor.length > 0) ? stateColor : color;
    }

    const handleClick = (ev: any) => {
        const edge = edges.find((e) => e.connectedNodes === connectedNodes && (!directed || e.from?.label === from.label))!;

        if (removing) dispatch(removeEdge(edge));
        else if (edge) dispatch(focusEdge(edge));
    }

    const getWeight = () => {
        return edges.find(e => e.connectedNodes === connectedNodes && (!directed || (directed && from.label === e.from?.label)))?.weight;
    }

    const getDirection = () => {
        let fromX = 0, toX = 0;

        if (!directed && path.includes(from.label) && path.includes(to.label)) {
            const fromIndex = path.findIndex((node, i) => node === from.label && ((to.label === path[i + 1]) || (to.label === path[i - 1])));
            if(fromIndex === -1) return;
            if (fromIndex < path.length - 1 && path[fromIndex + 1] === to.label) {
                fromX = nodes.find(node => node.label === path[fromIndex])!.x!;
                toX = nodes.find(node => node.label === path[fromIndex + 1])!.x!;
            } else {
                toX = nodes.find(node => node.label === path[fromIndex])!.x!;
                fromX = nodes.find(node => node.label === path[fromIndex - 1])!.x!;
            }
        } else {
            const edge = edges.find(e => e.connectedNodes === connectedNodes && e.from?.label === from.label);

            if (!(edge?.from && edge?.to && edge)) return false;
            if (!(edge?.from.x && edge?.to.x)) return false;

            fromX = nodes.find(node => node.label === edge.from?.label)!.x!;
            toX = nodes.find(node => node.label === edge.to?.label)!.x!;
        }



        if (fromX < toX) return true;
        return false;
    }

    const getAlgoColor = () => {
        switch (algorithm) {
            case 'dijkstra':
                return 'rgb(0, 183, 255)'
            case 'prim':
                return 'rgb(118,0,253)'
            case 'kruskal':
                return '#ff0063'
            case 'eulerian_path':
                return 'gold'
            case 'eulerian_circuit':
                return 'gold'
            case 'bellman_ford':
                return '#00ff96'
            case 'longest_path':
                return 'red'
            default:
                return 'lime'
        }
    }

    const swipeStyles: React.CSSProperties = {
        backgroundColor: getAlgoColor(),
        boxShadow: `inset 0 0 0.5em ${getAlgoColor()}, 0 0 0.5em ${getAlgoColor()}`,
        left: getDirection() ? '0' : 'unset',
        right: !getDirection() ? '0' : 'unset'
    }

    return (
        <>
            {!isLoop &&
                <div className={`edge ${highlighted ? 'highlighted' : ''}`} style={styles} onClick={handleClick}>
                    {highlighted && <div className="swipe" style={swipeStyles}></div>}

                    {(directed && !getDirection()) && <div style={{ borderRight: `20px solid ${color}` }} className="arrowhead start"></div>}
                    {(directed && getDirection()) && <div></div>}
                    {!directed && <div></div>}

                    {weighted && <p style={{ backgroundColor: 'rgb(80, 80, 100)', fontWeight: 'bold' }}>{getWeight()}</p>}

                    {(directed && getDirection()) && <div style={{ borderLeft: `20px solid ${color}` }} className="arrowhead end"></div>}
                    {(directed && !getDirection()) && <div></div>}
                    {!directed && <div></div>}
                </div>
            }

            {isLoop &&
                <div className={`loop ${highlighted ? 'highlighted' : ''}`} style={styles} onClick={handleClick}>
                    {weighted && <p style={{ backgroundColor: 'rgb(80, 80, 100)', fontWeight: 'bold' }}>{getWeight()}</p>}
                </div>
            }
        </>
    );
}

export default Edge;