import React from "react"

/**
 * Module to render dropdown in the actions header
 * @module dropdown
*/

/**
 * Functional React component for dropdown menu
 * @member dropdown
 * @function Dropdown
 * @param {string} label text label of dropdown menu
 * @param {Array.<string>} menuOptions text labels of menu options in dropdown, length of min 1 and max 3
 * @param {function} func1 on click handler function correspoonding to first menu option
 * @param {function} [func2] on click handler function correspoonding to second menu option
 * @param {function} [func3] on click handler function correspoonding to third menu option
 * @example
 * <Dropdown 
    label="Actions"
    menuOptions={["Save", "Clear"]}
    func1={function1}
    func2={function2}
/>
 * @returns {React.ReactElement} Dropdown React component to be rendered in the DOM
 */

export default function Dropdown(props) {
    const [isOpen, setIsOpen] = React.useState(false)
    
    function handleOpen() {
        setIsOpen(prevIsOpen => !prevIsOpen)
    }

    return (
        <div className="dropdown nav-item">
            <button onClick={handleOpen} className="dropdown-button">
                {props.label}
            </button>
            {isOpen &&
                <ul className="menu">
                    {props.menuOptions.map((option, index) => {
                        return (
                            <li key={option} className="menu-item">
                                <button onClick={index == 0 ? props.func1 : (index == 1 ? props.func2 : props.func3)}>
                                    {option}
                                </button>
                            </li>
                        )
                    })}
                </ul>
            }
        </div>
    )
}