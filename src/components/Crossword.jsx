import React from "react"

import Square from "./Square"

export default function Crossword(props) {
    const style = {
        display: "grid",
        gridTemplateColumns: `repeat(${props.board[0].length.toString()}, 1fr)`,
        gridTemplateRows: `repeat(${props.board.length.toString()}, 1fr)`,
        gridGap: "5px"
    }

    return (
        <div className="grid-container" style={style}>
            {props.board.map((row, rowIndex) => {
                return (
                    <React.Fragment key={"row-"+rowIndex}>
                        {row.map((square, colIndex) => {
                            return (
                                !square.isInput ? 
                                <div key={"col-"+colIndex}
                                    style={{backgroundColor: "black"}}
                                >
                                </div> :
                                <Square
                                    key={"col-"+colIndex}
                                    input={props.gameState.playerBoard[rowIndex][colIndex]}
                                    isStart={square.isStart} 
                                    clueNum={square.clueNum}
                                    hClueNum={square.hClueNum}
                                    vClueNum={square.vClueNum}
                                    row={rowIndex} 
                                    col={colIndex}
                                    isActive={rowIndex === props.gameState.activeSquare.row && colIndex === props.gameState.activeSquare.col}
                                    isActiveClue={(props.gameState.isHorizontal && props.gameState.activeClue === square.hClueNum) || (!props.gameState.isHorizontal && props.gameState.activeClue === square.vClueNum)}
                                    handleClick={props.handleClick}
                                    handleInput={props.handleInput}
                                    handleFocus={props.handleFocus}
                                    handleBackspace={props.handleBackspace}
                                    boardRef={props.boardRef}
                                    textColour={props.gameState.boardStyling[rowIndex][colIndex]}
                                    win={props.win}
                                />
                            )
                        })}
                    </React.Fragment>
                )
            })}
        </div>
    )
}