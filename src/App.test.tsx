import { render, screen } from '@testing-library/react'
import App from './App'
import { beforeEach, describe, it } from 'vitest'

describe('App', () => {

  beforeEach(()=>{
    global.fetch = jest.fn();
  }
)

  it('renders the App component', () => {
    render(<App />)
    screen.debug(); // prints out the jsx in the App component unto the command line
  })
  

  
})