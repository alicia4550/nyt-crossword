import { expect, test, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import App from "../src/App"
import { getCrosswordData } from '../src/crosswordData'

const dataString = 
`ARCHIVE

111

Test Crossword

Alicia Tran

3

3

4

4

ABC
D#F
GHI

Horizontal clue 1
Horizontal clue 2
Horizontal clue 3
Horizontal clue 4

Vertical clue 1
Vertical clue 2
Vertical clue 3
Vertical clue 4

`

const data = getCrosswordData(dataString)

window.HTMLElement.prototype.scrollIntoView = vi.fn()

test("renders clue header correctly", () => {
    render(<App crosswordData={data}/>)

    expect(document.querySelector(".clueText")).toHaveTextContent("1 ACROSS • Horizontal clue 1")
    expect(document.querySelector(".clueText")).not.toHaveTextContent("7 DOWN • Vertical clue 4")

    fireEvent.click(screen.getAllByRole("button")[screen.getAllByRole("button").length-1])

    expect(document.querySelector(".clueText")).not.toHaveTextContent("1 ACROSS • Horizontal clue 1")
    expect(document.querySelector(".clueText")).toHaveTextContent("7 DOWN • Vertical clue 4")
})

test("renders win modal on win", () => {
    render(<App crosswordData={data}/>)

    expect(document.querySelector(".win-modal")).not.toBeInTheDocument()
    
    fireEvent.change(screen.getAllByRole("textbox")[0], {target: {value: 'A'}})
    fireEvent.change(screen.getAllByRole("textbox")[1], {target: {value: 'B'}})
    fireEvent.change(screen.getAllByRole("textbox")[2], {target: {value: 'C'}})
    fireEvent.change(screen.getAllByRole("textbox")[3], {target: {value: 'D'}})
    fireEvent.change(screen.getAllByRole("textbox")[4], {target: {value: 'F'}})
    fireEvent.change(screen.getAllByRole("textbox")[5], {target: {value: 'G'}})
    fireEvent.change(screen.getAllByRole("textbox")[6], {target: {value: 'H'}})
    fireEvent.change(screen.getAllByRole("textbox")[7], {target: {value: 'I'}})

    expect(document.querySelector(".win-modal")).toBeInTheDocument()
})

test("check grid", () => {
    render(<App crosswordData={data}/>)

    expect(screen.getAllByRole("textbox")[0]).toHaveStyle("color: rgb(0, 0, 0)")

    fireEvent.change(screen.getAllByRole("textbox")[0], {target: {value: 'B'}})
    fireEvent.change(screen.getAllByRole("textbox")[1], {target: {value: 'B'}})

    fireEvent.click(screen.getByText("Check"))
    fireEvent.click(screen.getByText("Check grid"))

    expect(screen.getAllByRole("textbox")[0]).toHaveStyle("color: rgb(255, 0, 0)")
    expect(screen.getAllByRole("textbox")[1]).toHaveStyle("color: rgb(0, 0, 0)")
})

test("check word (horizontal)", () => {
    render(<App crosswordData={data}/>)

    expect(screen.getAllByRole("textbox")[0]).toHaveStyle("color: rgb(0, 0, 0)")

    fireEvent.change(screen.getAllByRole("textbox")[3], {target: {value: 'B'}})
    fireEvent.change(screen.getAllByRole("textbox")[0], {target: {value: 'B'}})
    fireEvent.change(screen.getAllByRole("textbox")[1], {target: {value: 'B'}})
    fireEvent.change(screen.getAllByRole("textbox")[2], {target: {value: 'B'}})

    fireEvent.focus(screen.getAllByRole("textbox")[1])

    fireEvent.click(screen.getByText("Check"))
    fireEvent.click(screen.getByText("Check word"))

    expect(screen.getAllByRole("textbox")[0]).toHaveStyle("color: rgb(255, 0, 0)")
    expect(screen.getAllByRole("textbox")[1]).toHaveStyle("color: rgb(0, 0, 0)")
    expect(screen.getAllByRole("textbox")[2]).toHaveStyle("color: rgb(255, 0, 0)")
    expect(screen.getAllByRole("textbox")[3]).toHaveStyle("color: rgb(0, 0, 0)")
})

test("check word (vertical)", () => {
    render(<App crosswordData={data}/>)

    fireEvent.mouseDown(screen.getAllByRole("textbox")[0].parentElement)

    expect(screen.getAllByRole("textbox")[0]).toHaveStyle("color: rgb(0, 0, 0)")

    fireEvent.change(screen.getAllByRole("textbox")[1], {target: {value: 'A'}})
    fireEvent.change(screen.getAllByRole("textbox")[0], {target: {value: 'A'}})
    fireEvent.change(screen.getAllByRole("textbox")[3], {target: {value: 'A'}})
    fireEvent.change(screen.getAllByRole("textbox")[5], {target: {value: 'A'}})

    fireEvent.focus(screen.getAllByRole("textbox")[3])

    fireEvent.click(screen.getByText("Check"))
    fireEvent.click(screen.getByText("Check word"))

    expect(screen.getAllByRole("textbox")[0]).toHaveStyle("color: rgb(0, 0, 0)")
    expect(screen.getAllByRole("textbox")[1]).toHaveStyle("color: rgb(0, 0, 0)")
    expect(screen.getAllByRole("textbox")[3]).toHaveStyle("color: rgb(255, 0, 0)")
    expect(screen.getAllByRole("textbox")[5]).toHaveStyle("color: rgb(255, 0, 0)")
})

test("check letter", () => {
    render(<App crosswordData={data}/>)

    expect(screen.getAllByRole("textbox")[0]).toHaveStyle("color: rgb(0, 0, 0)")

    fireEvent.change(screen.getAllByRole("textbox")[0], {target: {value: 'C'}})
    fireEvent.change(screen.getAllByRole("textbox")[1], {target: {value: 'C'}})
    fireEvent.focus(screen.getAllByRole("textbox")[0])

    fireEvent.click(screen.getByText("Check"))
    fireEvent.click(screen.getByText("Check letter"))

    expect(screen.getAllByRole("textbox")[0]).toHaveStyle("color: rgb(255, 0, 0)")
    expect(screen.getAllByRole("textbox")[1]).toHaveStyle("color: rgb(0, 0, 0)")
})

test("reveal grid", () => {
    render(<App crosswordData={data}/>)

    screen.getAllByRole("textbox").map(element => {
        expect(element).toHaveStyle("color: rgb(0, 0, 0)")
    })

    fireEvent.click(screen.getByText("Reveal"))
    fireEvent.click(screen.getByText("Reveal grid"))

    screen.getAllByRole("textbox").map((element, index) => {
        const skippedBox = index >= 4 ? 1 : 0
        expect(element).toHaveStyle("color: rgb(0, 128, 0)")
        expect(element).toHaveDisplayValue(data.board[parseInt((index+skippedBox)/3)][(index+skippedBox)%3].value)
    })
})

test("reveal word (horizontal)", () => {
    render(<App crosswordData={data}/>)

    expect(screen.getAllByRole("textbox")[0]).toHaveStyle("color: rgb(0, 0, 0)")
    expect(screen.getAllByRole("textbox")[1]).toHaveStyle("color: rgb(0, 0, 0)")
    expect(screen.getAllByRole("textbox")[2]).toHaveStyle("color: rgb(0, 0, 0)")

    fireEvent.click(screen.getByText("Reveal"))
    fireEvent.click(screen.getByText("Reveal word"))

    expect(screen.getAllByRole("textbox")[0]).toHaveDisplayValue("A")
    expect(screen.getAllByRole("textbox")[1]).toHaveDisplayValue("B")
    expect(screen.getAllByRole("textbox")[2]).toHaveDisplayValue("C")
    expect(screen.getAllByRole("textbox")[3]).toHaveDisplayValue("")
    expect(screen.getAllByRole("textbox")[0]).toHaveStyle("color: rgb(0, 128, 0)")
    expect(screen.getAllByRole("textbox")[1]).toHaveStyle("color: rgb(0, 128, 0)")
    expect(screen.getAllByRole("textbox")[2]).toHaveStyle("color: rgb(0, 128, 0)")
    expect(screen.getAllByRole("textbox")[3]).toHaveStyle("color: rgb(0, 0, 0)")
})

test("reveal word (vertical)", () => {
    render(<App crosswordData={data}/>)

    expect(screen.getAllByRole("textbox")[2]).toHaveStyle("color: rgb(0, 0, 0)")
    expect(screen.getAllByRole("textbox")[4]).toHaveStyle("color: rgb(0, 0, 0)")
    expect(screen.getAllByRole("textbox")[7]).toHaveStyle("color: rgb(0, 0, 0)")

    fireEvent.click(screen.getAllByRole("button")[screen.getAllByRole("button").length-2])
    fireEvent.click(screen.getByText("Reveal"))
    fireEvent.click(screen.getByText("Reveal word"))

    expect(screen.getAllByRole("textbox")[0]).toHaveDisplayValue("")
    expect(screen.getAllByRole("textbox")[2]).toHaveDisplayValue("C")
    expect(screen.getAllByRole("textbox")[4]).toHaveDisplayValue("F")
    expect(screen.getAllByRole("textbox")[7]).toHaveDisplayValue("I")
    expect(screen.getAllByRole("textbox")[0]).toHaveStyle("color: rgb(0, 0, 0)")
    expect(screen.getAllByRole("textbox")[2]).toHaveStyle("color: rgb(0, 128, 0)")
    expect(screen.getAllByRole("textbox")[4]).toHaveStyle("color: rgb(0, 128, 0)")
    expect(screen.getAllByRole("textbox")[7]).toHaveStyle("color: rgb(0, 128, 0)")
})

test("reveal letter", () => {
    render(<App crosswordData={data}/>)

    expect(screen.getAllByRole("textbox")[0]).toHaveStyle("color: rgb(0, 0, 0)")

    fireEvent.click(screen.getByText("Reveal"))
    fireEvent.click(screen.getByText("Reveal letter"))

    expect(screen.getAllByRole("textbox")[0]).toHaveDisplayValue("A")
    expect(screen.getAllByRole("textbox")[0]).toHaveStyle("color: rgb(0, 128, 0)")

    expect(screen.getAllByRole("textbox")[3]).toHaveDisplayValue("")
    expect(screen.getAllByRole("textbox")[3]).toHaveStyle("color: rgb(0, 0, 0)")
})

test("clear board", () => {
    render(<App crosswordData={data} />)

    fireEvent.change(screen.getAllByRole("textbox")[0], {target: {value: 'A'}})
    fireEvent.change(screen.getAllByRole("textbox")[1], {target: {value: 'A'}})
    fireEvent.change(screen.getAllByRole("textbox")[2], {target: {value: 'A'}})

    fireEvent.click(screen.getAllByRole("button")[0])
    fireEvent.click(screen.getByText("Clear"))

    screen.getAllByRole("textbox").map(element => {
        expect(element).toHaveDisplayValue("")
    })
})

test("handle click on square", () => {
    render(<App crosswordData={data} />)

    expect(screen.getAllByRole("textbox")[1].parentElement).toHaveStyle("background-color: rgb(135, 206, 250)")
    expect(screen.getAllByRole("textbox")[3].parentElement).toHaveStyle("background-color: rgb(255, 255, 255)")
    fireEvent.mouseDown(screen.getAllByRole("textbox")[0].parentElement)
    expect(screen.getAllByRole("textbox")[3].parentElement).toHaveStyle("background-color: rgb(135, 206, 250)")
    expect(screen.getAllByRole("textbox")[1].parentElement).toHaveStyle("background-color: rgb(255, 255, 255)")
    fireEvent.mouseDown(screen.getAllByRole("textbox")[0].parentElement)
    expect(screen.getAllByRole("textbox")[1].parentElement).toHaveStyle("background-color: rgb(135, 206, 250)")
    expect(screen.getAllByRole("textbox")[3].parentElement).toHaveStyle("background-color: rgb(255, 255, 255)")
})

test("handle input (horizontal clue)", () => {
    render(<App crosswordData={data} />)

    fireEvent.mouseDown(screen.getAllByRole("textbox")[0].parentElement)
    expect(screen.getAllByRole("textbox")[3].parentElement).toHaveStyle("background-color: rgb(135, 206, 250)")
    
    fireEvent.change(screen.getAllByRole("textbox")[0], {target: {value: 'A'}})
    expect(screen.getAllByRole("textbox")[3].parentElement).toHaveStyle("background-color: rgb(30, 144, 255)")
})

test("handle input (vertical clue)", () => {
    render(<App crosswordData={data} />)

    fireEvent.mouseDown(screen.getAllByRole("textbox")[0].parentElement)
    fireEvent.mouseDown(screen.getAllByRole("textbox")[0].parentElement)
    expect(screen.getAllByRole("textbox")[1].parentElement).toHaveStyle("background-color: rgb(135, 206, 250)")
    
    fireEvent.change(screen.getAllByRole("textbox")[0], {target: {value: 'A'}})
    expect(screen.getAllByRole("textbox")[1].parentElement).toHaveStyle("background-color: rgb(30, 144, 255)")
})

test("handle input (last letter of vertical clue)", () => {
    render(<App crosswordData={data} />)

    fireEvent.click(screen.getAllByRole("button")[screen.getAllByRole("button").length-1])
    expect(screen.getAllByRole("textbox")[0].parentElement).toHaveStyle("background-color: rgb(255, 255, 255)")
    
    fireEvent.change(screen.getAllByRole("textbox")[6], {target: {value: 'A'}})
    expect(screen.getAllByRole("textbox")[0].parentElement).toHaveStyle("background-color: rgb(30, 144, 255)")
})

test("handle input (last square of crossword)", () => {
    render(<App crosswordData={data} />)

    expect(screen.getAllByRole("textbox")[0].parentElement).toHaveStyle("background-color: rgb(30, 144, 255)")
    fireEvent.mouseDown(screen.getAllByRole("textbox")[0].parentElement)
    fireEvent.click(screen.getByText("Reveal"))
    fireEvent.click(screen.getByText("Reveal grid"))

    expect(screen.getAllByRole("textbox")[0].parentElement).toHaveStyle("background-color: rgb(30, 144, 255)")
})

test("handle clue click", () => {
    render(<App crosswordData={data} />)

    expect(screen.getAllByRole("textbox")[5].parentElement).toHaveStyle("background-color: rgb(255, 255, 255)")
    fireEvent.click(screen.getAllByRole("button")[screen.getAllByRole("button").length-5])
    expect(screen.getAllByRole("textbox")[5].parentElement).toHaveStyle("background-color: rgb(30, 144, 255)")
})

test("increase timer", () => {
    render(<App crosswordData={data}/>)

    expect(screen.getByText("0:00:00")).toBeInTheDocument()

    fireEvent.change(screen.getAllByRole("textbox")[0], {target: {value: 'A'}})
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    sleep(1000).then(() => {
        expect(screen.getByText("0:00:01")).toBeInTheDocument()
    })
})