import React, { useEffect, useState } from "react";
import './TopBar.css';
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { changeAlgorithm, selectConnecting, selectRemoving, selectAlgorithm, toggleConnecting, toggleRemoving, selectAddingNode, toggleAddNode, resetEdgeWeights, inverseGraph, toggleDirected, selectDirected, AlgorithmType, toggleMoving, changeMovingNode, selectMoving, selectNodes, clearCanvas } from "../../../features/graph/graphSlice";
import { disableEdgeMenu, focusEdge, selectDegrees, selectWeighted, showMessage, toggleDegrees, toggleWeighted } from "../../../features/menu/menuSlice";
import { IoMdAddCircleOutline, IoMdSettings } from 'react-icons/io'
import { SlGraph } from 'react-icons/sl'
import { RiDeleteBin5Line } from 'react-icons/ri'
import { FaCodeBranch } from 'react-icons/fa'
import { FiMove } from 'react-icons/fi'
import TopBarButton from "./TopBarButton";
import { checkOrderIsomorphism } from "../../../algorithms/ConnectedComponents";

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
    const moving = useAppSelector(selectMoving);
    const nodes = useAppSelector(selectNodes);

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
        dispatch(toggleMoving(false));
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

    const handleMoveClick = () => {
        disableAllActions();
        dispatch(toggleMoving(true))
    }

    const handleRemoveClick = () => {
        disableAllActions();
        dispatch(toggleRemoving(!removing));
    }

    const handleAlgorithmClick = (algorithm: AlgorithmType) => {
        if (algorithm === 'bfs' && weighted) {
            dispatch(showMessage('Breadth-first search only works with unweighted graphs.'))
            return;
        }

        if ((algorithm === 'kruskal' || algorithm === 'prim') && directed) {
            dispatch(showMessage(`${formalize(algorithm)}'s algorithm only works on undirected graphs.`))
            return;
        }

        if ((algorithm === 'longest_path' || algorithm === 'bellman_ford') && !directed) {
            dispatch(showMessage(`The ${formalize(algorithm)} algorithm only works on directed graphs.`))
            return;
        }

        if(algorithm === 'dijkstra' || algorithm === 'longest_path' || algorithm === 'bfs' || algorithm === 'bellman_ford'){
            dispatch(showMessage(`info-Choose a start and finish node.`))
        }

        if(algorithm === 'dfs'){
            dispatch(showMessage(`info-Choose a start node.`))
        }

        disableAllActions();
        dispatch(changeAlgorithm(algorithm));
    }

    const handleIsomorphism = () => {
        const result = checkOrderIsomorphism(nodes);

        switch (result) {
            case 'not_two_graphs':
                dispatch(showMessage('There are not two seperate graphs.'))
                break;
            case 'not_isomorphic':
                dispatch(showMessage('info-The graphs are not isomorphic.'))
                break;
            case 'is_isomorphic':
                dispatch(showMessage('info-The graphs are isomorphic.'))
                break;
        }
    }

    const weightActionTitle = weighted ? 'switch_to_unweighted_graph' : 'switch_to_weighted_graph';
    const directedActionTitle = directed ? 'switch_to_undirected_graph' : 'switch_to_directed_graph';
    const degreesTitle = degrees ? 'hide_degrees' : 'show_degrees';
    const invertTitle = 'convert_to_inverse_graph';
    const isomorphismTitle = 'check_isomorphism';

    const algoActions: ActionsType = {
        breadth_first_search: () => handleAlgorithmClick('bfs'),
        depth_first_search: () => handleAlgorithmClick('dfs'),
        dijkstra: () => handleAlgorithmClick('dijkstra'),
        kruskal: () => handleAlgorithmClick('kruskal'),
        prim: () => handleAlgorithmClick('prim'),
        longest_path: () => handleAlgorithmClick('longest_path'),
        connected_components: () => handleAlgorithmClick('connected_components'),
        bellman_ford: () => handleAlgorithmClick('bellman_ford'),
        eulerian_path: () => handleAlgorithmClick('eulerian_path'),
        eulerian_circuit: () => handleAlgorithmClick('eulerian_circuit')
    }

    const otherActions: ActionsType = {
        [weightActionTitle]: () => { dispatch(toggleWeighted(!weighted)); dispatch(resetEdgeWeights()) },
        [directedActionTitle]: () => { dispatch(toggleDirected()); dispatch(clearCanvas()); dispatch(disableEdgeMenu()) },
        [degreesTitle]: () => dispatch(toggleDegrees()),
        [invertTitle]: () => dispatch(inverseGraph()),
        [isomorphismTitle]: () => handleIsomorphism(),
        reset: () => {dispatch(clearCanvas()); dispatch(disableEdgeMenu());}
    }

    const formalize = (text: string) => {
        const splittedText = text.split('_');
        splittedText[0] = splittedText[0].charAt(0).toUpperCase() + splittedText[0].slice(1);
        return splittedText.join(' ');
    }

    return (
        <div className='topbar'>
            <button className="first-btn" style={{ borderLeft: '2px solid white', color: addingNode ? 'lime' : 'white' }} onClick={handleAddNodeClick}>
                <TopBarButton><IoMdAddCircleOutline /></TopBarButton>
                {addingNode ? 'Adding Node' : 'Add Node'}
            </button>
            <button style={{ color: connecting ? 'lime' : 'white' }} onClick={handleConnectClick}>
                <TopBarButton><SlGraph /></TopBarButton>
                {connecting ? 'Adding Edge' : 'Add Edge'}
            </button>
            <button style={{ color: moving ? 'lime' : 'white' }} onClick={handleMoveClick}>
                <TopBarButton><FiMove /></TopBarButton>
                {moving ? 'Moving Node' : 'Move Node'}
            </button>
            <button style={{ color: removing ? 'lime' : 'white' }} onClick={handleRemoveClick}>
                <TopBarButton><RiDeleteBin5Line /></TopBarButton>
                {removing ? 'Removing' : 'Remove'}
            </button>

            <button onClick={() => setAlgoExpanded(exp => !exp)} >
                <TopBarButton><FaCodeBranch /></TopBarButton>
                Algorithms
                {algoExpanded &&
                    <div className="action-list">
                        {
                            Object.entries(algoActions).map(entry => {
                                return (
                                    <div className="action" onClick={entry[1]}>
                                        <p>{formalize(entry[0])}</p>
                                    </div>
                                )
                            })
                        }
                    </div>
                }
            </button>

            <button className="last-btn" onClick={() => setActionExpanded(exp => !exp)} >
                <TopBarButton><IoMdSettings /></TopBarButton>
                Other Actions
                {actionExpanded &&
                    <div className="action-list">
                        {
                            Object.entries(otherActions).map(entry => {
                                return (
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