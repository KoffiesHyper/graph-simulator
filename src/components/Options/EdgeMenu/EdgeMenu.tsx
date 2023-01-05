import React from "react";
import "./EdgeMenu.css";
import { EdgeType } from "../../../features/graph/graphSlice";
import { selectFocusedEdge } from "../../../features/menu/menuSlice";
import { useAppSelector } from "../../../app/hooks";

const EdgeMenu = () => {

    const edge = useAppSelector(selectFocusedEdge);

    const handleChange = (ev: any) => {
        
    }

    return (
        <div className="edge-menu">
            <h1>Edge Settings</h1>
            <h2>{edge?.connectedNodes}</h2>
            <h3>Weight</h3>
            <input type='number' min='1' onChange={handleChange} />
        </div>
    );
}

export default EdgeMenu;