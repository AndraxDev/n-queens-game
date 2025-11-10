import React, {useEffect} from 'react';
import "./OverlayWindow.css"
import PropTypes from "prop-types";

function OverlayWindow({open, setOpen, id, children, title}) {
    useEffect(() => {
        if (open) {
            document.getElementById(id + "").style.backgroundColor = "rgba(18, 18, 18, 0.7)";
            document.getElementById(id + "").style.backdropFilter = "blur(16px)";
            document.getElementById(id + "").style.pointerEvents = "auto";
            document.getElementById(id + "").style.overflowY = "auto";
            document.getElementById(id + "-container").style.opacity = "1.0";
        } else {
            document.getElementById(id + "").style.backgroundColor = "rgba(18, 18, 18, 0.0)";
            document.getElementById(id + "").style.backdropFilter = "blur(0px)";
            document.getElementById(id + "").style.pointerEvents = "none";
            document.getElementById(id + "").style.overflowY = "hidden";
            document.getElementById(id + "-container").style.opacity = "0.0";
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open])

    return (
        <div id={id} className={"DialogOverlay-root"}>
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
                            <img src={"/arrow_back.svg"} alt={"Go back"}/>
                        </div>
                    </button>
                    <h2>{title}</h2>
                </div>
                <div className={"DialogOverlay-body"}>
                    {children}
                </div>
            </div>
        </div>
    );
}

OverlayWindow.propTypes = {
    open: PropTypes.bool,
    setOpen: PropTypes.func,
    id: PropTypes.string,
    children: PropTypes.node,
    title: PropTypes.string
}

export default OverlayWindow;
