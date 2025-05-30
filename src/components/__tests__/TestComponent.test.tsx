import { render, screen } from '@testing-library/react'
import TestComponent from '../TestComponent'

describe('TestComponent', () => {
  it('renders store diagnosis information', () => {
    render(<TestComponent />)
    
    // Check main heading
    expect(screen.getByText('Store Diagnosis')).toBeInTheDocument()
    
    // Check subheadings for each diagnosis section
    expect(screen.getByText('Direct Store Access:')).toBeInTheDocument()
    expect(screen.getByText('useNavigation Hook:')).toBeInTheDocument()
    expect(screen.getByText('useHousehold Hook:')).toBeInTheDocument()
    expect(screen.getByText('useAppNavigation Hook:')).toBeInTheDocument()

    // Optionally, you could add more specific checks for the content within the <pre> tags
    // For example, checking if the JSON stringification includes certain keys.
    // This can be more brittle if the stringified output changes frequently.
    // For now, checking headings is a good start.
  })
}) 