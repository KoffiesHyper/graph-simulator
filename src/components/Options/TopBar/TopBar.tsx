import React from "react";
import './TopBar.css';
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { changeAlgorithm, selectConnecting, selectRemoving, selectAlgorithm, toggleConnecting, toggleRemoving } from "../../../features/graph/graphSlice";

const TopBar = () => {
    const dispatch = useAppDispatch();
    const connecting = useAppSelector(selectConnecting);
    const removing = useAppSelector(selectRemoving);
    const algorithm = useAppSelector(selectAlgorithm);

    const disableAllActions = () => {
        dispatch(toggleConnecting(false));
        dispatch(toggleRemoving(false));
        dispatch(changeAlgorithm(undefined));
    }

    const handleConnectClick = (ev: any) => {
        disableAllActions();
        dispatch(toggleConnecting(!connecting));
    }

    const handleRemoveClick = (ev: any) => {
        disableAllActions();
        dispatch(toggleRemoving(true));
    }

    const handleDijkstraClick = (ev: any) => {
        disableAllActions();
        dispatch(changeAlgorithm('dijkstra'));
    }

    return (
        <div className='topbar'>
            <button style={{ backgroundColor: connecting ? 'lime' : 'red' }} onClick={handleConnectClick}>{connecting ? 'Connecting' : 'Connect'}</button>
            <button style={{ backgroundColor: removing ? 'lime' : 'red' }} onClick={handleRemoveClick}>{removing ? 'Removing' : 'Remove'}</button>
            <button style={{ backgroundColor: (algorithm === 'dijkstra') ? 'lime' : 'red' }} onClick={handleDijkstraClick}>{(algorithm === 'dijkstra') ? 'Applying Dijkstra' : 'Dijkstra'}</button>
        </div>
    );
}

export default TopBar;