import React from 'react';
import "./Cell.css"
import PropTypes from "prop-types";

function Cell({cellData, onClick, x, y}) {
    return (
        <button id={"btn-" + x + "-" + y} style={{
            "--cell-color": cellData.color,
            "--cell-size": cellData.width + "px",
            width: cellData.width + "px",
            height: cellData.height + "px",
        }} className={
            "cell " + (cellData.even ? "cell-even" : "cell-odd") + " "
            + (x === 0 && y === 0 ? "cell-top-left-corner " : "")
            + (x === 0 && y === cellData.boardSize - 1 ? "cell-top-right-corner " : "")
            + (x === cellData.boardSize - 1 && y === 0 ? "cell-bottom-left-corner " : "")
            + (x === cellData.boardSize - 1 && y === cellData.boardSize - 1 ? "cell-bottom-right-corner " : "")
        } onClick={() => onClick(x, y, 1)}>
            <div className={
                "cell-content " + (cellData.hasError ? "cell-content-error" : "") + " "
                + (x === 0 && y === 0 ? "cell-top-left-corner " : "")
                + (x === 0 && y === cellData.boardSize - 1 ? "cell-top-right-corner " : "")
                + (x === cellData.boardSize - 1 && y === 0 ? "cell-bottom-left-corner " : "")
                + (x === cellData.boardSize - 1 && y === cellData.boardSize - 1 ? "cell-bottom-right-corner " : "")
            }>
                {
                    cellData.hasQueen ? <div className={"cell-crown"}><img style={{
                        width: "100%",
                        height: "100%",
                    }} src={"/crown.svg"} alt={"crown"}/></div> : null
                }
                {
                    cellData.hasCross ? <div className={"cell-cross"}>
                        <div/>
                    </div> : null
                }
            </div>
        </button>
    );
}

Cell.propTypes = {
    cellData: PropTypes.object,
    onClick: PropTypes.func,
    x: PropTypes.number,
    y: PropTypes.number,
}

export default Cell;
