import { render, screen } from '@testing-library/react';
import Battlefield from './Battlefield';

test('renders learn react link', () => {
  render(<Battlefield />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
