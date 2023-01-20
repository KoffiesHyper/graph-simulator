import React from "react";
import "./EdgeMenu.css";
import { disableEdgeMenu, selectFocusedEdge, selectWeighted } from "../../../features/menu/menuSlice";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { EdgeType, flipEdge, removeEdge, removeNode, selectDirected, selectEdges, updateEdgeWeight } from "../../../features/graph/graphSlice";
import { IconContext } from "react-icons";
import { SlGraph } from "react-icons/sl";

const EdgeMenu = () => {

    let focusedEdge = useAppSelector(selectFocusedEdge);
    const weighted = useAppSelector(selectWeighted);
    const directed = useAppSelector(selectDirected);
    const edges = useAppSelector(selectEdges);

    focusedEdge = edges.find(edge => edge.from?.label === focusedEdge?.from?.label && edge.to?.label === focusedEdge?.to?.label)!;

    const dispatch = useAppDispatch();

    if(!focusedEdge) dispatch(disableEdgeMenu())

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
            <div className="heading">
                <div className="heading-icon"><IconContext.Provider value={{color: 'white', size: '25px'}}><SlGraph /></IconContext.Provider></div>
                <h1>Edge Settings</h1>
            </div>
            <h3 style={{marginBottom: '0px', marginTop: '20px'}}>Connected Nodes: <span style={{ fontWeight: 'lighter' }}>{`${focusedEdge?.from?.label} to ${focusedEdge?.to?.label}`}</span></h3>
            <div className="weight">
                <h3>Weight:</h3>
                <input disabled={!weighted} type='number' min='1' onChange={handleChange} />
            </div>
            {directed && <button className="close-btn" onClick={() => dispatch(flipEdge(focusedEdge!))}>Flip direction</button>}
            <button className="close-btn" onClick={() => dispatch(disableEdgeMenu())}>Close</button>
            <button onClick={handleRemove}>Remove Edge</button>
        </div>
    );
}

export default EdgeMenu;