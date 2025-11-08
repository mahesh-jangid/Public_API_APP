import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material';
import { SearchBar } from '../SearchBar';

const theme = createTheme();

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

describe('SearchBar', () => {
  const defaultProps = {
    value: '',
    onChange: jest.fn(),
  };

  it('renders with default placeholder', () => {
    renderWithTheme(<SearchBar {...defaultProps} />);
    expect(screen.getByPlaceholderText('Search pokémon...')).toBeInTheDocument();
  });

  it('renders with custom placeholder', () => {
    const customPlaceholder = 'Custom placeholder';
    renderWithTheme(<SearchBar {...defaultProps} placeholder={customPlaceholder} />);
    expect(screen.getByPlaceholderText(customPlaceholder)).toBeInTheDocument();
  });

  it('displays the provided value', () => {
    const value = 'pikachu';
    renderWithTheme(<SearchBar {...defaultProps} value={value} />);
    expect(screen.getByDisplayValue(value)).toBeInTheDocument();
  });

  it('calls onChange when user types', () => {
    const onChange = jest.fn();
    renderWithTheme(<SearchBar {...defaultProps} onChange={onChange} />);
    
    const input = screen.getByPlaceholderText('Search pokémon...');
    const testValue = 'charizard';
    
    fireEvent.change(input, { target: { value: testValue } });
    expect(onChange).toHaveBeenCalledWith(testValue);
  });

  it('renders with Material-UI TextField', () => {
    renderWithTheme(<SearchBar {...defaultProps} />);
    const textField = screen.getByRole('textbox');
    expect(textField).toBeInTheDocument();
  });

  it('applies correct styling', () => {
    renderWithTheme(<SearchBar {...defaultProps} />);
    const textField = screen.getByRole('textbox');
    const parent = textField.closest('.MuiTextField-root');
    expect(parent).toHaveStyle({ width: '100%' });
  });

  it('has search icon in the start adornment', () => {
    renderWithTheme(<SearchBar {...defaultProps} />);
    const searchIcon = document.querySelector('svg');
    expect(searchIcon).toBeInTheDocument();
  });
});