import React, { useEffect, useState } from "react";
import './Edge.css';
import { NodeType, removeEdge, selectDirected, selectEdges, selectRemoving } from "../../features/graph/graphSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { focusEdge, selectWeighted } from "../../features/menu/menuSlice";
import { BFS_Node } from "../../algorithms/BreadthFirstSearch";

type EdgePropsType = {
    from: NodeType,
    to: NodeType,
    color?: string,
    connectedNodes: string,
    animState: BFS_Node[]
}

const Edge = ({ from, to, color, connectedNodes, animState }: EdgePropsType) => {
    const edges = useAppSelector(selectEdges);
    const weighted = useAppSelector(selectWeighted);
    const directed = useAppSelector(selectDirected);
    const removing = useAppSelector(selectRemoving)
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

    // if (angle < 0) angle = angle + Math.PI;

    const shadowColor = `rgba(${color!.substring(4, color!.length - 1)}, 0.2)`;

    let styles: React.CSSProperties = {};

    const isLoop = from.label === to.label;

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
            left: ((from.x! + to.x!) / 2) - width / 2 + 25,
            top: ((from.y! + to.y!)) / 2 - height / 2 + 25,
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
        const edge = edges.find((e) => e.connectedNodes === connectedNodes)!;

        if (removing) dispatch(removeEdge(edge));
        else if (edge) dispatch(focusEdge(edge));
    }

    const getWeight = () => {
        return edges.find(e => e.connectedNodes === connectedNodes)?.weight;
    }

    const getDirection = () => {
        const edge = edges.find(e => e.connectedNodes === connectedNodes);

        if (!(edge?.from && edge?.to && edge)) return false;
        if (!(edge?.from.x && edge?.to.x)) return false;

        if (edge.from.x > edge.to.x) return false;
        return true;
    }

    return (
        <>
            {!isLoop &&
                <div className={`edge ${highlighted ? 'highlighted' : ''}`} style={styles} onClick={handleClick}>
                    {(directed && !getDirection()) && <div style={{ borderRight: `20px solid ${getColor()}` }} className="arrowhead start"></div>}
                    {(directed && getDirection()) && <div></div>}
                    {!directed && <div></div>}

                    {weighted && <p style={{ backgroundColor: 'rgb(80, 80, 100)', fontWeight: 'bold' }}>{getWeight()}</p>}
                    {!weighted && <div></div>}

                    {(directed && getDirection()) && <div style={{ borderLeft: `20px solid ${getColor()}` }} className="arrowhead end"></div>}
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