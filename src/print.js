import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

import crosswordData from "./crosswordData";

/**
 * Module to fetch and format crossword data
 * @module print
 * @exports printCrossword
 */

/**
 * @typedef Table
 * @property {number} [headerRows] number of headers rows in the table, defaults to 0
 * @property {Array.<string|number>} widths widths of each column of the table
 * @property {number} [heights] height of each row of the table
 * @property {Array.<Array.<Object.<string, string>>>} body JSON object containing all properties of all cells of the table
 */

pdfMake.vfs = pdfFonts.pdfMake.vfs;
const {id, title, author, board, hClues, vClues} = crosswordData

/**
 * Create crossword grid
 * @member print
 * @function createCrossword
 * @returns {module:print~Table} JSON object of properties of crossword grid to be rendered by pdfmake
 */
function createCrossword() {
    const numRows = board[0].length
    return {
        headerRows: 0,
        widths: Array(numRows).fill(380/numRows),
        heights: 380/numRows,

        body: createGrid()
    }
}

/**
 * Create body of table object used to render crossword grid
 * @member print
 * @function createGrid
 * @returns {Array.<Array.<number|string|Object.<string, string>>>} 2D array of JSON objects representing each square of grid
 */
function createGrid() {
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
function createCluesTable(heading, clueList) {
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
function createClueTableBody(headingText, clueList) {
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

var docDefinition = {
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
        text: [title, {text: " by", italics: true}],
        alignment: "center",
        margin: [0, 25, 0, 0]
    }, {
        text: author,
        alignment: "center",
        italics: true,
        margin: [0, 0, 0, 25]
    }, {
        layout: 'darkHorizontalLines',
        table: createCrossword()
    }, {
        columns: [
            {
                width: 'auto',
                table: createCluesTable("ACROSS", hClues),
                layout: "headerLineOnly"
            }, {
                width: 'auto',
                table: createCluesTable("DOWN", vClues),
                layout: "headerLineOnly"
            }
        ],
        columnGap: 25,
        margin: [0, 25, 0, 0]
    }, ]
};

/**
 * pdfMake method call to download PDF of crossword puzzle, saves as "NY Times - <CROSSWORD_ID>"
 * @member print
 * @function printCrossword
 */
export default function printCrossword() {
    pdfMake.createPdf(docDefinition).download("NY Times - " + id);
}