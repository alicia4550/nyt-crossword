export default function Square(props) {
    const background = props.isActive ? "dodgerBlue" : (props.isActiveClue ? "lightSkyBlue" : "white")
    return (
        <div 
            style={{backgroundColor: background, color: "black", position: "relative"}}
            onClick={() => props.handleClick(props.row, props.col)}>
                <p className="clueNumber">{props.clueNum}</p>
                <input type="text" maxLength="1"/>
        </div>
    )
}