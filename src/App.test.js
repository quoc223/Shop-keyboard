import { render, screen } from '@testing-library/react';
const App = (await import('./App.js')).default;

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
