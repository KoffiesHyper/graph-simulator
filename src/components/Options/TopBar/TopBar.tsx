import React, { useEffect, useState } from "react";
import './TopBar.css';
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { changeAlgorithm, selectConnecting, selectRemoving, selectAlgorithm, toggleConnecting, toggleRemoving, selectAddingNode, toggleAddNode, resetEdgeWeights, inverseGraph, toggleDirected, selectDirected, AlgorithmType } from "../../../features/graph/graphSlice";
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
    const directed = useAppSelector(selectDirected);

    const [actionExpanded, setActionExpanded] = useState(false);
    const [algoExpanded, setAlgoExpanded] = useState(false);

    useEffect(() => {
        if (actionExpanded) setAlgoExpanded(false)
    }, [actionExpanded])

    useEffect(() => {
        if (algoExpanded) setActionExpanded(false)
    }, [algoExpanded])

    const disableAllActions = () => {
        dispatch(toggleAddNode(false));
        dispatch(toggleConnecting(false));
        dispatch(toggleRemoving(false));
        dispatch(changeAlgorithm(undefined));
    }

    const handleAddNodeClick = () => {
        disableAllActions();
        dispatch(toggleAddNode(!addingNode));
    }

    const handleConnectClick = () => {
        disableAllActions();
        dispatch(toggleConnecting(!connecting));
    }

    const handleRemoveClick = () => {
        disableAllActions();
        dispatch(toggleRemoving(!removing));
    }

    const handleAlgorithmClick = (algorithm: AlgorithmType) => {
        disableAllActions();
        dispatch(changeAlgorithm(algorithm));
    }

    const weightActionTitle = weighted ? 'switch_to_unweighted_graph' : 'switch_to_weighted_graph';
    const directedActionTitle = directed ? 'switch_to_undirected_graph' : 'switch_to_directed_graph';
    const degreesTitle = degrees ? 'hide_degrees' : 'show_degrees';
    const invertTitle = 'convert_to_inverse_graph';

    const algoActions: ActionsType = {
        dijkstra: () => handleAlgorithmClick('dijkstra'),
        kruskal: () => handleAlgorithmClick('kruskal'),
        prim: () => handleAlgorithmClick('prim'),
        longest_path: () => handleAlgorithmClick('longest_path'),
        connected_components: () => handleAlgorithmClick('connected_components'),
        breadth_first_search: () => handleAlgorithmClick('bfs')
    }

    const otherActions: ActionsType = {
        [weightActionTitle]: () => { dispatch(toggleWeighted(!weighted)); dispatch(resetEdgeWeights()) },
        [directedActionTitle]: () => { dispatch(toggleDirected()) },
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
            <button className="first-btn" style={{ borderLeft: '2px solid white', color: addingNode ? 'lime' : 'white' }} onClick={handleAddNodeClick}>{addingNode ? 'Adding Node' : 'Add Node'}</button>
            <button style={{ color: connecting ? 'lime' : 'white' }} onClick={handleConnectClick}>{connecting ? 'Adding Edge' : 'Add Edge'}</button>
            <button style={{ color: removing ? 'lime' : 'white' }} onClick={handleRemoveClick}>{removing ? 'Removing' : 'Remove'}</button>
            {/* <button style={{ color: (algorithm === 'dijkstra') ? 'lime' : 'white' }} onClick={handleDijkstraClick}>{(algorithm === 'dijkstra') ? 'Applying Dijkstra' : 'Dijkstra'}</button> */}
            {/* <button style={{ color: (algorithm === 'kruskal') ? 'lime' : 'white' }} onClick={handleKruskalClick}>{(algorithm === 'kruskal') ? 'Applying Kruskal' : 'Kruskal'}</button> */}
            {/* <button style={{ color: (algorithm === 'longest_path') ? 'lime' : 'white' }} onClick={handleLongestPathClick}>{(algorithm === 'longest_path') ? 'Applying Longest Path' : 'Longest Path'}</button> */}
            
            <button onClick={() => setAlgoExpanded(exp => !exp)} >Algorithms
                {algoExpanded &&
                    <div className="action-list">
                        {
                            Object.entries(algoActions).map(entry => {
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

            <button className="last-btn" onClick={() => setActionExpanded(exp => !exp)} >Other Actions
                {actionExpanded &&
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