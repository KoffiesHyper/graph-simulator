import React from "react";
import './TopBar.css';
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { changeAlgorithm, selectConnecting, toggleConnecting, toggleRemoving } from "../../../features/nodes/nodesSlice";

const TopBar = () => {
    const dispatch = useAppDispatch();
    const connecting = useAppSelector(selectConnecting);

    const handleConnectClick = (ev: any) => {
        dispatch(toggleConnecting(!connecting));
    }

    const handleRemoveClick = (ev: any) => {
        dispatch(toggleRemoving(true));
    }

    const handleDijkstraClick = (ev: any) => {
        dispatch(toggleConnecting(false));
        dispatch(changeAlgorithm('dijkstra'));
    }

    return(
        <div className='topbar'>
            <button style={{backgroundColor: connecting ? 'lime' : 'red'}} onClick={handleConnectClick}>Connect</button>
            <button onClick={handleRemoveClick}>Remove</button>
            <button onClick={handleDijkstraClick}>Dijkstra</button>
        </div>
    );
}

export default TopBar;