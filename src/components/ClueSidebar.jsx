import ClueList from "./ClueList";

export default function ClueSidebar(props) {
    return (
        <div className="clue-sidebar">
            <ClueList 
                activeClue={props.activeClue}
                isActive={props.isHorizontal}
                headingText="ACROSS"
                clues={props.hClues} 
            />
            <ClueList 
                activeClue={props.activeClue}
                isActive={!props.isHorizontal}
                headingText="DOWN"
                clues={props.vClues} 
            />
        </div>
    )
}