let dataString = `ARCHIVE

231127

NY Times, Mon, Jan 1, 2024

Ricky J. Sirois / Will Shortz

15

15

35

41

ZODIAC#COBS#MAG
AGENDA#ANYA#EWE
CRATER#BEERBRAT
HERO#EMIL#TACIT
####BEANBURRITO
NISSANS##REF###
ABHOR#HEAD#IOWA
BEEFBOURGUIGNON
STAT#LPGA#CHURN
###WIG##TSETSES
BANANABREAD####
AHORA#EAST#GASP
TOBEFAIR#UNIQUE
HOE#EDGE#REFUEL
STL#WOES#NOTATE

Astrology chart
Inner parts of ears of corn
Newsstand item, informally
List of items to discuss at a meeting
Actress Taylor-Joy of "The Queen's Gambit"
Female sheep
Any facial feature of the man in the moon, in reality
Ale-simmered German sausage, informally
Villain's opposite
Actor Jannings of silent films
Unstated but understood
Vegetarian dish on a Mexican menu
Altimas and Pathfinders
One who keeps order on the court?
Hate
Noggin
Des Moines's home
French meat stew for which Julia Child penned a popular recipe
"Now!," in a hospital
Women's links grp.
Turn from cream to butter
Hairpiece
Fearsome African flies
Loaf often made with walnuts
Now, in Spanish
Toward the rising sun
Fight for breath
"Admittedly ...," or, when said aloud, a punny description of 18-, 24-, 39- and 49-Across
One-of-a-kind
Long-handled garden tool
Rim
Fill up the gas tank again
The Blues, on scoreboards
Afflictions
Put music to paper

Actor Braff of "Scrubs"
Fairy tale monster
First word of many a letter
Excited about
Suffix with lemon or lime
Veer, as a wildly driven car
Woodsy home
Equivalent of 16 oz.
"See ya!"
"No Exit" playwright
Thanks, in Tours
Be in store for
Start annoying
Pub brawl
Song created from multiple songs
Sharp part of a wire fence
Pakistani language
Catches, as a criminal
"Yeah, o-o-o-kay ..."
___ butter (ingredient in many cosmetics)
Computer programs
Energy unit
Colorful banded rocks
Weight to carry
Had on
Raggedy ___ (classic dolls)
___ Korbut, four-time Olympic gold-medal gymnast
Treated, as a sprain
"Soon"
Ringed planet
Alternatives to showers
Something hilarious
Prize declined by 10-Down
Neutral shade
Some hard-to-find collectibles
Present
Color lead-in to marine
Tallow source
One-named Brazilian soccer icon
Commotion
Keanu Reeves's role in "The Matrix"

`

const splitString = dataString.split("\n")

const id = splitString[2]
const title = splitString[4]
const author = splitString[6]

const rows = parseInt(splitString[8])
const cols = parseInt(splitString[10])

const numHClues = parseInt(splitString[12])
const numVClues = parseInt(splitString[14])

let board = []
let vClues = []
let hClues = []

for (let i = 0; i < rows; i++) {
    board.push(splitString[16+i].split(''))
}

for (let i = 0; i < numHClues; i++) {
    hClues.push(splitString[17+rows+i])
}

for (let i = 0; i < numVClues; i++) {
    vClues.push(splitString[18+rows+numHClues+i])
}

let clueNum = 0
let hClueCount = -1
let vClueCount = -1
let boardData = []

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
        }
        else if (isVStart) {
            clueNum++
            vClueCount++
        }
        else if (isHStart) {
            clueNum++
            hClueCount++
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
    numRows: rows,
    numCols: cols,
    numHClues: numHClues,
    numVClues: numVClues,
    board: boardData,
    hClues: hClues,
    vClues: vClues
}