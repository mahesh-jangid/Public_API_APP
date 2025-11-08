import { FormControl, InputLabel, Select, MenuItem, Box, Chip } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';

// All possible Pokémon types
const POKEMON_TYPES = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison',
  'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark',
  'steel', 'fairy'
] as const;

export type PokemonType = typeof POKEMON_TYPES[number];

interface TypeFilterProps {
  selectedType: PokemonType | '';
  onTypeChange: (type: PokemonType | '') => void;
}

export const TypeFilter = ({ selectedType, onTypeChange }: TypeFilterProps) => {
  const handleChange = (event: SelectChangeEvent<string>) => {
    onTypeChange(event.target.value as PokemonType | '');
  };

  return (
    <FormControl fullWidth size="small">
      <InputLabel id="type-filter-label">Filter by Type</InputLabel>
      <Select
        labelId="type-filter-label"
        value={selectedType}
        label="Filter by Type"
        onChange={handleChange}
      >
        <MenuItem value="">
          <em>All Types</em>
        </MenuItem>
        {POKEMON_TYPES.map((type) => (
          <MenuItem key={type} value={type}>
            <Box display="flex" alignItems="center">
              <Chip
                label={type}
                size="small"
                sx={{
                  backgroundColor: 'primary.main',
                  color: 'white',
                  textTransform: 'capitalize',
                  mr: 1
                }}
              />
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};