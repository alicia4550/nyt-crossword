const date = new Date()
const dateString = date.getFullYear().toString().slice(2) + (date.getMonth()+1).toString().padStart(2, "0") + date.getDate().toString().padStart(2, "0")

const url = `/nytsyn-crossword-mh/nytsyncrossword?date=${dateString}`

const response = await fetch(url)
const dataString = await response.text()

const splitString = dataString.split("\n")

const id = splitString[2]
const title = splitString[4]
const author = splitString[6]

const rows = parseInt(splitString[8])
const cols = parseInt(splitString[10])

const numHClues = parseInt(splitString[12])
const numVClues = parseInt(splitString[14])

let board = []
let hCluesText = []
let vCluesText = []

for (let i = 0; i < rows; i++) {
    board.push(splitString[16+i].split(''))
}

for (let i = 0; i < numHClues; i++) {
    hCluesText.push(splitString[17+rows+i])
}

for (let i = 0; i < numVClues; i++) {
    vCluesText.push(splitString[18+rows+numHClues+i])
}

let clueNum = 0
let hClueCount = -1
let vClueCount = -1
let boardData = []
let hClues = []
let vClues = []

board.map((row, rowIndex) => {
    let rowData = []
    {row.map((square, colIndex) => {
        let isInput = square != "#"
        let isVStart = isInput && (rowIndex === 0 || board[rowIndex-1][colIndex] === "#")
        let isHStart = isInput && (colIndex === 0 || board[rowIndex][colIndex-1] === "#")

        if (isVStart && isHStart) {
            clueNum++
            hClueCount++
            vClueCount++

            hClues.push({
                clueNum: clueNum,
                clueText: hCluesText[hClueCount],
                firstSquare: {
                    row: rowIndex,
                    col: colIndex
                }
            })
            vClues.push({
                clueNum: clueNum,
                clueText: vCluesText[vClueCount],
                firstSquare: {
                    row: rowIndex,
                    col: colIndex
                }
            })
        }
        else if (isVStart) {
            clueNum++
            vClueCount++

            vClues.push({
                clueNum: clueNum,
                clueText: vCluesText[vClueCount],
                firstSquare: {
                    row: rowIndex,
                    col: colIndex
                }
            })
        }
        else if (isHStart) {
            clueNum++
            hClueCount++

            hClues.push({
                clueNum: clueNum,
                clueText: hCluesText[hClueCount],
                firstSquare: {
                    row: rowIndex,
                    col: colIndex
                }
            })
        }

        rowData.push(
            {
                value: square,
                isInput: isInput,
                isStart: isVStart || isHStart,
                clueNum: isVStart || isHStart ? clueNum : "",
                hClueNum: isInput ? (isHStart ? hClueCount : rowData[rowData.length-1].hClueNum) : -1,
                vClueNum: isInput ? (isVStart ? vClueCount : boardData[boardData.length-1][colIndex].vClueNum) : -1,
            }
        )
    })}
    boardData.push(rowData)
})

export default {
    id: id,
    title: title,
    author: author,
    board: boardData,
    hClues: hClues,
    vClues: vClues
}