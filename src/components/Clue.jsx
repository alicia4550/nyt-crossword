export default function Clue(props) {
    const style = {
        backgroundColor: props.isActive ? "lightSkyBlue" : "transparent",
        display: "flex"
    }
    return (
        <div style={style}>
            <b>{props.num}</b>. {props.text}
        </div>
    )
}