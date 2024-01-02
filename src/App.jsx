import React from "react"

import './App.css'

import ClueHeader from "./components/ClueHeader"
import Crossword from "./components/Crossword"

import crosswordData from "./crosswordData"

export default function App() {
    const board = crosswordData.board

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
            <ClueHeader 
                isHorizontal={gameState.isHorizontal}
                clue={gameState.isHorizontal ? 
                    crosswordData.hClues[board[gameState.activeSquare.row][gameState.activeSquare.col].hClueNum] : 
                    crosswordData.vClues[board[gameState.activeSquare.row][gameState.activeSquare.col].vClueNum]} 
            />
            <Crossword 
                board={board}
                gameState={gameState}
                handleClick={handleClick}
                handleInput={handleInput}
                handleFocus={handleFocus}
            />
        </>
    )
}