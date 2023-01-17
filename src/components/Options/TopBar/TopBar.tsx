import React, { useEffect, useState } from "react";
import './TopBar.css';
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { changeAlgorithm, selectConnecting, selectRemoving, selectAlgorithm, toggleConnecting, toggleRemoving, selectAddingNode, toggleAddNode, resetEdgeWeights, inverseGraph, toggleDirected, selectDirected, AlgorithmType, toggleMoving, changeMovingNode, selectMoving } from "../../../features/graph/graphSlice";
import { selectDegrees, selectWeighted, showMessage, toggleDegrees, toggleWeighted } from "../../../features/menu/menuSlice";
import { IoMdAddCircleOutline, IoMdSettings } from 'react-icons/io'
import { SlGraph } from 'react-icons/sl'
import { RiDeleteBin5Line } from 'react-icons/ri'
import { FaCodeBranch } from 'react-icons/fa'
import { FiMove } from 'react-icons/fi'
import TopBarButton from "./TopBarButton";

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

        disableAllActions();
        dispatch(changeAlgorithm(algorithm));
    }

    // const handleMouseDown = (ev: any) => {
    //     dispatch(changeMovingNode(ev?.target.firstChild!.textContent!));
    //     console.log('down')
    // }

    // const handleMouseUp = (ev: any) => {
    //     dispatch(changeMovingNode(''));
    //     console.log('up')
    // }

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
        breadth_first_search: () => handleAlgorithmClick('bfs'),
        bellman_ford: () => handleAlgorithmClick('bellman_ford')
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