export default function Clue(props) {
    const style = {
        backgroundColor: props.isActive ? "lightSkyBlue" : "transparent",
        display: "flex"
    }

    return (
        <div 
            style={style}
            ref={el => props.clueRef.current[props.index] = el}
        >
            <b>{props.num}</b>. {props.text}
        </div>
    )
}