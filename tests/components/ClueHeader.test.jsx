import { expect, test } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ClueHeader from '../../src/components/ClueHeader'

test("renders correctly (horizontal clue)", () => {
    const clue = {
        clueNum: 1,
        clueText: "Clue Text",
        firstSquare: {
            row: 0,
            col: 0
        }
    }

    render(<ClueHeader isHorizontal={true} clue={clue} />)

    expect(screen.getByText("1 ACROSS • Clue Text")).toBeInTheDocument()
})

test("renders correctly (vertical clue)", () => {
    const clue = {
        clueNum: 1,
        clueText: "Clue Text",
        firstSquare: {
            row: 0,
            col: 0
        }
    }

    render(<ClueHeader isHorizontal={false} clue={clue} />)

    expect(screen.getByText("1 DOWN • Clue Text")).toBeInTheDocument()
})