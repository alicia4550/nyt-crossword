export default function ClueHeader(props) {
    return (
        <div className="clueText" style={{width: "615px"}}>
            {props.clue.clueNum} {props.isHorizontal ? "ACROSS" : "DOWN"} • {props.clue.clueText}
        </div>
    )
}