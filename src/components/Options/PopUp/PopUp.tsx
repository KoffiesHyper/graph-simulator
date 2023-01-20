import React from "react";
import "./PopUp.css";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { selectMessage, showMessage } from "../../../features/menu/menuSlice";
import { IconContext } from "react-icons";
import { MdErrorOutline } from 'react-icons/md';

const PopUp = () => {
    let message = useAppSelector(selectMessage);
    const dispatch = useAppDispatch();

    setTimeout(() => {
        dispatch(showMessage(null));
    }, 3000)

    let styles: React.CSSProperties = {}

    if (message?.includes('info-')) {
        message = message.substring(5);
        styles.backgroundColor = 'rgb(60, 60, 75)'
        styles.border = '2px solid white'
        styles.boxShadow = 'none'
        styles.color = 'white'
    }

    const isInfo: boolean = styles.color ? true : false;

    return (
        <>
            <div style={styles} className="pop-up">
                <div className="error-icon">
                    <IconContext.Provider value={{ color: 'white', size: '25px' }}>
                        <MdErrorOutline />
                    </IconContext.Provider>
                </div>
                <span style={{ fontWeight: 'bold', paddingRight: '6px' }}>{isInfo ? 'Info:' : 'Error:'} </span> {message}
            </div>
        </>
    )
}

export default PopUp;