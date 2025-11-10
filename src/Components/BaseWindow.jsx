import React from 'react';
import PropTypes from 'prop-types';
import "./BaseWindow.css"

function BaseWindow({children}) {
    return (
        <div className={"BaseWindow-root"}>
            <div className={"BaseWindow-container"} id={"BaseWindow"}>
                {children}
            </div>
        </div>
    );
}

BaseWindow.propTypes = {
    children: PropTypes.node.isRequired,
}

export default BaseWindow;
