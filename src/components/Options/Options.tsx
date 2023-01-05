import React from "react";
import { useAppSelector } from "../../app/hooks";
import { selectEdgeMenu } from "../../features/menu/menuSlice";
import EdgeMenu from "./EdgeMenu/EdgeMenu";
import './Options.css';
import TopBar from "./TopBar/TopBar";

const Options = () => {

    const edgeMenu = useAppSelector(selectEdgeMenu);

    return (
        <div className="options-container">
            <TopBar />
            { edgeMenu && <EdgeMenu /> }
        </div>
    )
}

export default Options;