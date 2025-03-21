import Clue from "./Clue";

/**
 * Module to render list of clues
 * @module clueList
*/

/**
 * Functional React component for list of clues
 * @member clueList
 * @function ClueList
 * @param {number} activeClue clue number of active clue as displayed on the crossword
 * @param {boolean} isActive represents whether the current direction matches the direction of the clues in the list
 * @param {string} headingText "ACROSS" if direction of clues is horizontal, "DOWN" if direction of clues is vertical
 * @param {Array.<module:crosswordData~Clue>} clues list of all clues to be displayed
 * @param {React.MutableRefObject} clueRef reference to DOM elements of clues
 * @param {function} handleClick function that handles click on individual clue by setting the active square to the first square of the clue
 * @example
 * const clueRef = React.useRef([])
const clues = [...]
...
<ClueList 
    activeClue=0
    isActive=true
    headingText="ACROSS"
    clues={clues}
    clueRef={clueRef}
    handleClick={handleClick}
/>
 * @returns {React.ReactElement} Clue List React component to be rendered in the DOM
 */

export default function ClueList(props) {
    return (
        <div className="clue-list">
            <div className="clue-list-heading">
                <h2>{props.headingText}</h2>
                <hr/>
            </div>
            <div className="clue-list-body">
                {props.clues.map((clue, index) => {
                    return (
                        <Clue
                            key={clue.clueNum + clue.clueText}
                            isActive={props.isActive && props.activeClue === index}
                            num={clue.clueNum}
                            text={clue.clueText}
                            clueRef={props.clueRef}
                            index={index}
                            isHorizontal={props.headingText === "ACROSS"}
                            handleClick={props.handleClick}
                        />
                    )
                })}
            </div>
        </div>
    )
}