import React from "react";
import { useAppSelector } from "../../app/hooks";
import { selectEdgeMenu, selectMessage } from "../../features/menu/menuSlice";
import EdgeMenu from "./EdgeMenu/EdgeMenu";
import './Options.css';
import TopBar from "./TopBar/TopBar";
import GraphMenu from "./GraphMenu/GraphMenu";
import PopUp from "./PopUp/PopUp";

const Options = () => {
    const message = useAppSelector(selectMessage);
    const edgeMenu = useAppSelector(selectEdgeMenu);

    return (
        <div className="options-container">
            <TopBar />
            {edgeMenu && <EdgeMenu />}
            {/* <GraphMenu /> */}
            {message && <PopUp />}
        </div>
    )
}

export default Options;