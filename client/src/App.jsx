import React, { useEffect } from "react"
import io, { Socket } from 'socket.io-client';

import './App.css'

import ClueHeader from "./components/ClueHeader"
import Crossword from "./components/Crossword"

import ClueSidebar from "./components/ClueSidebar"
import ByText from "./components/ByText"
import ActionsHeader from "./components/ActionsHeader"
import WinModal from "./components/WinModal"
import ShareModal from "./components/ShareModal";

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
	const urlParams = new URLSearchParams(window.location.search);
	/**
	 * @callback GameIdSetter
	 * @param {string} gameId id of game being played (allows for multiplayer solving)
	 * @returns {void}
	 */
	/**
	 * Set game id
	 * @member app
	 * @function React.useState
	 * @param {string} gameId id of game being played (allows for multiplayer solving)
	 * @returns {string} id of game being played (allows for multiplayer solving)
	 * @returns {module:app~GameIdSetter} function to set new game id
	 */
	const [gameId, setGameId] = React.useState(urlParams.get('gameId'));

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
		playerBoard: [],
		boardStyling: [],
		hasInitialized: false
	})

	/** 
	 * @typedef PlayerState
	 * @property {{row: number, col: number}} activeSquare object containing the row and column numbers of the currently selected square
	 * @property {number} activeSquare.row row number of active square
	 * @property {number} activeSquare.col column number of active square
	 * @property {number} activeClue number of the active clue containing the current active square (with respect to its index in either the horizontal clues or vertical clues arrays)
	 * @property {boolean} isHorizontal boolean representing if the user is currently looking at the horizontal or vertical clues
	 * @property {boolean} isActive boolean representing if the player number is active (i.e., if a player 2 exists in the game)
	 */
	/** 
	 * @typedef PlayerStates
	 * @property {module:app~PlayerState} player1 state of player 1
	 * @property {module:app~PlayerState} player2 state of player 2
	 * @property {module:app~PlayerState} player3 state of player 3 (any player joined after the first two players is a spectator and does not emit moves)
	 */
	/**
	 * @callback PlayerStatesSetter
	 * @param {module:app~PlayerStates} playerStates current player states
	 * @returns {void}
	 */
	/**
	 * Set player states
	 * @member app
	 * @function React.useState
	 * @param {module:app~PlayerStates} playerStates current player states
	 * @returns {module:app~PlayerStates} current player states
	 * @returns {module:app~PlayerStatesSetter} function to set new player states
	 */
	const [playerStates, setPlayerStates] = React.useState({
		player1: {
			activeSquare: {
				row: 0,
				col: 0
			},
			activeClue: 0,
			isHorizontal: true,
			isActive: true
		},
		player2: {
			activeSquare: {
				row: 0,
				col: 0
			},
			activeClue: 0,
			isHorizontal: true,
			isActive: false
		},
		player3: {
			activeSquare: {
				row: 0,
				col: 0
			},
			activeClue: 0,
			isHorizontal: true,
			isActive: false
		}
	})

	/**
	 * @callback SocketSetter
	 * @param {Socket} socket socket object to interact with server to send player moves for a multiplayer game
	 * @returns {void}
	 */
	/**
	 * Set socket
	 * @member app
	 * @function React.useState
	 * @param {Socket} socket socket object to interact with server to send player moves for a multiplayer game
	 * @returns {Socket} socket socket object to interact with server to send player moves for a multiplayer game
	 * @returns {module:app~SocketSetter} function to set new socket
	 */
	const [socket, setSocket] = React.useState(null);

	/**
	 * @callback PlayerNumberSetter
	 * @param {string} playerNumber number of player ("player1", "player2", or "player3", assigned in the order that the user has joined the game)
	 * @returns {void}
	 */
	/**
	 * Set player number
	 * @member app
	 * @function React.useState
	 * @param {string} playerNumber number of player ("player1", "player2", or "player3", assigned in the order that the user has joined the game)
	 * @returns {string} number of player ("player1", "player2", or "player3", assigned in the order that the user has joined the game)
	 * @returns {module:app~PlayerNumberSetter} function to set new player number
	 */
	const [playerNumber, setPlayerNumber] = React.useState("player1");

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

	/**
	 * @callback ShareSetter
	 * @param {boolean} share whether the share modal is opened
	 * @returns {void}
	 */
	/**
	 * Set share state
	 * @member app
	 * @function React.useState
	 * @param {boolean} share true if share modal is opened, false if share modal is hidden/closed
	 * @returns {boolean} whether the share modal is opened
	 * @returns {module:app~ShareSetter} function to set new share state
	 */
	const [share, setShare] = React.useState(false)

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

			setGameState({
				playerBoard: playerBoard,
				boardStyling: boardStyling
			})
		});

		if (gameId === null) {
			fetch("/api/getGameId")
			.then((res) => res.json())
			.then((data) => {
				setGameId(data.id);
			});
		}
	}, []);

	React.useEffect(() => {
		if (gameId !== null) {
			const newSocket = io("http://localhost:3000", { query: "gameId=" + gameId });
			setSocket(newSocket);
			newSocket.connect();

			newSocket.on('getPlayerNumber', (message) => {
				setPlayerNumber(message);
				setGameState(prevGameState => {
					return {
						...prevGameState,
						hasInitialized: true
					}
				});
				setPlayerStates(prevPlayerStates => {
					return {
						...prevPlayerStates,
						[message]: {
							...prevPlayerStates[message],
							isActive: true
						}
					}
				});
			});

			newSocket.on('playerDisconnect', (message) => {
				if (playerNumber > message) {
					setPlayerStates(prevPlayerStates => {
						return {
							...prevPlayerStates,
							[message]: {
								...prevPlayerStates[message],
								isActive: false
							}
						}
					})
					setPlayerNumber(prevPlayerNumber => {
						const newPlayerNumber = parseInt(prevPlayerNumber.slice(-1)) - 1;
						return "player" + newPlayerNumber;
					})
				}
			})

			newSocket.on('input', (message) => {
				if (timer.start === null) {
					setTimer((prevTimer) => {
						return {
							...prevTimer,
							start: message.timer.start
						}
					});
				}
				setGameState(prevGameState => {
					let newPlayerBoard = [...prevGameState.playerBoard]
					newPlayerBoard[message.row][message.col] = message.value
					let newBoardStyling = [...prevGameState.boardStyling]
					newBoardStyling[message.row][message.col] = "black"

					return {
						playerBoard: newPlayerBoard,
						boardStyling: newBoardStyling
					}
				});
			});

			newSocket.on('playerMove', (message) => {
				setPlayerStates((prevPlayerStates) => {
					return {
						...prevPlayerStates,
						[message.playerNumber]: message.playerState
					}
				});
			});

			newSocket.on('revealWord', (message) => {
				revealWord_fromSocket(message);
			});

			newSocket.on('revealGrid', (message) => {
				revealGrid_fromSocket();
			});

			if (socket !== null) {
				return socket.disconnect();
			}
		}
	}, [gameId, board]);
	
	/**
	 * Handle click events on crossword board
	 * @member app
	 * @function handleClick
	 * @param {number} row row number (zero-indexed) of selected square on crossword board
	 * @param {number} col column number (zero-indexed) of selected square on crossword board
	 * @returns {void}
	 */
	function handleClick(row, col) {
		setPlayerStates(prevPlayerStates => {
			let toggleIsHorizontal = row === prevPlayerStates[playerNumber].activeSquare.row && col === prevPlayerStates[playerNumber].activeSquare.col
			let newIsHorizontal = toggleIsHorizontal ? !prevPlayerStates[playerNumber].isHorizontal : prevPlayerStates[playerNumber].isHorizontal
			let clueNum = newIsHorizontal ? "hClueNum" : "vClueNum"
			
			return {
				...prevPlayerStates,
				[playerNumber] : {
					activeSquare: {
						row: row,
						col: col
					},
					isHorizontal: newIsHorizontal,
					activeClue: board[row][col][clueNum],
					isActive: true
				}
			}
		});
		emitPlayerMove();
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
		setPlayerStates(prevPlayerStates => {
			return {
				...prevPlayerStates, 
				[playerNumber]: {
					...prevPlayerStates[playerNumber],
					activeSquare: {row: row, col: col}
				}
			}
		});
		emitPlayerMove();
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

			return {
				...prevGameState,
				playerBoard: newPlayerBoard,
				boardStyling: newBoardStyling
			}
		});

		setPlayerStates(prevPlayerStates => {
			let newActiveSquare = prevPlayerStates[playerNumber].isHorizontal ? getNextHorizontalSquare(prevPlayerStates[playerNumber]) : getNextVerticalSquare(prevPlayerStates[playerNumber])
			let newIsHorizontal = newActiveSquare.row === 0 && newActiveSquare.col === 0 ? !prevPlayerStates[playerNumber].isHorizontal : prevPlayerStates[playerNumber].isHorizontal
			return {
				...prevPlayerStates, 
				[playerNumber]: {
					...prevPlayerStates[playerNumber],
					activeSquare: newActiveSquare,
					isHorizontal: newIsHorizontal
				}
			}
		});

		socket.emit('input', {
			row: parseInt(row),
			col: parseInt(col),
			value: event.target.value.toUpperCase(),
			timer: timer
		});
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
			setPlayerStates(prevPlayerStates => {
				return {
					...prevPlayerStates,
					[playerNumber]: {
						...prevPlayerStates[playerNumber],
						activeSquare: crosswordData.hClues[index].firstSquare,
						isHorizontal: true
					}
				}
			})
		} else {
			setPlayerStates(prevPlayerStates => {
				return {
					...prevPlayerStates,
					[playerNumber]: {
						...prevPlayerStates[playerNumber],
						activeSquare: crosswordData.vClues[index].firstSquare,
						isHorizontal: false
					}
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
			setPlayerStates(prevPlayerStates => {
				if (gameState.playerBoard[row][col] == "") {
					let clues = prevPlayerStates[playerNumber].isHorizontal ? crosswordData.hClues : crosswordData.vClues
					if (prevPlayerStates[playerNumber].activeSquare.row === clues[prevPlayerStates[playerNumber].activeClue].firstSquare.row
						&& prevPlayerStates[playerNumber].activeSquare.col === clues[prevPlayerStates[playerNumber].activeClue].firstSquare.col) {
							return {...prevPlayerStates}
						}
					if (prevPlayerStates[playerNumber].isHorizontal) {
						return {
							...prevPlayerStates,
							[playerNumber]: {
								...prevPlayerStates[playerNumber],
								activeSquare: {
									row: row,
									col: col-1
								}
							}
						}
					} else {
						return {
							...prevPlayerStates,
							[playerNumber]: {
								...prevPlayerStates[playerNumber],
								activeSquare: {
									row: row-1,
									col: col
								}
							}
						}
					}
				} else {
					return {...prevPlayerStates}
				}
			})
			setGameState(prevGameState => {
				if (prevGameState.playerBoard[row][col] == "") {
					if (prevGameState.isHorizontal) {
						const prevPlayerBoard = [...gameState.playerBoard]
						prevPlayerBoard[row][col-1] = ""
						return {
							...prevGameState,
							playerBoard: prevPlayerBoard,
						}
					} else {
						const prevPlayerBoard = [...gameState.playerBoard]
						prevPlayerBoard[row-1][col] = ""
						return {
							...prevGameState,
							playerBoard: prevPlayerBoard,
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
			if (playerStates[playerNumber].isHorizontal) {
				hClueRef.current[playerStates[playerNumber].activeClue].scrollIntoView()
			} else {
				vClueRef.current[playerStates[playerNumber].activeClue].scrollIntoView()
			}
		}
	}, [playerStates[playerNumber].activeClue])

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
			boardRef.current[playerStates[playerNumber].activeSquare.row][playerStates[playerNumber].activeSquare.col].focus()
			setPlayerStates(prevPlayerStates => {
				let clueNum = prevPlayerStates[playerNumber].isHorizontal ? "hClueNum" : "vClueNum"
				return {
					...prevPlayerStates,
					[playerNumber]: {
						...prevPlayerStates[playerNumber],
						activeClue: board[prevPlayerStates[playerNumber].activeSquare.row][prevPlayerStates[playerNumber].activeSquare.col][clueNum]
					}
				}
			})
		}
	}, [playerStates[playerNumber].activeSquare])

	/**
	 * Emit player move (from player state) to server using socket
	 * @member app
	 * @function emitPlayerMove
	 * @returns {void}
	 */
	function emitPlayerMove() {
		if (socket !== null) {
			socket.emit('playerMove', {
				playerNumber: playerNumber,
				playerState: playerStates[playerNumber]
			});
		}
	}

	/**
	 * Get next empty square (in the horizontal direction) after input
	 * @member app
	 * @function getNextHorizontalSquare
	 * @param {module:app~GameState} gameState current game state
	 * @returns {{row: number, col: number}} object containing the row and column number of the next horizontal square
	 */
	function getNextHorizontalSquare(playerState) {
		let currentRow = playerState.activeSquare.row
		let currentCol = playerState.activeSquare.col

		while (gameState.playerBoard[currentRow][currentCol] != "") {
			if (currentCol + 1 === gameState.playerBoard[0].length) {
				currentRow = currentRow + 1 === gameState.playerBoard.length ? 0 : currentRow + 1
				currentCol = 0
				continue
			} else {
				currentCol++
			}
			if (currentRow === playerState.activeSquare.row && currentCol === playerState.activeSquare.col) break
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
	function getNextVerticalSquare(playerState){
		let currentRow = playerState.activeSquare.row
		let currentCol = playerState.activeSquare.col
		let currentClue = playerState.activeClue

		const playerBoard = gameState.playerBoard

		while (playerBoard[currentRow][currentCol] != "") {
			if (playerBoard[currentRow][currentCol] === "#" || currentRow + 1 === playerBoard.length) {
				currentClue = currentClue === crosswordData.vClues.length - 1 ? 0 : currentClue + 1
				currentRow = crosswordData.vClues[currentClue].firstSquare.row
				currentCol = crosswordData.vClues[currentClue].firstSquare.col
			} else {
				currentRow++
			}
			if (currentRow === playerState.activeSquare.row && currentCol === playerState.activeSquare.col) break
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
		setGameState({
			playerBoard: playerBoard,
			boardStyling: boardStyling
		})
	}

	/**
	 * Reveal letter in active square of crossword
	 * @member app
	 * @function revealLetter
	 * @returns {void}
	 */
	function revealLetter() {
		const row = playerStates[playerNumber].activeSquare.row
		const col = playerStates[playerNumber].activeSquare.col
		setGameState(prevGameState => {
			let newPlayerBoard = [...prevGameState.playerBoard]
			newPlayerBoard[row][col] = board[row][col].value
			let newBoardStyling = [...prevGameState.boardStyling]
			newBoardStyling[row][col] = "green"
			return {
				playerBoard: newPlayerBoard,
				boardStyling: newBoardStyling
			}
		})

		socket.emit('input', {
			row: parseInt(row),
			col: parseInt(col),
			value: board[row][col].value,
			timer: timer
		});
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

			let row = playerStates[playerNumber].activeSquare.row
			let col = playerStates[playerNumber].activeSquare.col

			if (playerStates[playerNumber].isHorizontal) {
				while (col >= 0 && newPlayerBoard[row][col] != "#") {
					newPlayerBoard[row][col] = board[row][col].value
					newBoardStyling[row][col] = "green"
					col--
				} 
				col = playerStates[playerNumber].activeSquare.col
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
				row = playerStates[playerNumber].activeSquare.row
				while (row < board[0].length && newPlayerBoard[row][col] != "#") {
					newPlayerBoard[row][col] = board[row][col].value
					newBoardStyling[row][col] = "green"
					row++
				} 
			}

			return {
				playerBoard: newPlayerBoard,
				boardStyling: newBoardStyling
			}
		})
		socket.emit('revealWord', {
			row: playerStates[playerNumber].activeSquare.row,
			col: playerStates[playerNumber].activeSquare.col,
			isHorizontal: playerStates[playerNumber].isHorizontal
		});
	}

	function revealWord_fromSocket(message) {
		setGameState(prevGameState => {
			let newPlayerBoard = [...prevGameState.playerBoard]
			let newBoardStyling = [...prevGameState.boardStyling]

			let row = message.row
			let col = message.col

			if (message.isHorizontal) {
				while (col >= 0 && newPlayerBoard[row][col] != "#") {
					newPlayerBoard[row][col] = board[row][col].value
					newBoardStyling[row][col] = "black"
					col--
				} 
				col = message.col
				while (col < board[0].length && newPlayerBoard[row][col] != "#") {
					newPlayerBoard[row][col] = board[row][col].value
					newBoardStyling[row][col] = "black"
					col++
				} 
			} else {
				while (row >= 0 && newPlayerBoard[row][col] != "#") {
					newPlayerBoard[row][col] = board[row][col].value
					newBoardStyling[row][col] = "black"
					row--
				} 
				row = message.row
				while (row < board[0].length && newPlayerBoard[row][col] != "#") {
					newPlayerBoard[row][col] = board[row][col].value
					newBoardStyling[row][col] = "black"
					row++
				} 
			}

			return {
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
				playerBoard: newPlayerBoard,
				boardStyling: newBoardStyling
			}
		})
		socket.emit('revealGrid', playerNumber);
	}

	function revealGrid_fromSocket() {
		console.log("Board:");
		console.log(board);
		setGameState(prevGameState => {
			let newPlayerBoard = board.map(row => {
				return row.map(square => {
					return square.value
				})
			})
			let newBoardStyling = board.map(row => {
				return row.map(square => {
					return "black"
				})
			})
			return {
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
		const row = playerStates[playerNumber].activeSquare.row
		const col = playerStates[playerNumber].activeSquare.col
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

			let row = playerStates[playerNumber].activeSquare.row
			let col = playerStates[playerNumber].activeSquare.col

			if (prevGameState.isHorizontal) {
				while (col >= 0 && gameState.playerBoard[row][col] != "#") {
					if (gameState.playerBoard[row][col] != board[row][col].value && gameState.playerBoard[row][col] != "") {
						newBoardStyling[row][col] = "red"
					}
					col--
				} 
				col = playerStates[playerNumber].activeSquare.col
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
				row = playerStates[playerNumber].activeSquare.row
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
	 * Open share modal
	 * @member app
	 * @function shareGame
	 * @returns {void}
	 */
	function shareGame() {
		setShare(true);
	}

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
				shareGame={shareGame}
				clearBoard={clearBoard}
				revealLetter={revealLetter}
				revealWord={revealWord}
				revealGrid={revealGrid}
				checkLetter={checkLetter}
				checkWord={checkWord}
				checkGrid={checkGrid} />
			<ClueHeader 
				isHorizontal={playerStates[playerNumber].isHorizontal}
				clue={playerStates[playerNumber].isHorizontal ? 
					crosswordData.hClues[board[playerStates[playerNumber].activeSquare.row][playerStates[playerNumber].activeSquare.col].hClueNum] : 
					crosswordData.vClues[board[playerStates[playerNumber].activeSquare.row][playerStates[playerNumber].activeSquare.col].vClueNum]} 
			/>
			<div className="crossword-container">
				<div>
				<Crossword 
					board={board}
					gameState={gameState}
					playerStates={playerStates}
					playerNumber={playerNumber}
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
					activeClue={playerStates[playerNumber].activeClue}
					isHorizontal={playerStates[playerNumber].isHorizontal}
					hClues={crosswordData.hClues}
					vClues={crosswordData.vClues}
					hClueRef={hClueRef}
					vClueRef={vClueRef}
					handleClick={handleClueClick}
				/>
			</div>
			{win && <WinModal time={timer.time} />}
			{share && <ShareModal gameId={gameId} />}
			</>
			}
		</>
	)
}