import React, {useEffect} from 'react';
import Cell from "./Cell.jsx";
import "./GameField.css"

const colors = [
    "#407038",
    "#754c2e",
    "#0e5d7a",
    "#652a78",
    "#7c2222",
    "#1b755a",
    "#786e00",
    "#223375",
    "#681356",
    "#403a3a",
    "#555c28",
    "#233f53",
];

function GameField({gameState, onCellClick, gameHasWon, onCloseWinScreen}) {

    const [windowWidth, setWindowWidth] = React.useState(document.getElementById("BaseWindow")?.clientWidth ?? 0);

    useEffect(() => {
        if (document.getElementById("BaseWindow")) {
            setWindowWidth(document.getElementById("BaseWindow").clientWidth);
        }
    }, [document.getElementById("BaseWindow")].clientWidth)

    useEffect(() => {
        if (gameHasWon) {
            document.getElementById("GameField-win-screen").style.backgroundColor = "rgba(18, 18, 18, 0.6)";
            document.getElementById("GameField-win-screen").style.backdropFilter = "blur(10px)";
            document.getElementById("GameField-win-screen").style.pointerEvents = "all";
            document.getElementById("GameField-win-screen-container").style.opacity = "1.0";

        } else {
            document.getElementById("GameField-win-screen").style.backgroundColor = "rgba(18, 18, 18, 0.0)";
            document.getElementById("GameField-win-screen").style.backdropFilter = "blur(0px)";
            document.getElementById("GameField-win-screen").style.pointerEvents = "none";
            document.getElementById("GameField-win-screen-container").style.opacity = "0.0";
        }
    }, [gameHasWon])

    return (
        <div className={"GameField"} style={{
            gap: "1px"
        }}>
            {
                gameState.level.map((array, index) => (<div style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "1px"
                }} key={"row-" + index}>
                    {
                        gameState.level[index].map((cell, cellIndex) => (
                            <Cell onClick={onCellClick} cellData={{
                                width: windowWidth / gameState.width,
                                height: windowWidth / gameState.height,
                                color: colors[gameState.level[index][cellIndex] % colors.length],
                                even: (index + cellIndex) % 2 === 1,
                                hasQueen: gameState.field[index][cellIndex] === 2,
                                hasCross: gameState.field[index][cellIndex] === 1,
                                hasError: gameState.error[index][cellIndex] === 1,
                                boardSize: gameState.width
                            }} key={"cell-" + (index + cellIndex)} x={index} y={cellIndex}/>))
                    }
                </div>))
            }
            <div id={"GameField-win-screen"} style={{
                width: "calc(" + windowWidth + "px + 48px)",
                height: "calc(" + windowWidth + "px + 48px)"
            }} className={"GameField-win-screen"}>
                <div style={{
                    width: windowWidth + "px",
                    height: windowWidth + "px",
                }} id={"GameField-win-screen-container"} className={"GameField-win-screen-container"}>
                    <h1>Level completed!</h1>
                    <button style={{
                        width: "150px"
                    }} onClick={onCloseWinScreen} className={"Game-Actions-btn"}>Close</button>
                </div>
            </div>
        </div>
    );
}

export default GameField;