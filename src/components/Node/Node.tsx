import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectConnecting, selectRemoving, removeNode, toggleRemoving, selectNodes, selectAlgorithm } from "../../features/nodes/nodesSlice";
import type { NodeType } from "../../features/nodes/nodesSlice";
import './Node.css';

type NodePropsType = {
    node: NodeType,
    color: string,
    selected: boolean,
    setSelectedNodes: React.Dispatch<React.SetStateAction<NodeType[]>>
}

const Node = ({ node, color, selected, setSelectedNodes }: NodePropsType) => {
    const dispatch = useAppDispatch();

    const connecting = useAppSelector(selectConnecting);
    const removing = useAppSelector(selectRemoving);
    const algorithm = useAppSelector(selectAlgorithm);

    const handleClick = (ev: any) => {
        if (connecting) {
            setSelectedNodes(nodes => [...nodes, node]);
        }

        if (removing) {
            dispatch(removeNode(node.label));
        }

        if (algorithm === 'dijkstra'){
            setSelectedNodes(nodes => [...nodes, node]);
        }
    }

    const nodeStyle: React.CSSProperties = {
        left: node.x! - 3,
        top: node.y! - 3,
        position: 'absolute',
        width: '50px',
        height: '50px',
        backgroundColor: color,
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
        border: selected ? "3px solid white" : `3px solid ${color}`
    };

    return (
        <div className='node' style={nodeStyle} onClick={handleClick}>
            <p style={{ fontSize: 20, color: 'white', fontWeight: 'bold' }}>{node.label}</p>
        </div>
    );
}

export default Node;