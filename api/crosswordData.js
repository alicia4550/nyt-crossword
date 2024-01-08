/**
 * Module to fetch and format crossword data
 * @module crosswordData
 * @exports Clue
 * @exports Square
 * @exports CrosswordData
 */
/** 
 * @typedef Square
 * @property {string} value letter corresponding to crossword square
 * @property {boolean} isInput boolean representing whether a square is an input square or a black square
 * @property {boolean} isStart boolean representing whether a square is the beginning of a word
 * @property {number} clueNum clue number as displayed on the crossword board (number value if the square is the first square of the word, else null)
 * @property {number} hClueNum clue number corresponding to the horizontal clue of the square (with respect to its index in the array of horizontal clues)
 * @property {number} vClueNum clue number corresponding to the vertical clue of the square (with respect to its index in the array of vertical clues)
 */
/** 
 * @typedef Clue
 * @property {number} clueNum clue number as displayed on the crossword board
 * @property {string} clueText clue text
 * @property {{row: number, col: number}} firstSquare object containing the row and column numbers of the first square of the clue
 * @property {number} firstSquare.row row number of first square
 * @property {number} firstSquare.col column number of first square
 */
/**
 * @typedef CrosswordData
 * @property {string} id numerical id of crossword puzzle
 * @property {string} title title of crossword
 * @property {string} author author and editor of crossword
 * @property {Array.<Array.<module:crosswordData~Square>>} boardData data of all squares in crossword
 * @property {Array.<module:crosswordData~Clue>} hClues all horizontal clues of crossword
 * @property {Array.<module:crosswordData~Clue>} vClues all vertical clues of crossword
 */

/**
 * Get url to fetch today's crossword from NYT API
 * @member crosswordData
 * @function getUrl
 * @returns {string} url string to fetch crossword
 */
export function getUrl() {
    const date = new Date()
    const dateString = date.getFullYear().toString().slice(2) + (date.getMonth()+1).toString().padStart(2, "0") + date.getDate().toString().padStart(2, "0")

    return `/nytsyn-crossword-mh/nytsyncrossword?date=${dateString}`
}

/**
 * Fetch and get response from NYT API
 * @member crosswordData
 * @function getDataString
 * @param {string} url 
 * @returns {string} crossword data in a multiline string
 */
export async function getDataString(url) {
    const response = await fetch(url)
    const dataString = await response.text()

    return dataString
}

/**
 * Format crossword data
 * @param {string} dataString multiline string containing all crossword data
 * @returns {module:crosswordData~CrosswordData} crossword data formatted into object with properties
 */
export function getCrosswordData(dataString) {
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
        board.push(splitString[16+i].replace(/%/g, "").split(''))
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

                hClues.push(
                    /** @type {module:crosswordData~Clue} */
                    {
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

    return {
        id: id,
        title: title,
        author: author,
        board: boardData,
        hClues: hClues,
        vClues: vClues
    }
}