import React, { useEffect } from "react"
import io from 'socket.io-client';

// import "https://cdn.socket.io/4.8.1/socket.io.min.js"

import './App.css'

import ClueHeader from "./components/ClueHeader"
import Crossword from "./components/Crossword"

import ClueSidebar from "./components/ClueSidebar"
import ByText from "./components/ByText"
import ActionsHeader from "./components/ActionsHeader"
import WinModal from "./components/WinModal"

// const socket = io("http://localhost:3000");
const socket = io("http://localhost:3000");
socket.connect();

/**
 * Module to render all DOM elements and maintain state variables
 * @module app
 * @exports GameState
 * @exports Timer
*/

/**
 * Functional React component for app
 * @member app
 * @function App
 * @example
 * <App />
 * @returns {React.ReactElement} App React component to be rendered in the DOM
 */
export default function App() {
	/** 
	 * @typedef CrosswordData
	 * @property {string} id id string of crossword puzzle
	 * @property {string} title title of crossword (string containing newspaper and date)
	 * @property {string} author author and editor of crossword
	 * @property {Array.<Array.<module:crosswordData~Square>>} board crossword board data (each element of array contains the square's value and clue information)
	 * @property {Array.<module:crosswordData~Clue>} hClues array of all horizontal clues
	 * @property {Array.<module:crosswordData~Clue>} vClues array of all vertical clues
	 */
	/**
	 * @callback CrosswordDataSetter
	 * @param {module:app~CrosswordData} crosswordData data for the day's crossword
	 * @returns {void}
	 */
	/**
	 * Set crossword data
	 * @member app
	 * @function React.useState
	 * @param {module:app~CrosswordData} crosswordData current crossword data
	 * @returns {module:app~CrosswordData} current crossword data
	 * @returns {module:app~CrosswordDataSetter} function to set new crossword data
	 */
	const [crosswordData, setCrosswordData] = React.useState({
		id: "",
		title: "",
		author: "",
		board: [],
		hClues: [],
		vClues: []
	});

	/**
	 * @callback BoardSetter
	 * @param {Array.<Array.<module:crosswordData~Square>>} board crossword board data (includes value and clue numbers)
	 * @returns {void}
	 */
	/**
	 * Set board
	 * @member app
	 * @function React.useState
	 * @param {Array.<Array.<module:crosswordData~Square>>} board crossword board data
	 * @returns {Array.<Array.<module:crosswordData~Square>>} crossword board data
	 * @returns {module:app~BoardSetter} function to set new crossword board
	 */
	const [board, setBoard] = React.useState();

	/** 
	 * @typedef GameState
	 * @property {{row: number, col: number}} activeSquare object containing the row and column numbers of the currently selected square
	 * @property {number} activeSquare.row row number of active square
	 * @property {number} activeSquare.col column number of active square
	 * @property {number} activeClue number of the active clue containing the current active square (with respect to its index in either the horizontal clues or vertical clues arrays)
	 * @property {boolean} isHorizontal boolean representing if the user is currently looking at the horizontal or vertical clues
	 * @property {Array.<Array.<string>>} playerBoard 2D array of all user-inputted values of the crossword board
	 * @property {Array.<Array.<string>>} boardStyling 2D array of the text colors of all squares in the crossword board (representing whether each square is incorrect, revealed, or neither)
	 */
	/**
	 * @callback GameStateSetter
	 * @param {module:app~GameState} gameState current game state
	 * @returns {void}
	 */
	/**
	 * Set game state
	 * @member app
	 * @function React.useState
	 * @param {module:app~GameState} gameState current game state
	 * @returns {module:app~GameState} current game state
	 * @returns {module:app~GameStateSetter} function to set new game state
	 */
	const [gameState, setGameState] = React.useState({
		activeSquare: {
			row: 0,
			col: 0
		},
		activeClue: 0,
		isHorizontal: true,
		playerBoard: [],
		boardStyling: []
	})

	/** 
	 * @typedef Timer
	 * @property {number} start starting time (time of user's first input, null if user has not inputted any values)
	 * @property {{hours: number, mins: number, secs: number}} time elapsed time since the starting time
	 * @property {number} time.hours hour component of elapsed time
	 * @property {number} time.mins minute component of elapsed time
	 * @property {number} time.secs minute component of elapsed time
	 */
	/**
	 * @callback TimerSetter
	 * @param {module:app~Timer} timer current state of starting and elapsed time
	 * @returns {void}
	 */
	/**
	 * Set timer state
	 * @member app
	 * @function React.useState
	 * @param {module:app~Timer} gameState object of starting time and current elapsed time
	 * @returns {module:app~Timer} object of starting time and current elapsed time
	 * @returns {module:app~TimerSetter} function to set new timer
	 */
	const [timer, setTimer] = React.useState({
		start: null,
		time: {
			hours: 0,
			mins: 0,
			secs: 0
		}
	})

	/**
	 * @callback WinSetter
	 * @param {boolean} win whether the player has won the game
	 * @returns {void}
	 */
	/**
	 * Set win state
	 * @member app
	 * @function React.useState
	 * @param {boolean} win true if user has won, false if user has not won (incomplete board or board with incorrect values)
	 * @returns {boolean} whether the player has won the game
	 * @returns {module:app~WinSetter} function to set new win state
	 */
	const [win, setWin] = React.useState(false)

	/** @type {Array.<React.MutableRefObject>} */
	const hClueRef = React.useRef([])
	/** @type {Array.<React.MutableRefObject>} */
	const vClueRef = React.useRef([])
	/** @type {Array.<React.MutableRefObject>} */
	const boardRef = React.useRef([])

	/** 
	 * Fetch the day's crossword data from API and set board and game state
	 * @member app
	 * @function React.useEffect
	 * @returns {void}
	*/
	React.useEffect(() => {
		fetch("/api/getCrosswordData")
		.then((res) => res.json())
		.then((data) => {
			setCrosswordData(data.crosswordData);

			setBoard(data.crosswordData.board);

			const playerBoard = data.crosswordData.board.map(row => {
				return row.map(square => {
					return square.value === "#" ? "#" : "";
				});
			});

			const boardStyling = data.crosswordData.board.map(row => {
				return row.map(square => {
					return "black";
				});
			});

			setGameState(prevGameState => {
				return {
					...prevGameState,
					playerBoard: playerBoard,
					boardStyling: boardStyling
				};
			})
		});
	}, []);

	/**
	 * Handle click events on crossword board
	 * @member app
	 * @function handleClick
	 * @param {number} row row number (zero-indexed) of selected square on crossword board
	 * @param {number} col column number (zero-indexed) of selected square on crossword board
	 * @returns {void}
	 */
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

	/**
	 * Handle focus events on input elements on crossword board
	 * @member app
	 * @function handleFocus
	 * @param {number} row row number (zero-indexed) of selected square on crossword board
	 * @param {number} col column number (zero-indexed) of selected square on crossword board
	 * @returns {void}
	 */
	function handleFocus(row, col) {
		setGameState(prevGameState => {
			return {
				...prevGameState, 
				activeSquare: {row: row, col: col}
			}
		})
	}

	/**
	 * Handle input events on input elements on crossword board
	 * @member app
	 * @function handleInput
	 * @param {event} event input event
	 * @returns {void}
	 */
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

	/**
	 * Handle click events on clues in the clues sidebar in order to select the corresponding active square on the crossword board
	 * @member app
	 * @function handleClueClick
	 * @param {number} index index value of clue in respect to either the array of horizontal clues or the array of vertical clues
	 * @param {boolean} isHorizontal boolean describing whether the active clue is a horizontal or vertical clue
	 * @returns {void}
	 */
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

	/**
	 * Handle backspace inputs in the input elements on crossword board
	 * @member app
	 * @function handleBackspace
	 * @param {event} event input event
	 * @param {number} row row number (zero-indexed) of selected square on crossword board
	 * @param {number} col column number (zero-indexed) of selected square on crossword board 
	 * @returns {void}
	 */
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

	/**
	 * Scroll clue component into view upon clicking one of its associated squares on the crossword board
	 * @callback ScrollIntoView
	 * @returns {void}
	 */
	/**
	 * Scroll a clue element into view in the clues sidebar when the active clue is changed
	 * @member app
	 * @function React.useEffect
	 * @param {ScrollIntoView} func callback function that scrolls clue component into view
	 * @param {Array.<number>} activeClue dependency array containing index value of clue in respect to either the array of horizontal clues or the array of vertical clues
	 * @returns {void}
	 */
	React.useEffect(() => {
		if (board && board.length > 0) {
			if (gameState.isHorizontal) {
				hClueRef.current[gameState.activeClue].scrollIntoView()
			} else {
				vClueRef.current[gameState.activeClue].scrollIntoView()
			}
		}
	}, [gameState.activeClue])

	/**
	 * Set active clue according to active square
	 * @callback SetActiveClue
	 * @returns {void}
	 */
	/** 
	 * Set the active clue upon change of the active square
	 * @member app
	 * @function React.useEffect
	 * @param {SetActiveClue} func callback function that sets the active clue according to the active square
	 * @param {Array.<{row: number, col: number}>} activeSquare dependency array containing an object with the row and column numbers of the active square
	 * @returns {void}
	*/
	React.useEffect(() => {
		if (board && board.length > 0) {
			boardRef.current[gameState.activeSquare.row][gameState.activeSquare.col].focus()
			setGameState(prevGameState => {
				let clueNum = prevGameState.isHorizontal ? "hClueNum" : "vClueNum"
				return {
					...prevGameState,
					activeClue: board[prevGameState.activeSquare.row][prevGameState.activeSquare.col][clueNum]
				}
			})
		}
	}, [gameState.activeSquare])

	/**
	 * Get next empty square (in the horizontal direction) after input
	 * @member app
	 * @function getNextHorizontalSquare
	 * @param {module:app~GameState} gameState current game state
	 * @returns {{row: number, col: number}} object containing the row and column number of the next horizontal square
	 */
	function getNextHorizontalSquare(gameState) {
		let currentRow = gameState.activeSquare.row
		let currentCol = gameState.activeSquare.col

		while (gameState.playerBoard[currentRow][currentCol] != "") {
			if (currentCol + 1 === gameState.playerBoard[0].length) {
				currentRow = currentRow + 1 === gameState.playerBoard.length ? 0 : currentRow + 1
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

	/**
	 * Get next empty square (in the vertical direction) after input
	 * @member app
	 * @function getNextVerticalSquare
	 * @param {module:app~GameState} gameState current game state
	 * @returns {{row: number, col: number}} object containing the row and columnn number of the next vertical square
	 */
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

	/**
	 * Clear all inputs from crossword board
	 * @member app
	 * @function clearBoard
	 * @returns {void}
	 */
	function clearBoard() {
		setGameState(prevGameState => {
			return {
				...prevGameState,
				playerBoard: playerBoard,
				boardStyling: boardStyling
			}
		})
	}

	/**
	 * Reveal letter in active square of crossword
	 * @member app
	 * @function revealLetter
	 * @returns {void}
	 */
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

	/**
	 * Reveal each letter of word containing active square of crossword
	 * @member app
	 * @function revealWord
	 * @returns {void}
	 */
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

	/**
	 * Reveal all squares of crossword board
	 * @member app
	 * @function revealGrid
	 * @returns {void}
	 */
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

	/**
	 * Check letter in active square of crossword
	 * @member app
	 * @function checkLetter
	 * @returns {void}
	 */
	function checkLetter() {
		const row = gameState.activeSquare.row
		const col = gameState.activeSquare.col
		setGameState(prevGameState => {
			let newBoardStyling = [...prevGameState.boardStyling]
			newBoardStyling[row][col] = prevGameState.playerBoard[row][col] != board[row][col].value && prevGameState.playerBoard[row][col] != "" ? "red" : prevGameState.boardStyling[row][col]
			return {
				...prevGameState,
				boardStyling: newBoardStyling
			}
		})
	}

	/**
	 * Check each letter of word containing active square of crossword
	 * @member app
	 * @function checkWord
	 * @returns {void}
	 */
	function checkWord() {
		setGameState(prevGameState => {
			let newBoardStyling = [...prevGameState.boardStyling]

			let row = gameState.activeSquare.row
			let col = gameState.activeSquare.col

			if (prevGameState.isHorizontal) {
				while (col >= 0 && gameState.playerBoard[row][col] != "#") {
					if (gameState.playerBoard[row][col] != board[row][col].value && gameState.playerBoard[row][col] != "") {
						newBoardStyling[row][col] = "red"
					}
					col--
				} 
				col = gameState.activeSquare.col
				while (col < board[0].length && gameState.playerBoard[row][col] != "#") {
					if (gameState.playerBoard[row][col] != board[row][col].value && gameState.playerBoard[row][col] != "") {
						newBoardStyling[row][col] = "red"
					}
					col++
				} 
			} else {
				while (row >= 0 && gameState.playerBoard[row][col] != "#") {
					if (gameState.playerBoard[row][col] != board[row][col].value && gameState.playerBoard[row][col] != "") {
						newBoardStyling[row][col] = "red"
					}
					row--
				} 
				row = gameState.activeSquare.row
				while (row < board.length && gameState.playerBoard[row][col] != "#") {
					if (gameState.playerBoard[row][col] != board[row][col].value && gameState.playerBoard[row][col] != "") {
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
	/**
	 * Check all squares of crossword board
	 * @member app
	 * @function checkGrid
	 * @returns {void}
	 */
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

	/**
	 * Get time spent on crossword (measured from the time of first input)
	 * @member app
	 * @function getTime
	 * @returns {void}
	 */
	function getTime() {
		const time = Date.now() - timer.start;
	
		setTimer(prevTimer => {
			const hours = timer.start === null? prevTimer.time.hours : Math.floor((time / (1000 * 60 * 60)) % 24)
			const mins = timer.start === null? prevTimer.time.mins : Math.floor((time / 1000 / 60) % 60)
			const secs = timer.start === null? prevTimer.time.secs : Math.floor((time / 1000) % 60)

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

	/**
	 * Set timer that counts every second
	 * @callback setTimerFunction
	 * @returns {function} callback function that cancels the timer
	 */
	/**
	 * Start the timer upon user's first input
	 * @member app
	 * @function React.useEffect
	 * @param {setTimerFunction} func callback function that creates a timer to count every second
	 * @param {number} start number representing the start time (measured at user's first input)
	 * @returns {void}
	 */
	React.useEffect(() => {
		const interval = setInterval(() => getTime(), 1000);
	
		return () => clearInterval(interval);
	}, [timer.start]);

	/**
	 * Determine if a player has won (all filled in squares are correct)
	 * @callback isWin
	 * @returns {void}
	 */
	/**
	 * Check if a player has won upon any change in values on the crossword board
	 * @member app
	 * @function React.useEffect
	 * @param {isWin} func callback function that determines if the player has won
	 * @param {Array.<Array.<string>>} playerBoard 2D array of all user-inputted values of the crossword board
	 * @returns {void}
	 */
	React.useEffect(() => {
		let win = true
		if (board && board.length > 0) {
			for (let i = 0; i < board.length; i++) {
				for (let j = 0; j < board[0].length; j++) {
					if (gameState.playerBoard[i][j] != board[i][j].value) {
						win = false
						break
					}
				}
			}
		} else {
			win = false
		}
		if (win) {
			setWin(true)
			setTimer(prevTimer => {
				return {
					...prevTimer,
					start: null
				}
			})
		}
	}, [gameState.playerBoard])

	return (
		<>
			{!board || board.length == 0 || gameState.playerBoard.length == 0  ? <p>Loading...</p> :
			<>
			<ActionsHeader
				crosswordData={crosswordData}
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
					win={win}
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
			{win && <WinModal time={timer.time} />}
			</>
			}
		</>
	)
}