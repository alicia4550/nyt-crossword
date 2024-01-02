import React from "react"

import Square from "./Square"

export default function Crossword(props) {
    const board = props.data.board

    const playerBoard = board.map(row => {
        return row.map(square => {
            return square.value === "#" ? "#" : ""
        })
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
        gridTemplateColumns: `repeat(${props.data.numCols.toString()}, 35px)`,
        gridGap: "10px"
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

    function handleFocus(row, col) {
        setGameState(prevGameState => {
            return {
                ...prevGameState, 
                activeSquare: {row: row, col: col},
                activeClue: prevGameState.isHorizontal ? board[row][col].hClueNum : board[row][col].vClueNum,
            }
        })
    }

    function handleInput(event) {
        const [row, col] = event.target.id.split("-")
        setGameState(prevGameState => {
            let newPlayerBoard = [...prevGameState.playerBoard]
            newPlayerBoard[row][col] = event.target.value.toUpperCase()
            return {
                ...prevGameState,
                playerBoard: newPlayerBoard
            }
        })
    }

    return (
        <>
        <div className="grid-container" style={style}>
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
                                    handleInput={handleInput}
                                    handleFocus={handleFocus}
                                />
                            )
                        })}
                    </>
                )
            })}
        </div>
        <div className="clueText" style={{width: ((props.data.numCols * 35) + 90).toString() + "px"}}>
            {gameState.isHorizontal ? 
                props.data.hClues[board[gameState.activeSquare.row][gameState.activeSquare.col].hClueNum] : 
                props.data.vClues[board[gameState.activeSquare.row][gameState.activeSquare.col].vClueNum]}
        </div>
        </>
    )

    
}