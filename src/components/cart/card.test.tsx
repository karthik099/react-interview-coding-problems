import { fireEvent, render, screen } from '@testing-library/react'
import Card from './card'
import { describe, it } from 'vitest'

describe('App', () => {

  it('renders the App component', () => {
    render(<Card data/>)
    screen.findByText('/Essence Mascara Lash Princess/i').toBeInTheDocument(); // 
  })

  it('add to button click', () => {
    render(<Card data/>)
    const button = screen.findByRole('button')
    fireEvent.click(button);
  })
})