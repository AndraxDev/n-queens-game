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
    "#75225c",
];

function GameField({gameState, onCellClick}) {

    const [windowWidth, setWindowWidth] = React.useState(document.getElementById("BaseWindow")?.clientWidth ?? 0);

    useEffect(() => {
        if (document.getElementById("BaseWindow")) {
            setWindowWidth(document.getElementById("BaseWindow").clientWidth);
        }
    }, [document.getElementById("BaseWindow")].clientWidth)

    return (
        <div className={"GameField"}>
            {
                gameState.level.map((array, index) => (<div style={{
                    display: "flex",
                    flexDirection: "row",
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
        </div>
    );
}

export default GameField;