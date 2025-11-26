import React from 'react';
import { render, screen } from '@testing-library/react-native';
import PlaceholderScreen from '../PlaceholderScreen';

describe('PlaceholderScreen', () => {
  it('renders the title correctly', () => {
    render(<PlaceholderScreen title="Test Screen" />);
    
    expect(screen.getByText('Test Screen')).toBeTruthy();
  });

  it('renders the development message', () => {
    render(<PlaceholderScreen title="Test Screen" />);
    
    expect(
      screen.getByText('This screen is under development.')
    ).toBeTruthy();
  });

  it('renders with custom subtitle', () => {
    render(
      <PlaceholderScreen
        title="Test Screen"
        subtitle="Custom subtitle text"
      />
    );
    
    expect(screen.getByText('Custom subtitle text')).toBeTruthy();
  });
});
