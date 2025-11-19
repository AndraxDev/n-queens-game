import React, {useEffect} from 'react';
import Cell from "./Cell.jsx";
import "./GameField.css"
import PropTypes from "prop-types";

function GameField({gameState, onCellClick, gameHasWon, onCloseWinScreen, theme, statusBarHeight}) {

    const [windowWidth, setWindowWidth] = React.useState(document.getElementById("BaseWindow")?.clientWidth ?? 0);

    useEffect(() => {
        if (document.getElementById("BaseWindow")) {
            setWindowWidth(document.getElementById("BaseWindow").clientWidth);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [document.getElementById("BaseWindow")].clientWidth)

    useEffect(() => {
        if (gameHasWon) {
            document.getElementById("GameField-win-screen").style.backgroundColor = theme.overlayBackgroundColor;
            document.getElementById("GameField-win-screen").style.backdropFilter = "blur(32px)";
            document.getElementById("GameField-win-screen").style.pointerEvents = "all";
            document.getElementById("GameField-win-screen-container").style.opacity = "1.0";

        } else {
            document.getElementById("GameField-win-screen").style.backgroundColor = "transparent";
            document.getElementById("GameField-win-screen").style.backdropFilter = "blur(0px)";
            document.getElementById("GameField-win-screen").style.pointerEvents = "none";
            document.getElementById("GameField-win-screen-container").style.opacity = "0.0";
        }
    }, [gameHasWon, theme])

    return (
        <div className={"GameField"} style={{
            gap: "0px",
            height: windowWidth + "px",
            width: windowWidth + "px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
        }}>
            {
                gameState.level.map((array, index) => (<div style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "0px",
                    width: windowWidth + "px",
                    height: (windowWidth / gameState.height) + "px"
                }} key={"row-" + index}>
                    {
                        gameState.level[index].map((cell, cellIndex) => (
                            <Cell onClick={onCellClick} cellData={{
                                width: windowWidth / gameState.width,
                                height: windowWidth / gameState.height,
                                color: theme.fieldColorScheme[gameState.level[index][cellIndex] % theme.fieldColorScheme.length],
                                even: (index + cellIndex) % 2 === 1,
                                hasQueen: gameState.field[index][cellIndex] === 2,
                                hasCross: gameState.field[index][cellIndex] === 1,
                                hasError: gameState.error[index][cellIndex] === 1,
                                boardSize: gameState.width
                            }} theme={theme} key={"cell-" + (index + cellIndex)} x={index} y={cellIndex}/>))
                    }
                </div>))
            }
            <div id={"GameField-win-screen"} style={{
                width: "100dvw",
                height: "100dvh"
            }} className={"GameField-win-screen"}>
                <div style={{
                    width: "100dvw",
                    height: windowWidth + "px",
                    marginTop: "calc(" + statusBarHeight + "px + 80px)",
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

GameField.propTypes = {
    gameState: PropTypes.object,
    onCellClick: PropTypes.func,
    gameHasWon: PropTypes.bool,
    onCloseWinScreen: PropTypes.func,
    theme: PropTypes.object,
    statusBarHeight: PropTypes.number
}

export default GameField;
