/**
 * Module to render single square of crossword board
 * @module square
*/

/**
 * Functional React component for single square of crossword board
 * @member square
 * @function Square
 * @param {string} input string of length 1, current input in square
 * @param {boolean} isStart true if square is the start of a clue, else false
 * @param {number} clueNum clue number of square as displayed on the crossword board
 * @param {number} hClueNum clue number of square with respect to the clue's index in the horizontal clues array
 * @param {number} vClueNum clue number of square with respect to the clue's index in the vertical clues array
 * @param {number} row row number of square in crossword board
 * @param {number} col column number of square in crossword board
 * @param {boolean} isActive true if square is the current active square
 * @param {boolean} isActiveClue true if square is part of the current active clue
 * @param {function} handleClick function that handles click on individual square of crossword
 * @param {function} handleInput function that handles input in individual square of crossword
 * @param {function} handleFocus function that handles focus on input element of individual square of crossword
 * @param {function} handleBackspace function that handles backspace inputs in individual square of crossword
 * @param {React.MutableRefObject} boardRef reference to DOM elements of crossword squares
 * @param {string} textColor text colour in square (red if checked and incorrect, green if was revealed, else black)
 * @param {boolean} win true if user has won, false if crossboard is incomplete or contains errors
 * @example
 * const boardRef = React.useRef([])
...
<Square
	input="A"
	isStart=true
	clueNum=2
	hClueNum=0
	vClueNum=1
	row=0
	col=1
	isActive=false
	isActiveClue=true
	handleClick={handleClick}
	handleInput={handleInput}
	handleFocus={handleFocus}
	handleBackspace={handleBackspace}
	boardRef={boardRef}
	textColour="black"
	win=false
/>
 * @returns {React.ReactElement} Square React component to be rendered in the DOM
 */

export default function Square(props) {
	let background = "white";

	if (props.isPlayer1Active && props.isPlayer2Active && props.isPlayer3Active) {
		background = "darkGrey";
	} else if (props.isPlayer1Active && props.isPlayer2Active) {
		background = "darkViolet";
	} else if (props.isPlayer1Active && props.isPlayer3Active) {
		background = "springGreen";
	} else if (props.isPlayer2Active && props.isPlayer3Active) {
		background = "orange";
	} else if (props.isPlayer1Active) {
		background = "dodgerBlue";
	} else if (props.isPlayer2Active) {
		background = "deepPink";
	} else if (props.isPlayer3Active) {
		background = "goldenRod";
	} else if (props.isPlayer1ActiveClue && props.isPlayer2ActiveClue && props.isPlayer3ActiveClue) {
		background = "silver";
	} else if (props.isPlayer1ActiveClue && props.isPlayer2ActiveClue) {
		background = "plum";
	} else if (props.isPlayer1ActiveClue && props.isPlayer3ActiveClue) {
		background = "lightGreen";
	} else if (props.isPlayer2ActiveClue && props.isPlayer3ActiveClue) {
		background = "peachPuff";
	} else if (props.isPlayer1ActiveClue) {
		background = "lightSkyBlue";
	} else if (props.isPlayer2ActiveClue) {
		background = "pink";
	} else if (props.isPlayer3ActiveClue) {
		background = "khaki";
	}

	return (
		<label
			style={{backgroundColor: background, position: "relative"}}
			onMouseDown={() => props.handleClick(props.row, props.col)}>
				<p className="clueNumber">{props.clueNum}</p>
				<input 
					type="text" id={`${props.row}-${props.col}`} 
					value={props.input}
					style={{color: props.textColour}}
					maxLength="1" onChange={props.handleInput} 
					onFocus={() => props.handleFocus(props.row, props.col)}
					onKeyDown={(event) => props.handleBackspace(event, props.row, props.col)}
					ref={(el) => {
						props.boardRef.current[props.row] = props.boardRef.current[props.row] || [];
						props.boardRef.current[props.row][props.col] = el;
					}}
					disabled={props.win}
				/>
		</label>
	)
}