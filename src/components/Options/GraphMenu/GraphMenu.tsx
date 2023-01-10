import React, { useEffect, useState } from "react";
import "./GraphMenu.css";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { inverseGraph, resetEdgeWeights, selectEdges, selectNodes } from "../../../features/graph/graphSlice";
import { selectDegrees, selectWeighted, toggleDegrees, toggleWeighted } from "../../../features/menu/menuSlice";

type PropertiesType = {
    order: number,
    size: number,
    degree_sequence: string
}

const GraphMenu = () => {
    const nodes = useAppSelector(selectNodes);
    const edges = useAppSelector(selectEdges);
    const weighted = useAppSelector(selectWeighted);
    const degrees = useAppSelector(selectDegrees);

    const dispatch = useAppDispatch();

    const [properties, setProperties] = useState<PropertiesType>({} as PropertiesType);

    useEffect(() => {
        setProperties({
            order: nodes.length,
            size: edges.length,
            degree_sequence: determineDegreeSequence()
        });

    }, [nodes, edges]);

    const determineDegreeSequence = () => {
        let sequence: string = '';

        nodes.forEach(node => {
            sequence += node.neighbours.length.toString();
        })

        return sequence.split("").join(" ; ");
    }

    const capitalize = (text: string) => {
        return text.charAt(0).toUpperCase() + text.slice(1);
    }

    const handleWeightChange = (ev: any) => {
        dispatch(resetEdgeWeights());
        if (ev.target.value === 'weighted') dispatch(toggleWeighted(true));
        else if (ev.target.value === 'unweighted') dispatch(toggleWeighted(false));
    }

    return (
        <div className="graph-menu">
            <h1>Graph Properties</h1>

            {
                Object.entries(properties).map((entry, i) => {
                    return (
                        <div className="property">
                            <p>{capitalize(entry[0])}: <span>{entry[1]}</span></p>
                        </div>
                    );
                })
            }

            {/* <div className="weight-setting">
                <div className="radio">
                    <input checked={weighted} name='weighted' value='weighted' type='radio' onChange={handleWeightChange}></input>
                    <p>Weighted</p>
                </div>
                <div className="radio">
                    <input name='weighted' value='unweighted' type='radio' onChange={handleWeightChange}></input>
                    <p>Unweighted</p>
                </div>
            </div>

            <div className="degree-setting">
                <button onClick={() => dispatch(toggleDegrees())}>{degrees ? "Hide Degrees" : "Show Degrees"}</button>
            </div>

            <div className="inverse-setting">
                <button onClick={() => dispatch(inverseGraph())}>Convert to Inverse</button>
            </div> */}
        </div>
    );
}

export default GraphMenu;