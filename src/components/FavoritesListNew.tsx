import { useState } from 'react';
import {
  Box,
  Checkbox,
  Button,
  Typography,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import { useFavorites } from '../context/FavoritesContext';
import { ScrollableGrid } from './ScrollableGrid';
import type { Pokemon } from '../types/pokemon';
import type { ViewMode } from './ViewToggle';

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
      <Box sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3
      }}>
        <Alert severity="info" sx={{ maxWidth: '600px' }}>
          You haven't favorited any Pokémon yet. Click the heart icon on a Pokémon card to add it to your favorites!
        </Alert>
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      <Box 
        sx={{ 
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
          zIndex: 1
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
        {selectedPokemons.length > 0 && (
          <Button
            variant="contained"
            color="error"
            startIcon={<Delete />}
            onClick={handleDeleteSelected}
            size="small"
          >
            Remove Selected
          </Button>
        )}
      </Box>

      <ScrollableGrid
        pokemons={favoritedPokemons}
        viewMode={viewMode}
        onPokemonClick={onPokemonClick}
        onLoadMore={() => {}} // No-op since we don't need infinite scroll
        hasMore={false}
        isLoading={false}
        isFetchingMore={false}
      />

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