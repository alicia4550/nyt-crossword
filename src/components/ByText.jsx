/**
 * Module to render authorship text
 * @module byText
*/

/**
 * Functional React component for authorship text
 * @member byText
 * @function ByText
 * @param {string} title title of crossword
 * @param {string} author author and editor of crossword
 * @example
 * <ByText 
    title="NY Times, Wed, Jan 3, 2024"
    author="Ruth Bloomfield Margolin / Will Shortz"
/>
 * @returns {React.ReactElement} By Text React component to be rendered in the DOM
 */

export default function ByText(props) {
    return (
        <div className="byText">
            <p>{props.title} <i>by <br/>{props.author}</i></p>
        </div>
    )
}