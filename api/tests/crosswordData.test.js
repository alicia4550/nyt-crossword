import { expect, test } from 'vitest'
import { getUrl, getDataString, getCrosswordData } from "../crosswordData"

test("get URL for today's daily crossword", () => {
    const date = new Date()
    const url = getUrl()
    expect(url.endsWith(date.getFullYear().toString().slice(2) + (date.getMonth()+1).toString().padStart(2, "0") + date.getDate().toString().padStart(2, "0"))).toBeTruthy()
    expect(url.startsWith("/nytsyn-crossword-mh/nytsyncrossword?date=")).toBeTruthy()
})

test("get data string for daily crossword", () => {
    const url = "https://nytsyn.pzzl.com/nytsyn-crossword-mh/nytsyncrossword?date=240102"
    const expectedString = 
        `ARCHIVE

        231128
        
        NY Times, Tue, Jan 2, 2024
        
        Gia Bosko / Will Shortz
        
        15
        
        15
        
        33
        
        40
        
        GETRICH#TOOKOFF
        AIRHOLE#ANDORRA
        GRAYDAY#REDHEAD
        SEPSIS###COLONS
        ####NSA#SAN####
        ##GREENSCREEN##
        APED#SYNOD#VEGA
        FREAK#HAT#REALM
        TIS#ADOPTME#TOP
        #MELLOW#YELLOW#
        ###LIT###MIA###
        PICANTE#POSTITS
        ORANGEDOORHINGE
        NATO#DEERE#STIR
        ENOS#INDEX#HOFF
        
        Make millions, say
        Departed on a flight
        Opening in a pet carrier
        Tiny country in the Pyrenees
        Colorful rhyme for gloomy weather
        Colorful rhyme for a "ginger"
        Harmful reaction to an infection
        : : : : : :
        Surveillance org.
        ___ Jos�, Costa Rica
        Colorful rhyme for a filming background
        Copied
        Church council
        Lyra's brightest star
        Go bananas
        What a street musician may use to collect tips
        Domain
        "___ the season ..."
        Sign seen at an S.P.C.A. center, perhaps
        Outdo
        With 46-Across, colorful rhyme for a 1966 Donovan hit
        See 44-Across
        Hoppin', as a party
        Soccer star Hamm
        Hot and spicy, as salsa
        Sticky notes
        Colorful (albeit rare!) rhyme for an item at a hardware store
        Finland joined it in 2023
        Big name in tractors
        Ruckus
        Grandson of Adam
        Pages that point to other pages
        Benjamin who wrote "The Tao of Pooh"
        
        Reacts to an awful smell, maybe
        Dublin's land, to Dubliners
        "Piehole"
        Matthew ___ of "The Americans"
        I, on the periodic table
        College catalog assortment
        "Watch it!"
        Road goo
        What an Uno player has in hand upon crying "Uno!"
        Quirky person
        Helmut ___, 1980s-'90s German chancellor
        Cookie often dipped in milk
        ___ Drescher, leader of the 2023 SAG-AFTRA strike
        Passing crazes
        "Be that as it may ..."
        "Beam me up, ___!" ("Star Trek" misquotation)
        Birds in a gaggle
        Multivitamin stat, for short
        Cakewalk
        Night before
        "Swell!"
        Back, to a boatswain
        Overly proper
        What fireflies and happy faces do
        Bit of band equipment
        Mindy of "The Mindy Project"
        Hot dog topping
        Partner of a crossed "t"
        Big name in cassette tapes, once
        South American grasslands
        Not quite on time
        Corn cake
        Tehran's land
        Roman senator who insisted "Carthage must be destroyed"
        Heaven on earth
        Look carefully (over)
        Hooked on
        What you might say as you crack open a beer
        Medieval worker
        Massive ref.
        
        `

        getDataString(url).then(dataString => {
            expect(dataString).toBe(expectedString)
        })
})

test("format crossword data", () => {
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

        const crosswordData = getCrosswordData(dataString)

        expect(crosswordData.id).toBe("111")
        expect(crosswordData.title).toBe("Test Crossword")
        expect(crosswordData.author).toBe("Alicia Tran")
        expect(crosswordData.board).toStrictEqual(expectedBoard)
        expect(crosswordData.hClues).toStrictEqual(expectedHClues)
        expect(crosswordData.vClues).toStrictEqual(expectedVClues)
})