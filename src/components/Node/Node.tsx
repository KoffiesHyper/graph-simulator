import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectConnecting, selectRemoving, removeNode, selectAlgorithm, selectEdges, selectNodes, selectMoving, changeMovingNode, selectMovingNode } from "../../features/graph/graphSlice";
import type { NodeType } from "../../features/graph/graphSlice";
import './Node.css';
import { selectDegrees } from "../../features/menu/menuSlice";
import { hasCycle } from "../../algorithms/DepthFirstSearch";

type NodePropsType = {
    node: NodeType,
    color: string,
    selected: boolean,
    state: string | undefined,
    setSelectedNodes: React.Dispatch<React.SetStateAction<NodeType[]>>
}

const Node = ({ node, color, selected, state, setSelectedNodes }: NodePropsType) => {
    const dispatch = useAppDispatch();

    const connecting = useAppSelector(selectConnecting);
    const removing = useAppSelector(selectRemoving);
    const algorithm = useAppSelector(selectAlgorithm);
    const showDegrees = useAppSelector(selectDegrees);
    const edges = useAppSelector(selectEdges);
    const nodes = useAppSelector(selectNodes);
    const moving = useAppSelector(selectMoving);
    const movingNode = useAppSelector(selectMovingNode);

    const [stateColor, setStateColor] = useState('');

    useEffect(() => {
        switch (state) {
            case 'current':
                setStateColor('rgb(255, 0, 0)')
                break;
            case 'queued':
                setStateColor('rgb(255, 165, 0)')
                break;
            case 'searched':
                setStateColor('rgb(255, 255, 0)')
                break;
            case 'visited':
                setStateColor('rgb(128, 128, 128)')
                break;
            case 'target':
                setStateColor('rgb(0, 255, 0)')
                break;
            case 'visiting':
                setStateColor('rgb(255, 165, 0)')
                break;
            default:
                setStateColor('')
                break;
        }
    }, [state])

    const handleClick = (ev: any) => {
        if (connecting) {
            setSelectedNodes(nodes => [...nodes, node]);
        }

        if (removing) {
            dispatch(removeNode(node.label));
        }

        if (algorithm === 'dijkstra' || algorithm === 'longest_path' || algorithm === 'bfs' || algorithm === 'bellman_ford' || algorithm === 'dfs') {
            setSelectedNodes(nodes => [...nodes, node]);
        }
    }

    const handleMouseDown = () => {
        if (!moving) return;
        dispatch(changeMovingNode(node.label));
    }

    const handleMouseUp = () => {
        if (!moving) return;
        dispatch(changeMovingNode(''));
    }

    if (stateColor.length > 0) color = stateColor

    const shadowColor = `rgba(${color.substring(4, color.length - 1)}, 0.2)`;

    if (movingNode === node.label) color = `rgb(200, 200, 200)`;

    const nodeStyle: React.CSSProperties = {
        left: node.x! - 3,
        top: node.y! - 3,
        position: 'absolute',
        width: '47px',
        height: '47px',
        backgroundColor: (stateColor.length > 0) ? stateColor : color,
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
        border: selected ? "3px solid white" : `3px solid ${(stateColor.length > 0) ? stateColor : color}`,
        boxShadow: `0 4px 8px 0 ${shadowColor}, 0 6px 20px 0 ${shadowColor}`,
        cursor: (moving && movingNode === node.label ) ? 'grabbing' : ((moving) ? 'grab' : 'cursor')
    };

    return (
        <div id='node' className={`node ${color === 'rgb(255, 255, 255)' ? 'plotted' : 'highlighted'}`} style={nodeStyle} onClick={handleClick} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
            <p style={{ fontSize: 20, color: 'rgb(80, 80, 80)', fontWeight: 'bold' }}>{node.label}</p>
            {showDegrees && <p className="degree">{node.neighbours.length}</p>}
            {selected && <div className="indicator"></div>}
        </div>
    );
}

export default Node;