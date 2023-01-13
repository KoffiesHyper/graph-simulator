import React from "react";
import "./PopUp.css";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { selectMessage, showMessage } from "../../../features/menu/menuSlice";

const PopUp = () => {
    const message = useAppSelector(selectMessage);
    const dispatch = useAppDispatch();

    setTimeout(() => {
        dispatch(showMessage(null));
    }, 3000)

    return (
        <>
            <div className="pop-up">
                {message}
            </div>
        </>
    )
}

export default PopUp;