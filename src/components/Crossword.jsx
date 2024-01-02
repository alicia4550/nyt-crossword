import React from "react"

import Square from "./Square"

export default function Crossword(props) {
    const board = props.data.board

    const playerBoard = board.map(row => {
        let rowData = []
        {row.map(square => {    
            rowData.push(square === "#" ? "#" : "")
        })}
        return rowData
    })

    const [gameState, setGameState] = React.useState({
        activeSquare: {
            row: 0,
            col: 0
        },
        activeClue: 0,
        isHorizontal: true,
        playerBoard: playerBoard
    })

    const style = {
        display: "grid",
        gridTemplateCols: `repeat(${props.data.numCols.toString()}, 25px)`,
        gap: "10px"
    }

    function handleClick(row, col) {
        setGameState(prevGameState => {
            let toggleIsHorizontal = row === prevGameState.activeSquare.row && col === prevGameState.activeSquare.col
            let newIsHorizontal = toggleIsHorizontal ? !prevGameState.isHorizontal : prevGameState.isHorizontal
            
            return {
                ...prevGameState, 
                activeSquare: {row: row, col: col},
                activeClue: newIsHorizontal ? board[row][col].hClueNum : board[row][col].vClueNum,
                isHorizontal: newIsHorizontal
            }
        })        
    }

    function handleInput(row, col) {
        // TODO
    }

    return (
        <>
        <div className="grid-container">
            {board.map((row, rowIndex) => {
                return (
                    <>
                        {row.map((square, colIndex) => {
                            return (
                                !square.isInput ? 
                                <div 
                                    style={{backgroundColor: "black"}}
                                >
                                </div> :
                                <Square
                                    isStart={square.isStart} 
                                    clueNum={square.clueNum}
                                    hClueNum={square.hClueNum}
                                    vClueNum={square.vClueNum}
                                    row={rowIndex} 
                                    col={colIndex}
                                    isActive={rowIndex === gameState.activeSquare.row && colIndex === gameState.activeSquare.col}
                                    isActiveClue={(gameState.isHorizontal && gameState.activeClue === square.hClueNum) || (!gameState.isHorizontal && gameState.activeClue === square.vClueNum)}
                                    handleClick={handleClick}
                                />
                            )
                        })}
                    </>
                )
            })}
        </div>
        <div>
            {gameState.isHorizontal ? 
                props.data.hClues[board[gameState.activeSquare.row][gameState.activeSquare.col].hClueNum] : 
                props.data.vClues[board[gameState.activeSquare.row][gameState.activeSquare.col].vClueNum]}
        </div>
        </>
    )

    
}