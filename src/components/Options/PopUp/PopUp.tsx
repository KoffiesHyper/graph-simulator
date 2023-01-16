import React from "react";
import "./PopUp.css";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { selectMessage, showMessage } from "../../../features/menu/menuSlice";
import { IconContext } from "react-icons";
import { MdErrorOutline } from 'react-icons/md';

const PopUp = () => {
    const message = useAppSelector(selectMessage);
    const dispatch = useAppDispatch();

    setTimeout(() => {
        dispatch(showMessage(null));
    }, 5000)

    return (
        <>
            <div className="pop-up">
                <div className="error-icon">
                    <IconContext.Provider value={{ color: 'red', size: '25px' }}>
                        <MdErrorOutline />
                    </IconContext.Provider>
                </div>
                <span style={{ fontWeight: 'bold', paddingRight: '6px' }}>Error: </span> {message}
            </div>
        </>
    )
}

export default PopUp;