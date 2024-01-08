import { expect, test } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Dropdown from '../../src/components/Dropdown'

test("renders correctly", () => {
    render(<Dropdown 
                label="Test dropdown"
                menuOptions={["Option 1", "Option 2", "Option 3"]}
                func1 = {() => console.log("function1")}
                func2 = {() => console.log("function2")}
                func3 = {() => console.log("function3")}
             />)

    expect(screen.getByRole("button")).toBeInTheDocument()
    expect(screen.getByText("Test dropdown")).toBeInTheDocument()
})

test("open dropdown", () => {
    render(<Dropdown 
        label="Test dropdown"
        menuOptions={["Option 1", "Option 2", "Option 3"]}
        func1 = {() => console.log("function1")}
        func2 = {() => console.log("function2")}
        func3 = {() => console.log("function3")}
     />)

    fireEvent.click(screen.getByRole("button"))

    expect(screen.getAllByRole("button").length).toBe(4)
    expect(screen.getByText("Option 1")).toBeInTheDocument()
    expect(screen.getByText("Option 2")).toBeInTheDocument()
    expect(screen.getByText("Option 3")).toBeInTheDocument()
})