import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  Box,
  LinearProgress,
  CircularProgress,
} from '@mui/material';
import { Close as CloseIcon, Favorite, FavoriteBorder } from '@mui/icons-material';
import type { Pokemon } from '../types/pokemon';
import { useFavorites } from '../context/FavoritesContext';

interface PokemonDetailProps {
  pokemon?: Pokemon;
  open: boolean;
  onClose: () => void;
  isLoading?: boolean;
}

export const PokemonDetail = ({ pokemon, open, onClose, isLoading }: PokemonDetailProps) => {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const favorite = pokemon ? isFavorite(pokemon.name) : false;

  const handleFavoriteClick = () => {
    if (!pokemon) return;
    
    if (favorite) {
      removeFavorite(pokemon.name);
    } else {
      addFavorite(pokemon.name);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" sx={{ textTransform: 'capitalize' }}>
            {pokemon?.name || 'Loading...'}
          </Typography>
          <Box>
            <IconButton 
              onClick={handleFavoriteClick} 
              color="primary" 
              disabled={!pokemon}
            >
              {favorite ? <Favorite /> : <FavoriteBorder />}
            </IconButton>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent>
        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
            <CircularProgress />
          </Box>
        ) : pokemon ? (
          <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }} gap={3}>
            <Box>
              <img
                src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
                alt={pokemon.name}
                style={{ width: '100%', height: 'auto' }}
              />
            </Box>
            <Box>
              <Box>
                <Typography variant="h6">Stats</Typography>
                {pokemon.stats.map((stat) => (
                  <Box key={stat.stat.name} mb={1}>
                    <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                      {stat.stat.name}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Box flexGrow={1}>
                        <LinearProgress
                          variant="determinate"
                          value={(stat.base_stat / 255) * 100}
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                      </Box>
                      <Typography variant="body2" sx={{ minWidth: 35 }}>
                        {stat.base_stat}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
              <Box mt={2}>
                <Typography variant="h6">Abilities</Typography>
                <Box display="flex" gap={1} flexWrap="wrap">
                  {pokemon.abilities.map((ability) => (
                    <Typography
                      key={ability.ability.name}
                      variant="body2"
                      sx={{
                        backgroundColor: 'primary.main',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        textTransform: 'capitalize',
                      }}
                    >
                      {ability.ability.name}
                    </Typography>
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};