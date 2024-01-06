import { expect, test } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import WinModal from '../../src/components/WinModal'

test('render correctly (time is less than an hour)', () => {
    let time = {
        hours: 0,
        mins: 1,
        secs: 23
    }

    render(<WinModal time={time} />)

    expect(screen.getByText("Congratulations!")).toBeInTheDocument()
    expect(screen.getByText(/Your time/)).toBeInTheDocument()
    expect(screen.getByText(/01:23/)).toBeInTheDocument()

    expect(screen.getByRole("button")).toBeInTheDocument()
})

test('render correctly (time is over an hour)', () => {
    let time = {
        hours: 1,
        mins: 1,
        secs: 23
    }

    render(<WinModal time={time} />)

    expect(screen.getByText("Congratulations!")).toBeInTheDocument()
    expect(screen.getByText(/Your time/)).toBeInTheDocument()
    expect(screen.getByText(/1:01:23/)).toBeInTheDocument()

    expect(screen.getByRole("button")).toBeInTheDocument()
})

test('close modal', () => {
    let time = {
        hours: 0,
        mins: 1,
        secs: 23
    }

    render(<WinModal time={time} />)
    fireEvent.click(screen.getByRole("button"))

    const winModal = document.querySelector(".win-modal")
    expect(winModal).toHaveStyle("display: none")
})