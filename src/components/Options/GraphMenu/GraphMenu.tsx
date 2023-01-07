import React, { useEffect, useState } from "react";
import "./GraphMenu.css";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { selectEdges, selectNodes } from "../../../features/graph/graphSlice";
import { selectWeighted, toggleWeighted } from "../../../features/menu/menuSlice";

type PropertiesType = {
    order: number,
    size: number
}

const GraphMenu = () => {
    const nodes = useAppSelector(selectNodes);
    const edges = useAppSelector(selectEdges);
    const weighted = useAppSelector(selectWeighted);

    const dispatch = useAppDispatch();

    const [properties, setProperties] = useState<PropertiesType>({} as PropertiesType);

    useEffect(() => {
        setProperties({
            order: nodes.length,
            size: edges.length
        });

    }, [nodes, edges])

    const capitalize = (text: string) => {
        return text.charAt(0).toUpperCase() + text.slice(1);
    }

    const handleWeightChange = (ev: any) => {
        if (ev.target.value === 'weighted') dispatch(toggleWeighted(true));
        else if (ev.target.value === 'unweighted') dispatch(toggleWeighted(false));
    }

    return (
        <div className="graph-menu">
            <h1>Graph Properties</h1>

            <div style={{paddingBlock: '10px', borderBottom: '1px solid rgb(40, 40, 40)', width: '100%'}}>
                <div className="weight">
                    <input checked={weighted} name='weighted' value='weighted' type='radio' onChange={handleWeightChange}></input>
                    <p>Weighted</p>
                </div>
                <div className="weight">
                    <input name='weighted' value='unweighted' type='radio' onChange={handleWeightChange}></input>
                    <p>Unweighted</p>
                </div>
            </div>
            {
                Object.entries(properties).map((entry, i) => {
                    return (
                        <div
                            className="property"
                            style={{ borderBottom: (Object.entries(properties).length - 1 !== i) ? '1px solid rgb(40, 40, 40)' : 'none' }}
                        >
                            <p>{capitalize(entry[0])}: <span>{entry[1]}</span></p>
                        </div>
                    );
                })
            }
        </div>
    );
}

export default GraphMenu;