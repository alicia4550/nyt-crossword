import React, { useEffect } from "react"

import './App.css'

import ClueHeader from "./components/ClueHeader"
import Crossword from "./components/Crossword"

import crosswordData from "./crosswordData"
import ClueSidebar from "./components/ClueSidebar"
import ByText from "./components/ByText"

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

    const hClueRef = React.useRef([])
    const vClueRef = React.useRef([])
    const boardRef = React.useRef([])

    function handleClick(row, col) {
        setGameState(prevGameState => {
            let toggleIsHorizontal = row === prevGameState.activeSquare.row && col === prevGameState.activeSquare.col
            let newIsHorizontal = toggleIsHorizontal ? !prevGameState.isHorizontal : prevGameState.isHorizontal
            
            return {
                ...prevGameState,
                isHorizontal: newIsHorizontal,
                activeClue: newIsHorizontal ? board[prevGameState.activeSquare.row][prevGameState.activeSquare.col].hClueNum : board[prevGameState.activeSquare.row][prevGameState.activeSquare.col].vClueNum
            }
        })
    }

    function handleFocus(row, col) {
        setGameState(prevGameState => {
            return {
                ...prevGameState, 
                activeSquare: {row: row, col: col}
            }
        })
    }

    function handleInput(event) {
        const [row, col] = event.target.id.split("-")
        setGameState(prevGameState => {
            let newPlayerBoard = [...prevGameState.playerBoard]
            newPlayerBoard[row][col] = event.target.value.toUpperCase()
            let newActiveSquare = prevGameState.isHorizontal ? getNextHorizontalSquare(prevGameState) : getNextVerticalSquare(prevGameState)

            return {
                ...prevGameState,
                playerBoard: newPlayerBoard,
                activeSquare: newActiveSquare
            }
        })
    }

    function handleClueClick(index, isHorizontal) {
        if (isHorizontal) {
            setGameState(prevGameState => {
                return {
                    ...prevGameState,
                    activeSquare: crosswordData.hClues[index].firstSquare,
                    isHorizontal: true
                }
            })
        } else {
            setGameState(prevGameState => {
                return {
                    ...prevGameState,
                    activeSquare: crosswordData.vClues[index].firstSquare,
                    isHorizontal: false
                }
            })
        }
    }

    React.useEffect(() => {
        if (gameState.isHorizontal) {
            hClueRef.current[gameState.activeClue].scrollIntoView()
        } else {
            vClueRef.current[gameState.activeClue].scrollIntoView()
        }
    }, [gameState.activeClue])

    React.useEffect(() => {
        boardRef.current[gameState.activeSquare.row][gameState.activeSquare.col].focus()
        setGameState(prevGameState => {
            return {
                ...prevGameState,
                activeClue: prevGameState.isHorizontal ? board[prevGameState.activeSquare.row][prevGameState.activeSquare.col].hClueNum : board[prevGameState.activeSquare.row][prevGameState.activeSquare.col].vClueNum
            }
        })
    }, [gameState.activeSquare])

    function getNextHorizontalSquare(prevGameState) {
        let currentRow = prevGameState.activeSquare.row
        let currentCol = prevGameState.activeSquare.col

        while (prevGameState.playerBoard[currentRow][currentCol] != "") {
            if (currentCol + 1 === prevGameState.playerBoard[0].length) {
                currentRow = currentRow + 1 === prevGameState.playerBoard.length ? 0 : currentRow + 1
                currentCol = 0
                continue
            } else {
                currentCol++
            }
        }

        return {
            row: currentRow,
            col: currentCol
        }
    }

    function getNextVerticalSquare(gameState){
        let currentRow = gameState.activeSquare.row
        let currentCol = gameState.activeSquare.col
        let currentClue = gameState.activeClue

        const playerBoard = gameState.playerBoard

        while (playerBoard[currentRow][currentCol] != "") {
            if (playerBoard[currentRow][currentCol] === "#" || currentRow + 1 === playerBoard.length) {
                currentClue = crosswordData.vClues.length - 1 ? 0 : currentClue + 1
                currentRow = crosswordData.vClues[currentClue].firstSquare.row
                currentCol = crosswordData.vClues[currentClue].firstSquare.col
            } else {
                currentRow++
            }
        }

        return {
            row: currentRow,
            col: currentCol
        }
    }

    return (
        <>
            <ClueHeader 
                isHorizontal={gameState.isHorizontal}
                clue={gameState.isHorizontal ? 
                    crosswordData.hClues[board[gameState.activeSquare.row][gameState.activeSquare.col].hClueNum] : 
                    crosswordData.vClues[board[gameState.activeSquare.row][gameState.activeSquare.col].vClueNum]} 
            />
            <div className="crossword-container">
                <div>
                <Crossword 
                    board={board}
                    gameState={gameState}
                    handleClick={handleClick}
                    handleInput={handleInput}
                    handleFocus={handleFocus}
                    boardRef={boardRef}
                />
                <ByText 
                    title={crosswordData.title}
                    author={crosswordData.author}
                />
                </div>
                <ClueSidebar 
                    activeClue={gameState.activeClue}
                    isHorizontal={gameState.isHorizontal}
                    hClues={crosswordData.hClues}
                    vClues={crosswordData.vClues}
                    hClueRef={hClueRef}
                    vClueRef={vClueRef}
                    handleClick={handleClueClick}
                />
            </div>
        </>
    )
}