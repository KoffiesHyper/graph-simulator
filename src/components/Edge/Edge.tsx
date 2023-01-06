import React from "react";
import './Edge.css';
import { NodeType, selectEdges } from "../../features/graph/graphSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { focusEdge } from "../../features/menu/menuSlice";

type EdgePropsType = {
    from: NodeType,
    to: NodeType,
    color?: string,
    connectedNodes: string
}

const Edge = ({ from, to, color, connectedNodes }: EdgePropsType) => {

    const edges = useAppSelector(selectEdges);
    const dispatch = useAppDispatch();

    const width = Math.sqrt(Math.pow(from.x! - to.x!, 2) + Math.pow(from.y! - to.y!, 2));
    const height = 5;

    const deltaX = from.x! - to.x!;
    const deltaY = from.y! - to.y!;
    const m = deltaY / deltaX;
    const angle = Math.atan(m);

    const shadowColor = `rgba(${color!.substring(4, color!.length-1)}, 0.2)`;

    const styles: React.CSSProperties = {
        width: width,
        height: height,
        position: 'absolute',
        left: ((from.x! + to.x!) / 2) - width / 2 + 25,
        top: ((from.y! + to.y!)) / 2 - height / 2 + 25,
        transform: `rotate(${angle}rad)`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }

    if (color !== 'rgb(255, 0, 0)') {
        styles.backgroundColor = color;
    }

    const handleClick = (ev: any) => {
        const edge = edges.find((e) => e.connectedNodes === connectedNodes);

        if (edge) dispatch(focusEdge(edge));
    }

    const getWeight = () => {
        return edges.find(e => e.connectedNodes === connectedNodes)?.weight;
    }

    return (
        <div className="edge" style={styles} onClick={handleClick}>
            <p style={{backgroundColor: 'rgb(80, 80, 80)', fontWeight: 'bold'}}>{getWeight()}</p>
        </div>
    );
}

export default Edge;