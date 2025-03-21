import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

/**
 * Module to fetch and format crossword data
 * @module print
 */

/**
 * @typedef Table
 * @property {number} [headerRows] number of headers rows in the table, defaults to 0
 * @property {Array.<string|number>} widths widths of each column of the table
 * @property {number} [heights] height of each row of the table
 * @property {Array.<Array.<Object.<string, string>>>} body JSON object containing all properties of all cells of the table
 */

pdfMake.vfs = pdfFonts;

/**
 * Create crossword grid
 * @member print
 * @function createCrossword
 * @param {Array.<Array.<Square>>} board 2D array of objects containing data properties of each square of the board
 * @returns {module:print~Table} JSON object of properties of crossword grid to be rendered by pdfmake
 */
export function createCrossword(board) {
    const numRows = board[0].length
    return {
        headerRows: 0,
        widths: Array(numRows).fill(380/numRows),
        heights: 380/numRows,

        body: createGrid(board)
    }
}

/**
 * Create body of table object used to render crossword grid
 * @member print
 * @function createGrid
 * @param {Array.<Array.<Square>>} board 2D array of objects containing data properties of each square of the board
 * @returns {Array.<Array.<number|string|Object.<string, string>>>} 2D array of JSON objects representing each square of grid
 */
export function createGrid(board) {
    return board.map(row => {
        return row.map(square => {
            if (square.value === "#") {
                return { 
                    text: "",
                    fillColor: "black" 
                }
            } else {
                return {
                    text: square.clueNum,
                    fontSize: 6
                }
            }
        })
    })
}

/**
 * Create table of clues - clue number in first column, clue text in second column
 * @member print
 * @function createCrossword
 * @param {string} heading header text - "ACROSS" for horizontal clues, "DOWN" for vertical clues
 * @param {Array.<Array.<module:crosswordData~Clue>>} clueList list of clues to display
 * @returns {module:print~Table} JSON object of properties of table to be rendered by pdfmake
 */
export function createCluesTable(heading, clueList) {
    return {
        headerRows: 1,
        widths: [20, 210],

        body: createClueTableBody(heading, clueList)
    }
}

/**
 * Create body of table object used to render crossword grid
 * @member print
 * @function createClueTableBody
 * @param {string} heading header text - "ACROSS" for horizontal clues, "DOWN" for vertical clues
 * @param {Array.<Array.<module:crosswordData~Clue>>} clueList list of clues to display
 * @returns {Array.<Array.<Object.<string, string>>>} 2D array of JSON objects representing each clue
 */
export function createClueTableBody(headingText, clueList) {
    const heading = [
        {
            text: headingText,
            bold: true,
            fontSize: 24,
            colSpan: 2
        },
        ""
    ]
    const clues = clueList.map(clue => {
        return [{
            text: clue.clueNum,
            bold: true
        }, {
            text: clue.clueText
        }]
    })

    return [heading, ...clues]
}

/**
 * @typedef DocDefinition
 * @property {Array.<Object.<string, *>>} content content to be rendered in PDF
 */

/**
 * Get document definition used to generate PDF with pdfmake
 * @member print
 * @function getDocDefinition
 * @param {module:crosswordData~CrosswordData} crosswordData object containing all properties of crossword
 * @returns {module:print~DocDefinition} document definition used to generate PDF
 */
export function getDocDefinition(crosswordData) {
    return {
        content: [{
            text: "NYT Crossword Clone",
            alignment: "center",
            bold: true,
            fontSize: 24
        }, {
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
        }, {
            text: [crosswordData.title, {text: " by", italics: true}],
            alignment: "center",
            margin: [0, 25, 0, 0]
        }, {
            text: crosswordData.author,
            alignment: "center",
            italics: true,
            margin: [0, 0, 0, 25]
        }, {
            layout: 'darkHorizontalLines',
            table: createCrossword(crosswordData.board)
        }, {
            columns: [
                {
                    width: 'auto',
                    table: createCluesTable("ACROSS", crosswordData.hClues),
                    layout: "headerLineOnly"
                }, {
                    width: 'auto',
                    table: createCluesTable("DOWN", crosswordData.vClues),
                    layout: "headerLineOnly"
                }
            ],
            columnGap: 25,
            margin: [0, 25, 0, 0]
        }]
    };
}

/**
 * pdfMake method call to print a PDF of the crossword puzzle"
 * @member print
 * @function printCrossword
 * @param {module:crosswordData~CrosswordData} crosswordData object containing all properties of crossword
 */
export function printCrossword(crosswordData) {
    const docDefinition = getDocDefinition(crosswordData)
    // pdfMake.createPdf(docDefinition).download("NY Times - " + crosswordData.id);
    pdfMake.createPdf(docDefinition).print();
}