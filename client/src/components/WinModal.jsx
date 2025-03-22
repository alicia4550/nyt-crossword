import React from "react"
import FontAwesome from "react-fontawesome"

/**
 * Module to render win modal
 * @module winModal
*/

/**
 * Functional React component for win modal
 * @member winModal
 * @function WinModal
 * @param {{hours: number, mins: number, secs: number}} time elapsed time since the starting time
 * @param {number} time.hours hour component of elapsed time
 * @param {number} time.mins minute component of elapsed time
 * @param {number} time.secs minute component of elapsed time
 * @example
 * <WinModal 
    time={
        hours: 1,
        mins: 23,
        sec: 45
    } />
 * @returns {React.ReactElement} Win Modal React component to be rendered in the DOM
 */
export default function WinModal(props) {
    const [hidden, setHidden] = React.useState(false)

    const style = {
        display: hidden ? "none" : "block"
    }

    function hideModal() {
        setHidden(true)
    }

    return (
        <div className="win-modal" style={style}>
            <div className="modal-header">
                <button className="modal-close" onClick={hideModal}>
                    <FontAwesome
                        name='times'
                        size='2x'
                    />
                </button>
            </div>
            <h2>Congratulations!</h2>
            <hr />
            <h2>
                Your time:<br/>
                <strong>{props.time.hours!= 0 && (props.time.hours + ":")}{props.time.mins.toString().padStart(2, "0")}:{props.time.secs.toString().padStart(2, "0")}</strong>
            </h2>
        </div>
    )
}