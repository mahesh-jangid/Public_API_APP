import {
  Box,
  Checkbox,
  Button,
  Typography,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import { useFavorites } from '../context/FavoritesContext';
import { PokemonCard } from './PokemonCard';
import type { Pokemon } from '../types/pokemon';
import type { ViewMode } from './ViewToggle';
import { useState } from 'react';

interface FavoritesListProps {
  pokemons: Pokemon[];
  onPokemonClick: (name: string) => void;
  viewMode: ViewMode;
}

export const FavoritesList = ({ pokemons, onPokemonClick, viewMode }: FavoritesListProps) => {
  const { favorites, removeFavorite } = useFavorites();
  const [selectedPokemons, setSelectedPokemons] = useState<string[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const favoritedPokemons = pokemons.filter(pokemon => favorites.includes(pokemon.name));

  const handleSelectPokemon = (pokemonName: string) => {
    setSelectedPokemons(prev =>
      prev.includes(pokemonName)
        ? prev.filter(name => name !== pokemonName)
        : [...prev, pokemonName]
    );
  };

  const handleSelectAll = () => {
    setSelectedPokemons(
      selectedPokemons.length === favoritedPokemons.length
        ? []
        : favoritedPokemons.map(p => p.name)
    );
  };

  const handleDeleteSelected = () => {
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    selectedPokemons.forEach(name => removeFavorite(name));
    setSelectedPokemons([]);
    setIsDeleteDialogOpen(false);
  };

  if (favoritedPokemons.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Alert severity="info">
          You haven't favorited any Pokémon yet. Click the heart icon on a Pokémon card to add it to your favorites!
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      <Box sx={{ 
        p: 2,
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 2,
        backgroundColor: 'background.paper',
        borderRadius: 1,
        boxShadow: 1,
        position: 'sticky',
        top: 0,
        zIndex: 1,
        mb: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2,
              flex: 1 
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Checkbox
                checked={selectedPokemons.length === favoritedPokemons.length}
                indeterminate={selectedPokemons.length > 0 && selectedPokemons.length < favoritedPokemons.length}
                onChange={handleSelectAll}
              />
              <Typography>
                {selectedPokemons.length === 0
                  ? `${favoritedPokemons.length} Favorite${favoritedPokemons.length === 1 ? '' : 's'}`
                  : `${selectedPokemons.length} Selected`}
              </Typography>
            </Box>
          </Box>
        </Box>
        {selectedPokemons.length > 0 && (
          <Button
            variant="contained"
            color="error"
            startIcon={<Delete />}
            onClick={handleDeleteSelected}
          >
            Remove Selected
          </Button>
        )}
      </Box>

      <Box sx={{ flex: 1, overflow: 'auto', px: 2 }}>
        <Box sx={{ 
          display: 'grid', 
          gap: 2, 
          gridTemplateColumns: viewMode === 'grid' ? {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(4, 1fr)',
            xl: 'repeat(6, 1fr)'
          } : '1fr'
        }}>
          {favoritedPokemons.map(pokemon => (
            <Box key={pokemon.name} sx={{ position: 'relative' }}>
              <Checkbox
                checked={selectedPokemons.includes(pokemon.name)}
                onChange={(e) => {
                  e.stopPropagation();
                  handleSelectPokemon(pokemon.name);
                }}
                sx={{
                  position: 'absolute',
                  top: 8,
                  left: 8,
                  zIndex: 1,
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '50%',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 1)',
                  }
                }}
              />
              <PokemonCard
                pokemon={pokemon}
                onClick={() => onPokemonClick(pokemon.name)}
                viewMode={viewMode}
              />
            </Box>
          ))}
        </Box>
      </Box>

      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
      >
        <DialogTitle>Remove from Favorites?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to remove {selectedPokemons.length} Pokémon from your favorites?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};