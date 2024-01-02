export default function ClueHeader(props) {
    return (
        <div className="clueText">
            {props.clue.clueNum} {props.isHorizontal ? "ACROSS" : "DOWN"} • {props.clue.clueText}
        </div>
    )
}