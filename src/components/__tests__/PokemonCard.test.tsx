import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import { PokemonCard } from '../PokemonCard';
import { FavoritesProvider } from '../../context/FavoritesContext';
import { theme } from '../../theme';

const mockPokemon = {
  id: 1,
  name: 'bulbasaur',
  types: [
    {
      slot: 1,
      type: {
        name: 'grass',
        url: 'https://pokeapi.co/api/v2/type/12/'
      }
    },
    {
      slot: 2,
      type: {
        name: 'poison',
        url: 'https://pokeapi.co/api/v2/type/4/'
      }
    }
  ],
  sprites: {
    front_default: 'sprite.png',
    other: {
      'official-artwork': {
        front_default: 'official.png'
      }
    }
  },
  stats: [],
  abilities: [],
  height: 7,
  weight: 69
};

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      <FavoritesProvider>
        {component}
      </FavoritesProvider>
    </ThemeProvider>
  );
};

describe('PokemonCard', () => {
  const defaultProps = {
    pokemon: mockPokemon,
    onClick: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders pokemon name correctly', () => {
    renderWithProviders(<PokemonCard {...defaultProps} />);
    expect(screen.getByText('bulbasaur')).toBeInTheDocument();
  });

  it('renders official artwork image correctly', () => {
    renderWithProviders(<PokemonCard {...defaultProps} />);
    const image = screen.getByAltText('bulbasaur');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', expect.stringContaining('official-artwork/1.png'));
  });

  it('renders pokemon types', () => {
    renderWithProviders(<PokemonCard {...defaultProps} />);
    expect(screen.getByText('grass')).toBeInTheDocument();
    expect(screen.getByText('poison')).toBeInTheDocument();
  });

  it('calls onClick when card is clicked', () => {
    renderWithProviders(<PokemonCard {...defaultProps} />);
    const card = screen.getByRole('img').closest('.MuiCard-root');
    fireEvent.click(card!);
    expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
  });

  it('toggles favorite status when favorite button is clicked', () => {
    renderWithProviders(<PokemonCard {...defaultProps} />);
    const favoriteButton = screen.getByRole('button');
    
    // Initially should show unfavorited state
    expect(screen.queryByTestId('FavoriteIcon')).not.toBeInTheDocument();
    expect(screen.getByTestId('FavoriteBorderIcon')).toBeInTheDocument();
    
    // Click to favorite
    fireEvent.click(favoriteButton);
    expect(screen.getByTestId('FavoriteIcon')).toBeInTheDocument();
    expect(screen.queryByTestId('FavoriteBorderIcon')).not.toBeInTheDocument();
    
    // Click to unfavorite
    fireEvent.click(favoriteButton);
    expect(screen.queryByTestId('FavoriteIcon')).not.toBeInTheDocument();
    expect(screen.getByTestId('FavoriteBorderIcon')).toBeInTheDocument();
  });

  it('renders in list view mode correctly', () => {
    renderWithProviders(<PokemonCard {...defaultProps} viewMode="list" />);
    const card = screen.getByRole('img').closest('.MuiCard-root');
    expect(card).toHaveStyle({ display: 'flex', height: '100px' });
  });

  it('renders in grid view mode correctly', () => {
    renderWithProviders(<PokemonCard {...defaultProps} viewMode="grid" />);
    const card = screen.getByRole('img').closest('.MuiCard-root');
    expect(card).toHaveStyle({ display: 'block', height: 'auto' });
  });

  it('stops event propagation when clicking favorite button', () => {
    renderWithProviders(<PokemonCard {...defaultProps} />);
    const favoriteButton = screen.getByRole('button');
    
    fireEvent.click(favoriteButton);
    expect(defaultProps.onClick).not.toHaveBeenCalled();
  });

  it('handles basic pokemon data without types', () => {
    const basicPokemon = {
      name: 'bulbasaur',
      url: 'https://pokeapi.co/api/v2/pokemon/1/'
    };
    
    renderWithProviders(<PokemonCard {...defaultProps} pokemon={basicPokemon} />);
    expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    const image = screen.getByAltText('bulbasaur');
    expect(image).toHaveAttribute('src', expect.stringContaining('official-artwork/1.png'));
  });
});