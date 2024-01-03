import React from "react"
import FontAwesome from 'react-fontawesome'

import Dropdown from "./Dropdown"

export default function ActionsHeader(props) {
    function test(func) {
        console.log(`Clicked ${func}`)
    }
    return (
        <nav>
            <div style={{float: "left"}}>
                <Dropdown 
                    label={
                        <FontAwesome
                            name='bars'
                            size='2x'
                        />
                    }
                    menuOptions={["Save", "Clear"]}
                    func1={() => test("Save")}
                    func2={props.clearBoard}
                />
                <div className="nav-item" style={{fontSize: "1.5em"}}>0:00:00</div>
                <button className="nav-item">
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
                <div className="nav-item" style={{float: "left", height: "40px", marginTop: "7px"}}>
                    <Dropdown 
                        label="Check"
                        menuOptions={["Check letter", "Check word", "Check grid"]}
                        func1={props.checkLetter}
                        func2={props.checkWord}
                        func3={props.checkGrid}
                    />
                </div>
                <button className="nav-item">
                    Print
                </button>
                <button className="nav-item">
                    Settings
                </button>
            </div>
        </nav>
    )
}