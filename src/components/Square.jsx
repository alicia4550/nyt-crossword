export default function Square(props) {
    const background = props.isActive ? "dodgerBlue" : (props.isActiveClue ? "lightSkyBlue" : "white")
    return (
        <label
            style={{backgroundColor: background, position: "relative"}}
            onMouseDown={() => props.handleClick(props.row, props.col)}>
                <p className="clueNumber">{props.clueNum}</p>
                <input 
                    type="text" id={`${props.row}-${props.col}`} 
                    value={props.input}
                    style={{color: props.textColour}}
                    maxLength="1" onChange={props.handleInput} 
                    onFocus={() => props.handleFocus(props.row, props.col)}
                    onKeyDown={(event) => props.handleBackspace(event, props.row, props.col)}
                    ref={(el) => {
                        props.boardRef.current[props.row] = props.boardRef.current[props.row] || [];
                        props.boardRef.current[props.row][props.col] = el;
                      }}
                    />
        </label>
    )
}