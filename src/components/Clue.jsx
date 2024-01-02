export default function Clue(props) {
    const style = {
        backgroundColor: props.isActive ? "lightSkyBlue" : "transparent",
        borderColor: props.isActive ? "dodgerBlue" : "white"
    }

    return (
        <button 
            className="clue-text-container"
            style={style}
            ref={el => props.clueRef.current[props.index] = el}
            onClick={()=>props.handleClick(props.index, props.isHorizontal)}
        >
            <b>{props.num}</b>. {props.text}
        </button>
    )
}