import React, { useEffect } from "react"

import './App.css'

import ClueHeader from "./components/ClueHeader"
import Crossword from "./components/Crossword"

import crosswordData from "./crosswordData"
import ClueSidebar from "./components/ClueSidebar"
import ByText from "./components/ByText"
import ActionsHeader from "./components/ActionsHeader"

export default function App() {
    const board = crosswordData.board

    const playerBoard = board.map(row => {
        return row.map(square => {
            return square.value === "#" ? "#" : ""
        })
    })

    const boardStyling = board.map(row => {
        return row.map(square => {
            return "black"
        })
    })

    const [gameState, setGameState] = React.useState({
        activeSquare: {
            row: 0,
            col: 0
        },
        activeClue: 0,
        isHorizontal: true,
        playerBoard: playerBoard,
        boardStyling: boardStyling
    })

    const [timer, setTimer] = React.useState({
        start: null,
        time: {
            hours: 0,
            mins: 0,
            secs: 0
        }
    })

    const hClueRef = React.useRef([])
    const vClueRef = React.useRef([])
    const boardRef = React.useRef([])

    function handleClick(row, col) {
        setGameState(prevGameState => {
            let toggleIsHorizontal = row === prevGameState.activeSquare.row && col === prevGameState.activeSquare.col
            let newIsHorizontal = toggleIsHorizontal ? !prevGameState.isHorizontal : prevGameState.isHorizontal
            let clueNum = newIsHorizontal ? "hClueNum" : "vClueNum"
            
            return {
                ...prevGameState,
                isHorizontal: newIsHorizontal,
                activeClue: board[prevGameState.activeSquare.row][prevGameState.activeSquare.col][clueNum]
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
        if (timer.start === null) {
            setTimer(prevTimer => {
                const now = Date.now()
                return {
                    ...prevTimer,
                    start: now
                }
            })
        }
        const [row, col] = event.target.id.split("-")
        setGameState(prevGameState => {
            let newPlayerBoard = [...prevGameState.playerBoard]
            newPlayerBoard[row][col] = event.target.value.toUpperCase()
            let newBoardStyling = [...prevGameState.boardStyling]
            newBoardStyling[row][col] = "black"
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

    function handleBackspace(event, row, col) {
        if (event.keyCode === 8) {
            setGameState(prevGameState => {
                if (prevGameState.playerBoard[row][col] == "") {
                    let clues = prevGameState.isHorizontal ? crosswordData.hClues : crosswordData.vClues
                    if (prevGameState.activeSquare.row === clues[prevGameState.activeClue].firstSquare.row
                        && prevGameState.activeSquare.col === clues[prevGameState.activeClue].firstSquare.col) {
                            return {...prevGameState}
                        }
                    if (prevGameState.isHorizontal) {
                        const prevPlayerBoard = [...gameState.playerBoard]
                        prevPlayerBoard[row][col-1] = ""
                        return {
                            ...prevGameState,
                            playerBoard: prevPlayerBoard,
                            activeSquare: {
                                row: row,
                                col: col-1
                            }
                        }
                    } else {
                        const prevPlayerBoard = [...gameState.playerBoard]
                        prevPlayerBoard[row-1][col] = ""
                        return {
                            ...prevGameState,
                            playerBoard: prevPlayerBoard,
                            activeSquare: {
                                row: row-1,
                                col: col
                            }
                        }
                    }
                } else {
                    return {...prevGameState}
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
            let clueNum = prevGameState.isHorizontal ? "hClueNum" : "vClueNum"
            return {
                ...prevGameState,
                activeClue: board[prevGameState.activeSquare.row][prevGameState.activeSquare.col][clueNum]
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
            if (currentRow === gameState.activeSquare.row && currentCol === gameState.activeSquare.col) break
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
                currentClue = currentClue === crosswordData.vClues.length - 1 ? 0 : currentClue + 1
                currentRow = crosswordData.vClues[currentClue].firstSquare.row
                currentCol = crosswordData.vClues[currentClue].firstSquare.col
            } else {
                currentRow++
            }
            if (currentRow === gameState.activeSquare.row && currentCol === gameState.activeSquare.col) break
        }

        return {
            row: currentRow,
            col: currentCol
        }
    }

    function clearBoard() {
        setGameState(prevGameState => {
            return {
                ...prevGameState,
                playerBoard: playerBoard,
                boardStyling: boardStyling
            }
        })
    }

    function revealLetter() {
        const row = gameState.activeSquare.row
        const col = gameState.activeSquare.col
        setGameState(prevGameState => {
            let newPlayerBoard = [...prevGameState.playerBoard]
            newPlayerBoard[row][col] = board[row][col].value
            let newBoardStyling = [...prevGameState.boardStyling]
            newBoardStyling[row][col] = "green"
            return {
                ...prevGameState,
                playerBoard: newPlayerBoard,
                boardStyling: newBoardStyling
            }
        })
    }

    function revealWord() {
        setGameState(prevGameState => {
            let newPlayerBoard = [...prevGameState.playerBoard]
            let newBoardStyling = [...prevGameState.boardStyling]

            let row = gameState.activeSquare.row
            let col = gameState.activeSquare.col

            if (prevGameState.isHorizontal) {
                while (col >= 0 && newPlayerBoard[row][col] != "#") {
                    newPlayerBoard[row][col] = board[row][col].value
                    newBoardStyling[row][col] = "green"
                    col--
                } 
                col = gameState.activeSquare.col
                while (col < board[0].length && newPlayerBoard[row][col] != "#") {
                    newPlayerBoard[row][col] = board[row][col].value
                    newBoardStyling[row][col] = "green"
                    col++
                } 
            } else {
                while (row >= 0 && newPlayerBoard[row][col] != "#") {
                    newPlayerBoard[row][col] = board[row][col].value
                    newBoardStyling[row][col] = "green"
                    row--
                } 
                row = gameState.activeSquare.row
                while (row < board[0].length && newPlayerBoard[row][col] != "#") {
                    newPlayerBoard[row][col] = board[row][col].value
                    newBoardStyling[row][col] = "green"
                    row++
                } 
            }

            return {
                ...prevGameState,
                playerBoard: newPlayerBoard,
                boardStyling: newBoardStyling
            }
        })
    }

    function revealGrid() {
        setGameState(prevGameState => {
            let newPlayerBoard = board.map(row => {
                return row.map(square => {
                    return square.value
                })
            })
            let newBoardStyling = board.map(row => {
                return row.map(square => {
                    return "green"
                })
            })
            return {
                ...prevGameState,
                playerBoard: newPlayerBoard,
                boardStyling: newBoardStyling
            }
        })
    }

    function checkLetter() {
        const row = gameState.activeSquare.row
        const col = gameState.activeSquare.col
        setGameState(prevGameState => {
            let newBoardStyling = [...prevGameState.boardStyling]
            newBoardStyling[row][col] = prevGameState.playerBoard[row][col] != board[row][col].value ? "red" : prevGameState.boardStyling[row][col]
            return {
                ...prevGameState,
                boardStyling: newBoardStyling
            }
        })
    }

    function checkWord() {
        setGameState(prevGameState => {
            let newBoardStyling = [...prevGameState.boardStyling]

            let row = gameState.activeSquare.row
            let col = gameState.activeSquare.col

            if (prevGameState.isHorizontal) {
                while (col >= 0 && gameState.playerBoard[row][col] != "#") {
                    if (gameState.playerBoard[row][col] != board[row][col] && gameState.playerBoard[row][col] != "") {
                        newBoardStyling[row][col] = "red"
                    }
                    col--
                } 
                col = gameState.activeSquare.col
                while (col < board[0].length && gameState.playerBoard[row][col] != "#") {
                    if (gameState.playerBoard[row][col] != board[row][col] && gameState.playerBoard[row][col] != "") {
                        newBoardStyling[row][col] = "red"
                    }
                    col++
                } 
            } else {
                while (row >= 0 && gameState.playerBoard[row][col] != "#") {
                    if (gameState.playerBoard[row][col] != board[row][col] && gameState.playerBoard[row][col] != "") {
                        newBoardStyling[row][col] = "red"
                    }
                    row--
                } 
                row = gameState.activeSquare.row
                while (row < board[0].length && gameState.playerBoard[row][col] != "#") {
                    if (gameState.playerBoard[row][col] != board[row][col] && gameState.playerBoard[row][col] != "") {
                        newBoardStyling[row][col] = "red"
                    }
                    row++
                } 
            }

            return {
                ...prevGameState,
                boardStyling: newBoardStyling
            }
        })
    }

    function checkGrid() {
        setGameState(prevGameState => {
            let newBoardStyling = prevGameState.playerBoard.map((row, rowIndex) => {
                return row.map((square, colIndex) => {
                    return (square != board[rowIndex][colIndex].value && square != "") ? "red" : prevGameState.boardStyling[rowIndex][colIndex]
                })
            })
            return {
                ...prevGameState,
                boardStyling: newBoardStyling
            }
        })
    }

    function getTime() {
        const time = Date.now() - timer.start;
    
        const hours = timer.start === null? 0 : Math.floor((time / (1000 * 60 * 60)) % 24)
        const mins = timer.start === null? 0 : Math.floor((time / 1000 / 60) % 60)
        const secs = timer.start === null? 0 : Math.floor((time / 1000) % 60)

        setTimer(prevTimer => {
            return {
                ...prevTimer,
                time: {
                    hours: hours,
                    mins: mins,
                    secs: secs
                }
            }
        })
      };

    React.useEffect(() => {
        const interval = setInterval(() => getTime(), 1000);
    
        return () => clearInterval(interval);
    }, [timer.start]);

    return (
        <>
            <ActionsHeader
                timer={timer}
                clearBoard={clearBoard}
                revealLetter={revealLetter}
                revealWord={revealWord}
                revealGrid={revealGrid}
                checkLetter={checkLetter}
                checkWord={checkWord}
                checkGrid={checkGrid} />
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
                    handleBackspace={handleBackspace}
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