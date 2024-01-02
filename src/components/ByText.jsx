export default function ByText(props) {
    return (
        <div className="byText">
            <p>{props.title} <i>by <br/>{props.author}</i></p>
        </div>
    )
}