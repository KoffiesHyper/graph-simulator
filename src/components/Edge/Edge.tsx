import React from "react";
import './Edge.css';
import { NodeType } from "../../features/nodes/nodesSlice";

type EdgePropsType = {
    from: NodeType,
    to: NodeType,
    color? : string
}

const Edge = ({ from, to, color }: EdgePropsType) => {

    const width = Math.sqrt(Math.pow(from.x! - to.x!, 2) + Math.pow(from.y! - to.y!, 2));
    const height = 5;

    const deltaX = from.x! - to.x!;
    const deltaY = from.y! - to.y!;
    const m = deltaY/deltaX;
    const angle = Math.atan(m);

    const styles: React.CSSProperties = {
        width: width,
        height: height,
        position: 'absolute',
        left: ((from.x! + to.x!) / 2) - width/2 + 25,
        top: ((from.y! + to.y!)) / 2 - height/2 + 25,
        backgroundColor: color ? color : 'red',
        transform: `rotate(${angle}rad)`
    }

    return(
        <div style={styles}>
        </div>
    );
}

export default Edge;