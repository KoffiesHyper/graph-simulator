import React from "react";
import './TopBar.css';
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { changeAlgorithm, selectConnecting, selectRemoving, selectAlgorithm, toggleConnecting, toggleRemoving, selectAddingNode, toggleAddNode } from "../../../features/graph/graphSlice";

const TopBar = () => {
    const dispatch = useAppDispatch();

    const addingNode = useAppSelector(selectAddingNode);
    const connecting = useAppSelector(selectConnecting);
    const removing = useAppSelector(selectRemoving);
    const algorithm = useAppSelector(selectAlgorithm);

    const disableAllActions = () => {
        dispatch(toggleAddNode(false));
        dispatch(toggleConnecting(false));
        dispatch(toggleRemoving(false));
        dispatch(changeAlgorithm(undefined));
    }

    const handleAddNodeClick = (ev: any) => {
        disableAllActions();
        dispatch(toggleAddNode(!addingNode));
    }

    const handleConnectClick = (ev: any) => {
        disableAllActions();
        dispatch(toggleConnecting(!connecting));
    }

    const handleRemoveClick = (ev: any) => {
        disableAllActions();
        dispatch(toggleRemoving(!removing));
    }

    const handleDijkstraClick = (ev: any) => {
        disableAllActions();
        dispatch(changeAlgorithm('dijkstra'));
    }

    const handleKruskalClick = (ev: any) => {
        disableAllActions();
        dispatch(changeAlgorithm('kruskal'));
    }

    return (
        <div className='topbar'>
            <button style={{ backgroundColor: addingNode ? 'lime' : 'red' }} onClick={handleAddNodeClick}>{addingNode ? 'Adding Node' : 'Add Node'}</button>
            <button style={{ backgroundColor: connecting ? 'lime' : 'red' }} onClick={handleConnectClick}>{connecting ? 'Connecting' : 'Connect'}</button>
            <button style={{ backgroundColor: removing ? 'lime' : 'red' }} onClick={handleRemoveClick}>{removing ? 'Removing' : 'Remove'}</button>
            <button style={{ backgroundColor: (algorithm === 'dijkstra') ? 'lime' : 'red' }} onClick={handleDijkstraClick}>{(algorithm === 'dijkstra') ? 'Applying Dijkstra' : 'Dijkstra'}</button>
            <button style={{ backgroundColor: (algorithm === 'kruskal') ? 'lime' : 'red' }} onClick={handleKruskalClick}>{(algorithm === 'kruskal') ? 'Applying Kruskal' : 'Kruskal'}</button>
        </div>
    );
}

export default TopBar;