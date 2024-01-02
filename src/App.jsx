import React from "react"

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

    function handleClueClick(index, isHorizontal) {
        if (isHorizontal) {
            setGameState(prevGameState => {
                return {
                    ...prevGameState,
                    activeSquare: crosswordData.hClues[index].firstSquare,
                    activeClue: index,
                    isHorizontal: true
                }
            })
        } else {
            setGameState(prevGameState => {
                return {
                    ...prevGameState,
                    activeSquare: crosswordData.vClues[index].firstSquare,
                    activeClue: index,
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