import React, { useState } from "react";
import './TopBar.css';
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { changeAlgorithm, selectConnecting, selectRemoving, selectAlgorithm, toggleConnecting, toggleRemoving, selectAddingNode, toggleAddNode, resetEdgeWeights, inverseGraph } from "../../../features/graph/graphSlice";
import { selectDegrees, selectWeighted, toggleDegrees, toggleWeighted } from "../../../features/menu/menuSlice";

type ActionsType = {
    [index: string]: () => void
}

const TopBar = () => {
    const dispatch = useAppDispatch();

    const addingNode = useAppSelector(selectAddingNode);
    const connecting = useAppSelector(selectConnecting);
    const removing = useAppSelector(selectRemoving);
    const algorithm = useAppSelector(selectAlgorithm);
    const weighted = useAppSelector(selectWeighted);
    const degrees = useAppSelector(selectDegrees);

    const [expanded, setExpanded] = useState(false);

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

    const handleLongestPathClick = (ev: any) => {
        disableAllActions();
        dispatch(changeAlgorithm('longest_path'));
    }

    const weightActionTitle = weighted ? 'switch_to_unweighted_graph' : 'switch_to_weighted_graph';
    const degreesTitle = degrees ? 'hide_degrees' : 'show_degrees';
    const invertTitle = 'convert_to_inverse_graph'

    const otherActions: ActionsType = {
        [weightActionTitle]: () => { dispatch(toggleWeighted(!weighted)); dispatch(resetEdgeWeights()) },
        [degreesTitle]: () => dispatch(toggleDegrees()),
        [invertTitle]: () => dispatch(inverseGraph())
    }

    const formalize = (text: string) => {
        const splittedText = text.split('_');
        splittedText[0] = splittedText[0].charAt(0).toUpperCase() + splittedText[0].slice(1);
        return splittedText.join(' ');
    }

    return (
        <div className='topbar'>
            <button style={{ borderColor: addingNode ? 'lime' : 'red' }} onClick={handleAddNodeClick}>{addingNode ? 'Adding Node' : 'Add Node'}</button>
            <button style={{ borderColor: connecting ? 'lime' : 'red' }} onClick={handleConnectClick}>{connecting ? 'Connecting' : 'Connect'}</button>
            <button style={{ borderColor: removing ? 'lime' : 'red' }} onClick={handleRemoveClick}>{removing ? 'Removing' : 'Remove'}</button>
            <button style={{ borderColor: (algorithm === 'dijkstra') ? 'lime' : 'red' }} onClick={handleDijkstraClick}>{(algorithm === 'dijkstra') ? 'Applying Dijkstra' : 'Dijkstra'}</button>
            <button style={{ borderColor: (algorithm === 'kruskal') ? 'lime' : 'red' }} onClick={handleKruskalClick}>{(algorithm === 'kruskal') ? 'Applying Kruskal' : 'Kruskal'}</button>
            <button style={{ borderColor: (algorithm === 'longest_path') ? 'lime' : 'red' }} onClick={handleLongestPathClick}>{(algorithm === 'longest_path') ? 'Applying Longest Path' : 'Longest Path'}</button>
            
            <button onClick={() => setExpanded(exp => !exp)} >Other Actions
                {expanded &&
                    <div className="action-list">
                        {
                            Object.entries(otherActions).map(entry => {
                                return(
                                    <div className="action" onClick={entry[1]}>
                                        <p>{formalize(entry[0])}</p>
                                    </div>
                                )
                            })
                        }
                    </div>
                }
            </button>
        </div>
    );
}

export default TopBar;