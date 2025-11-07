import React, {useEffect} from 'react';
import "./Cell.css"

function Cell({cellData, onClick, x, y}) {

    const [rcListenerBound, setRcListenerBound] = React.useState(false);

    useEffect(() => {
        let btn = document.getElementById("btn-" + x + "-" + y);
        if (btn && !rcListenerBound) {
            btn.addEventListener("contextmenu", e => {
                e.preventDefault();
                // onClick(x, y, -1);
            })
            setRcListenerBound(true);
        }
    }, [x, y]);
    return (
        <button id={"btn-" + x + "-" + y} style={{
            "--cell-color": cellData.color,
            "--cell-size": cellData.width + "px",
            width: "calc(" + cellData.width + " - 1px)",
            height: "calc(" + cellData.height + " - 1px)",
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
                    cellData.hasQueen ? <div className={"cell-crown"}>👑</div> : null
                }
                {
                    cellData.hasCross ? <div className={"cell-cross"}><img src={"/cross.svg"} alt={"cross"}/></div> : null
                }
            </div>
        </button>
    );
}

export default Cell;