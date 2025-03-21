import React from "react"

import Square from "./Square"

/**
 * Module to render crossword board
 * @module crossword
*/

/**
 * Functional React component for crossword
 * @member crossword
 * @function Crossword
 * @param {Array.<Array.<module:crosswordData~Square>>} board 2D array of properties of all squares of filled crossword
 * @param {module:app~GameState} gameState current game state
 * @param {function} handleClick function that handles click on individual square of crossword
 * @param {function} handleInput function that handles input in individual square of crossword
 * @param {function} handleFocus function that handles focus on input element of individual square of crossword
 * @param {function} handleBackspace function that handles backspace inputs in individual square of crossword
 * @param {React.MutableRefObject} boardRef reference to DOM elements of crossword squares
 * @param {boolean} win true if user has won, false if crossboard is incomplete or contains errors
 * @example
 * const board = [[...], ...]
const [gameState, setGameState] = React.useState({
    activeSquare: {
        row: 0,
        col: 0
    },
    activeClue: 0,
    isHorizontal: true,
    playerBoard: [[...], ...],
    boardStyling: [[...], ...]
})
const clueRef = React.useRef([])
const clues = [...]
...
<Crossword 
    board={board}
    gameState={gameState}
    handleClick={handleClick}
    handleInput={handleInput}
    handleFocus={handleFocus}
    handleBackspace={handleBackspace}
    boardRef={boardRef}
    win={win}
/>
 * @returns {React.ReactElement} Crossword React component to be rendered in the DOM
 */

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