import React from "react";
import "./EdgeMenu.css";
import { disableEdgeMenu, selectFocusedEdge, selectWeighted } from "../../../features/menu/menuSlice";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { EdgeType, flipEdge, removeEdge, removeNode, selectDirected, updateEdgeWeight } from "../../../features/graph/graphSlice";

const EdgeMenu = () => {

    const focusedEdge = useAppSelector(selectFocusedEdge);
    const weighted = useAppSelector(selectWeighted);
    const directed = useAppSelector(selectDirected);

    const dispatch = useAppDispatch();

    const handleChange = (ev: any) => {
        const updatedEdge: EdgeType = {
            ...focusedEdge,
            connectedNodes: focusedEdge?.connectedNodes!,
            weight: parseInt(ev.target.value.toString())
        }

        dispatch(updateEdgeWeight(updatedEdge));
    }

    const handleRemove = () => {
        if (!focusedEdge) return;

        dispatch(removeEdge(focusedEdge));
        dispatch(disableEdgeMenu());
    }

    return (
        <div className="edge-menu">
            <h1>Edge Settings</h1>
            <h3>Connected Nodes: <span style={{ fontWeight: 'lighter' }}>{`${focusedEdge?.connectedNodes.charAt(0)} <-> ${focusedEdge?.connectedNodes.charAt(1)}`}</span></h3>
            <div className="weight">
                <h3>Weight:</h3>
                <input disabled={!weighted} type='number' min='1' onChange={handleChange} />
            </div>
            {directed && <button className="close-btn" onClick={() => dispatch(flipEdge(focusedEdge!.connectedNodes))}>Flip direction</button>}
            <button className="close-btn" onClick={() => dispatch(disableEdgeMenu())}>Close</button>
            <button onClick={handleRemove}>Remove Edge</button>
        </div>
    );
}

export default EdgeMenu;