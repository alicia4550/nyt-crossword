import ClueList from "./ClueList";

export default function ClueSidebar(props) {
    return (
        <div className="clue-sidebar">
            <ClueList 
                activeClue={props.activeClue}
                isActive={props.isHorizontal}
                headingText="ACROSS"
                clues={props.hClues}
                clueRef={props.hClueRef}
            />
            <ClueList 
                activeClue={props.activeClue}
                isActive={!props.isHorizontal}
                headingText="DOWN"
                clues={props.vClues} 
                clueRef={props.vClueRef}
            />
        </div>
    )
}