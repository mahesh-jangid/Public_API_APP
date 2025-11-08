import { Card, CardContent, CardMedia, Typography, IconButton, Box } from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import type { Pokemon } from '../types/pokemon';
import { useFavorites } from '../context/FavoritesContext';

const getPokemonId = (pokemon: Pokemon | BasicPokemon): number => {
  if ('id' in pokemon) {
    return pokemon.id;
  }
  // Extract ID from the URL string
  const urlParts = pokemon.url.split('/');
  return parseInt(urlParts[urlParts.length - 2]);
};

interface BasicPokemon {
  name: string;
  url: string;
}

import type { ViewMode } from './ViewToggle';

interface PokemonCardProps {
  pokemon: Pokemon | BasicPokemon;
  onClick: () => void;
  viewMode?: ViewMode;
}

export const PokemonCard = ({ pokemon, onClick, viewMode = 'grid' }: PokemonCardProps) => {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const favorite = isFavorite(pokemon.name);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (favorite) {
      removeFavorite(pokemon.name);
    } else {
      addFavorite(pokemon.name);
    }
  };

  const isListView = viewMode === 'list';

  return (
    <Card
      sx={{
        borderRadius:1,
        cursor: 'pointer',
        '&:hover': {
          transform: 'scale(1.02)',
          transition: 'transform 0.2s ease-in-out',
        },
        display: isListView ? 'flex' : 'block',
        height: isListView ? '100px' : 'auto',
      }}
      onClick={onClick}
    >
      <CardMedia
        component="img"
        height={isListView ? '100' : '140'}
        width={isListView ? '100' : 'auto'}
        image={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${getPokemonId(pokemon)}.png`}
        alt={pokemon.name}
        sx={{
          width: isListView ? '100px' : '100%',
          objectFit: 'contain',
          backgroundColor: 'grey.100'
        }}
      />
      <CardContent sx={{ 
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        py: isListView ? 1 : 2 
      }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" component="div" sx={{ textTransform: 'capitalize' }}>
            {pokemon.name}
          </Typography>
          <IconButton onClick={handleFavoriteClick} color="primary" size={isListView ? 'small' : 'medium'}>
            {favorite ? <Favorite /> : <FavoriteBorder />}
          </IconButton>
        </Box>
        <Box display="flex" gap={1} flexWrap="wrap">
          {'types' in pokemon && pokemon.types.map((type) => (
            <Typography
              key={type.type.name}
              variant="caption"
              sx={{
                backgroundColor: 'primary.main',
                color: 'white',
                padding: '2px 8px',
                borderRadius: '4px',
                textTransform: 'capitalize',
              }}
            >
              {type.type.name}
            </Typography>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};