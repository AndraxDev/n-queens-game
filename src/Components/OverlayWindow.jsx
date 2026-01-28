import React, {useEffect} from 'react';
import "./OverlayWindow.css"
import PropTypes from "prop-types";
import {getLocalizedString} from "../Localization/Localization.jsx";

function OverlayWindow({open, setOpen, id, children, title, theme, statusBarWidth, navigationBarHeight}) {
    useEffect(() => {
        if (open) {
            document.getElementById(id + "").style.backgroundColor = theme.overlayBackgroundColor;
            document.getElementById(id + "").style.backdropFilter = "blur(32px)";
            document.getElementById(id + "").style.pointerEvents = "auto";
            document.getElementById(id + "").style.overflowY = "auto";
            document.getElementById(id + "-container").style.opacity = "1.0";
            document.getElementsByTagName("body")[0].style.overflowY = "hidden";
        } else {
            document.getElementById(id + "").style.backgroundColor = "transparent";
            document.getElementById(id + "").style.backdropFilter = "blur(0px)";
            document.getElementById(id + "").style.pointerEvents = "none";
            document.getElementById(id + "").style.overflowY = "hidden";
            document.getElementById(id + "-container").style.opacity = "0.0";
            document.getElementsByTagName("body")[0].style.overflowY = "auto";
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, theme])

    return (
        <div style={{
            paddingTop: statusBarWidth + "px",
        }} id={id} className={"DialogOverlay-root"}>
            <div id={id + "-container"} className={"DialogOverlay-container"}>
                <div className={"DialogOverlay-header"}>
                    <button className={"DialogOverlay-btn-back"} onClick={() => {
                        setOpen(false);
                    }}>
                        <div style={{
                            width: "24px",
                            height: "24px",
                            lineHeight: "1",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}>
                            <img src={theme.isDark ? "/arrow_back.svg" : "/arrow_back_dark.svg"} alt={getLocalizedString("goBack")}/>
                        </div>
                    </button>
                    <h2>{title}</h2>
                </div>
                <div className={"DialogOverlay-body"}>
                    {children}
                </div>
                <div style={{
                    height: (2 * navigationBarHeight) + "px",
                }} />
            </div>
        </div>
    );
}

OverlayWindow.propTypes = {
    open: PropTypes.bool,
    setOpen: PropTypes.func,
    id: PropTypes.string,
    children: PropTypes.node,
    title: PropTypes.string,
    theme: PropTypes.object
}

export default OverlayWindow;
