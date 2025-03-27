import { render, screen } from '@testing-library/react';

describe('Sample Test', () => {
  it('should pass', () => {
    expect(true).toBe(true);
  });

  it('should render a component correctly', () => {
    render(<div>Hello Test</div>);
    expect(screen.getByText('Hello Test')).toBeInTheDocument();
  });
});