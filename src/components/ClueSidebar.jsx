import ClueList from "./ClueList";

/**
 * Module to render clues sidebar
 * @module clueSidebar
*/

/**
 * Functional React component for clue sidebar
 * @member clueSidebar
 * @function ClueSidebar
 * @param {number} activeClue clue number of active clue as displayed on the crossword
 * @param {boolean} isHorizontal true if the current direction is horizontal, false if vertical
 * @param {Array.<module:crosswordData~Clue>} hClues list of all horizontal clues to be displayed
 * @param {Array.<module:crosswordData~Clue>} vClues list of all vertical clues to be displayed
 * @param {React.MutableRefObject} hClueRef reference to DOM elements of horizontal clues
 * @param {React.MutableRefObject} vClueRef reference to DOM elements of vertical clues
 * @param {function} handleClick function that handles click on individual clue by setting the active square to the first square of the clue
 * @example
 * const hCluesRef = React.useRef([])
const vCluesRef = React.useRef([])
const hClues = [...]
const vClues = [...]
...
<ClueSidebar 
    activeClue=0
    isHorizontal=true
    hClues={hClues}
    vClues={vClues}
    hClueRef={hClueRef}
    vClueRef={vClueRef}
    handleClick={handleClick}
/>
 * @returns {React.ReactElement} Clue Sidebar React component to be rendered in the DOM
 */

export default function ClueSidebar(props) {
    return (
        <div className="clue-sidebar">
            <ClueList 
                activeClue={props.activeClue}
                isActive={props.isHorizontal}
                headingText="ACROSS"
                clues={props.hClues}
                clueRef={props.hClueRef}
                handleClick={props.handleClick}
            />
            <ClueList 
                activeClue={props.activeClue}
                isActive={!props.isHorizontal}
                headingText="DOWN"
                clues={props.vClues} 
                clueRef={props.vClueRef}
                handleClick={props.handleClick}
            />
        </div>
    )
}