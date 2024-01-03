import React from "react"
import FontAwesome from "react-fontawesome"

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
            <div className="win-modal-header">
                <button className="win-modal-close" onClick={hideModal}>
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