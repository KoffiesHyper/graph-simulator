import React from "react";
import './Edge.css';
import { NodeType, removeEdge, selectDirected, selectEdges, selectRemoving } from "../../features/graph/graphSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { focusEdge, selectWeighted } from "../../features/menu/menuSlice";

type EdgePropsType = {
    from: NodeType,
    to: NodeType,
    color?: string,
    connectedNodes: string
}

const Edge = ({ from, to, color, connectedNodes }: EdgePropsType) => {
    const edges = useAppSelector(selectEdges);
    const weighted = useAppSelector(selectWeighted);
    const directed = useAppSelector(selectDirected);
    const removing = useAppSelector(selectRemoving)
    const dispatch = useAppDispatch();

    const width = Math.sqrt(Math.pow(from.x! - to.x!, 2) + Math.pow(from.y! - to.y!, 2));
    const height = 5;

    const deltaX = from.x! - to.x!;
    const deltaY = from.y! - to.y!;
    const m = deltaY / deltaX;
    const angle = Math.atan(m);

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

    const handleClick = (ev: any) => {
        const edge = edges.find((e) => e.connectedNodes === connectedNodes)!;

        if(removing) dispatch(removeEdge(edge));
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
                    {(directed && !getDirection()) && <div style={{ borderRight: `20px solid ${color}` }} className="arrowhead start"></div>}
                    {(directed && getDirection()) && <div></div>}
                    {!directed && <div></div>}

                    {weighted && <p style={{ backgroundColor: 'rgb(80, 80, 100)', fontWeight: 'bold' }}>{getWeight()}</p>}
                    {!weighted && <div></div>}

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