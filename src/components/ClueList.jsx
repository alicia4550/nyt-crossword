import Clue from "./Clue";

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
                        />
                    )
                })}
            </div>
        </div>
    )
}