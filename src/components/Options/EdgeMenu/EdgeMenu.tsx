import React from "react";
import "./EdgeMenu.css";
import { selectFocusedEdge } from "../../../features/menu/menuSlice";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { EdgeType, updateEdgeWeight } from "../../../features/graph/graphSlice";

const EdgeMenu = () => {

    const edge = useAppSelector(selectFocusedEdge);
    const dispatch = useAppDispatch();

    const handleChange = (ev: any) => {
        const updatedEdge: EdgeType = {
            connectedNodes: edge?.connectedNodes!,
            weight: ev.target.value
        }

        dispatch(updateEdgeWeight(updatedEdge));
    }

    return (
        <div className="edge-menu">
            <h1>Edge Settings</h1>
            <h3>Connected Nodes: <span style={{fontWeight: 'lighter'}}>{`${edge?.connectedNodes.charAt(0)} <-> ${edge?.connectedNodes.charAt(1)}`}</span></h3>
            <div className="weight">
                <h3>Weight:</h3>
                <input type='number' min='1' onChange={handleChange} />
            </div>
        </div>
    );
}

export default EdgeMenu;