import React from "react"
import FontAwesome from 'react-fontawesome'

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