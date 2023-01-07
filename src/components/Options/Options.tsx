import React from "react";
import { useAppSelector } from "../../app/hooks";
import { selectEdgeMenu } from "../../features/menu/menuSlice";
import EdgeMenu from "./EdgeMenu/EdgeMenu";
import './Options.css';
import TopBar from "./TopBar/TopBar";
import GraphMenu from "./GraphMenu/GraphMenu";

const Options = () => {

    const edgeMenu = useAppSelector(selectEdgeMenu);

    return (
        <div className="options-container">
            <TopBar />
            { edgeMenu && <EdgeMenu /> }
            <GraphMenu />
        </div>
    )
}

export default Options;