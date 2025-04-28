import React from "react"
import FontAwesome from 'react-fontawesome'

import Dropdown from "./Dropdown"

import { printCrossword } from "../print"

/**
 * Module to render actions header
 * @module actionsHeader
*/

/**
 * Functional React component for actions header
 * @member actionsHeader
 * @function ActionsHeader
 * @param {module:crosswordData~CrosswordData} crosswordData object containing all properties of crossword
 * @param {module:app~Timer} timer object containing start time and elapsed time since start
 * @param {function} clearBoard function to clear all values of crossword board
 * @param {function} revealLetter function to reveal letter in active square of crossword
 * @param {function} revealWord function to reveal each letter of word containing active square of crossword
 * @param {function} revealGrid function to reveal all squares of crossword board
 * @param {function} checkLetter function to check letter in active square of crossword
 * @param {function} checkWord function to check each letter of word containing active square of crossword
 * @param {function} checkGrid function to check all squares of crossword board
 * @example 
 * const [timer, setTimer] = React.useState({
    start: null,
    time: {
        hours: 0,
        mins: 0,
        secs: 0
    }
})
...
<ActionsHeader
    timer={timer}
    clearBoard={clearBoard}
    revealLetter={revealLetter}
    revealWord={revealWord}
    revealGrid={revealGrid}
    checkLetter={checkLetter}
    checkWord={checkWord}
    checkGrid={checkGrid} />
 * @returns {React.ReactElement} Actions Header React component to be rendered in the DOM
 */
export default function ActionsHeader(props) {
    return (
        <nav>
            <div style={{float: "left"}}>
                <div style={{float: "left"}}>
                    <Dropdown 
                        label={
                            <FontAwesome
                                name='bars'
                                size='2x'
                            />
                        }
                        ariaLabel="Menu"
                        menuOptions={["Save", "Clear"]}
                        func1={() => console.log("Save")}
                        func2={props.clearBoard}
                    />
                </div>
                <div style={{float: "left", width: "100px", marginTop: "8px", textAlign: "center"}}>
                    <div className="nav-item" style={{fontSize: "1.5em"}}>{props.timer.time.hours}:{props.timer.time.mins.toString().padStart(2, "0")}:{props.timer.time.secs.toString().padStart(2, "0")}</div>
                </div>
                <button className="nav-item" onClick={props.shareGame} aria-label="Share with friends">
                    <FontAwesome
                        name='user-plus'
                        size='2x'
                    />
                </button>
            </div>
            <div style={{float: "right"}}>
                <div className="nav-item" style={{float: "left", height: "40px", marginTop: "7px"}}>
                    <Dropdown 
                        label="Reveal"
                        menuOptions={["Reveal letter", "Reveal word", "Reveal grid"]}
                        func1={props.revealLetter}
                        func2={props.revealWord}
                        func3={props.revealGrid}
                    />
                </div>
                <div className="nav-item" style={{float: "left", height: "50px", marginTop: "7px"}}>
                    <Dropdown 
                        label="Check"
                        menuOptions={["Check letter", "Check word", "Check grid"]}
                        func1={props.checkLetter}
                        func2={props.checkWord}
                        func3={props.checkGrid}
                    />
                </div>
                <button className="nav-item" onClick={() => printCrossword(props.crosswordData)}>
                    Print
                </button>
                <button className="nav-item">
                    Settings
                </button>
            </div>
        </nav>
    )
}