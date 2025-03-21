import { expect, test } from 'vitest'
import { createCrossword, createGrid, createCluesTable, createClueTableBody, getDocDefinition, printCrossword } from '../src/print'

const board = [[
    {value: "A", isInput: true, isStart: true, clueNum: 1, hClueNum: 0, vClueNum: 0},
    {value: "#", isInput: false, isStart: false, clueNum: "", hClueNum: -1, vClueNum: -1}
], [
    {value: "B", isInput: true, isStart: true, clueNum: 2, hClueNum: 1, vClueNum: 0},
    {value: "C", isInput: true, isStart: true, clueNum: 3, hClueNum: 1, vClueNum: 1}
]]

const clueList = [{
    clueNum: 1,
    clueText: "Clue 1",
    firstSquare: {
        row: 0,
        col: 0
    }
}, {
    clueNum: 2,
    clueText: "Clue 2",
    firstSquare: {
        row: 0,
        col: 1
    }
}]

function createTestCrossword() {
    const expectedBoard = [[
        {value: "A", isInput: true, isStart: true, clueNum: 1, hClueNum: 0, vClueNum: 0},
        {value: "B", isInput: true, isStart: true, clueNum: 2, hClueNum: 0, vClueNum: 1},
        {value: "C", isInput: true, isStart: true, clueNum: 3, hClueNum: 0, vClueNum: 2}
    ], [
        {value: "D", isInput: true, isStart: true, clueNum: 4, hClueNum: 1, vClueNum: 0},
        {value: "#", isInput: false, isStart: false, clueNum: "", hClueNum: -1, vClueNum: -1},
        {value: "F", isInput: true, isStart: true, clueNum: 5, hClueNum: 2, vClueNum: 2}
    ], [
        {value: "G", isInput: true, isStart: true, clueNum: 6, hClueNum: 3, vClueNum: 0},
        {value: "H", isInput: true, isStart: true, clueNum: 7, hClueNum: 3, vClueNum: 3},
        {value: "I", isInput: true, isStart: false, clueNum: "", hClueNum: 3, vClueNum: 2}
    ]]

    const expectedHClues = [
        {clueNum: 1, clueText: "Horizontal clue 1", firstSquare: {row: 0, col: 0}},
        {clueNum: 4, clueText: "Horizontal clue 2", firstSquare: {row: 1, col: 0}},
        {clueNum: 5, clueText: "Horizontal clue 3", firstSquare: {row: 1, col: 2}},
        {clueNum: 6, clueText: "Horizontal clue 4", firstSquare: {row: 2, col: 0}}
    ]

    const expectedVClues = [
        {clueNum: 1, clueText: "Vertical clue 1", firstSquare: {row: 0, col: 0}},
        {clueNum: 2, clueText: "Vertical clue 2", firstSquare: {row: 0, col: 1}},
        {clueNum: 3, clueText: "Vertical clue 3", firstSquare: {row: 0, col: 2}},
        {clueNum: 7, clueText: "Vertical clue 4", firstSquare: {row: 2, col: 1}}
    ]

    return {
        id: "111",
        title: "Test Crossword",
        author: "Alicia Tran",
        board: expectedBoard,
        hClues: expectedHClues,
        vClues: expectedVClues
    }
}

test("create crossword", () => {
    const grid = [[
        {text: 1, fontSize: 6},
        {text: "", fillColor: "black"}
    ], [
        {text: 2, fontSize: 6},
        {text: 3, fontSize: 6}
    ]]
    
    const crossword = createCrossword(board)

    expect(crossword.headerRows).toBe(0)
    expect(crossword.widths).toStrictEqual([190, 190])
    expect(crossword.heights).toBe(190)
    expect(crossword.body).toStrictEqual(grid)
})

test("create crossword grid", () => {
    const grid = createGrid(board)

    expect(grid.length).toBe(2)
    expect(grid[0].length).toBe(2)

    expect(grid[0][0]).toStrictEqual({text: 1, fontSize: 6})
    expect(grid[0][1]).toStrictEqual({text: "", fillColor: "black"})
    expect(grid[1][0]).toStrictEqual({text: 2, fontSize: 6})
    expect(grid[1][1]).toStrictEqual({text: 3, fontSize: 6})
})

test("create clues table", () => {
    const expectedBody = [[
        {text: "ACROSS", bold: true,fontSize: 24,colSpan: 2},
        ""
    ], [
        {text: 1,bold: true},
        {text: "Clue 1"}

    ], [
        {text: 2, bold: true},
        {text: "Clue 2"}
    ]]

    const cluesTable = createCluesTable("ACROSS", clueList)

    expect(cluesTable.headerRows).toBe(1)
    expect(cluesTable.widths).toStrictEqual([20, 210])
    expect(cluesTable.body).toStrictEqual(expectedBody)
})

test("create list of clues", () => {
    const clueTableBody = createClueTableBody("ACROSS", clueList)

    expect(clueTableBody.length).toBe(3)

    expect(clueTableBody[0][0].text).toBe("ACROSS")

    expect(clueTableBody[1][0].text).toBe(1)
    expect(clueTableBody[1][1].text).toBe("Clue 1")

    expect(clueTableBody[2][0].text).toBe(2)
    expect(clueTableBody[2][1].text).toBe("Clue 2")
})

test("create document definition", () => {
    const crossword = createTestCrossword()

    const docDef = getDocDefinition(crossword)
    const content = docDef.content

    expect(content[0]).toStrictEqual({
        text: "NYT Crossword Clone",
        alignment: "center",
        bold: true,
        fontSize: 24
    })

    expect(content[1]).toStrictEqual({
        canvas: [
            {
                type: 'line',
                x1: 0,
                y1: 5,
                x2: 535,
                y2: 5,
                lineWidth: 0.5
            }
        ]
    })

    expect(content[2]).toStrictEqual({
        text: ["Test Crossword", {text: " by", italics: true}],
        alignment: "center",
        margin: [0, 25, 0, 0]
    })

    expect(content[3]).toStrictEqual({
        text: "Alicia Tran",
        alignment: "center",
        italics: true,
        margin: [0, 0, 0, 25]
    })

    expect(content[4]).toStrictEqual({
        layout: 'darkHorizontalLines',
        table: createCrossword(crossword.board)
    })

    expect(content[5]).toStrictEqual({
        columns: [
            {
                width: 'auto',
                table: createCluesTable("ACROSS", crossword.hClues),
                layout: "headerLineOnly"
            }, {
                width: 'auto',
                table: createCluesTable("DOWN", crossword.vClues),
                layout: "headerLineOnly"
            }
        ],
        columnGap: 25,
        margin: [0, 25, 0, 0]
    })
})

test.todo("print PDF", () => {
    printCrossword(createTestCrossword())
})