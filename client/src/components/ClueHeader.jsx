/**
 * Module to render clue header
 * @module clueHeader
*/

/**
 * Functional React component for clue header
 * @member clueHeader
 * @function ClueHeader
 * @param {boolean} isHorizontal boolean representing if the clue is horizontal or vertical
 * @param {module:crosswordData~Clue} clue Clue object to be displayed
 * @example
 * <ClueHeader 
    isHorizontal=true
    clue={
        clueNum: 10,
        clueText: "Insert clue text here",
        firstSquare: {
            row: 1,
            col: 2
        }
    } 
/>
 * @returns {React.ReactElement} Clue Header React component to be rendered in the DOM
 */

export default function ClueHeader(props) {
    return (
        <div className="clueText">
            {props.clue.clueNum} {props.isHorizontal ? "ACROSS" : "DOWN"} • {props.clue.clueText}
        </div>
    )
}