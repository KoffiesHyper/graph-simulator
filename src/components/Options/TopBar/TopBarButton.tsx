import React from "react";
import { IconContext } from "react-icons/lib/esm/iconContext";

type PropsType = {
    children: JSX.Element
}

const TopBarButton: React.FC<PropsType> = ({ children }) => {

    return(
        <div style={{marginTop: '4px', marginRight: '6px'}}><IconContext.Provider value={{ color: 'white', size: '20px'}}>{children}</IconContext.Provider></div>

    );
}

export default TopBarButton;