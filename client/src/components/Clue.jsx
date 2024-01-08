/**
 * Module to render clue text and button
 * @module clue
*/

/**
 * Functional React component for clue text and button
 * @member clue
 * @function Clue
 * @param {boolean} isActive represents whether the clue is currently active
 * @param {number} num clue number as displayed on the crossword
 * @param {string} text clue text
 * @param {React.MutableRefObject} clueRef reference to the DOM element of clue
 * @param {number} index clue number with respect to its index in either the horizontal or vertical clues array
 * @param {boolean} isHorizontal represents whether the clue is a horizontal or vertical clue
 * @param {function} handleClick function that handles click on the clue by setting the active square to the first square of the clue
 * @example
 * const ref = React.useRef()
...
<Clue
    isActive=true
    num=1
    text="Insert clue text here"
    clueRef={ref}
    index=0
    isHorizontal=true
    handleClick={handleClick}
/>
 * @returns {React.ReactElement} Clue React component to be rendered in the DOM
 */

export default function Clue(props) {
    const style = {
        backgroundColor: props.isActive ? "lightSkyBlue" : "transparent",
        borderColor: props.isActive ? "dodgerBlue" : "white"
    }

    return (
        <button 
            className="clue-text-container"
            style={style}
            ref={el => props.clueRef.current[props.index] = el}
            onClick={()=>props.handleClick(props.index, props.isHorizontal)}
        >
            <b>{props.num}</b>. {props.text}
        </button>
    )
}