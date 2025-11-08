import { Box, Typography, Paper } from '@mui/material';
import type { Pokemon } from '../types/pokemon';

interface FavoriteStatsProps {
  pokemons: Pokemon[];
}

export const FavoriteStats = ({ pokemons }: FavoriteStatsProps) => {
  const typeCount = pokemons.reduce((acc, pokemon) => {
    pokemon.types.forEach(({ type }) => {
      acc[type.name] = (acc[type.name] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const avgAttack = Math.round(
    pokemons.reduce((sum, pokemon) => {
      const attack = pokemon.stats.find(stat => stat.stat.name === 'attack')?.base_stat || 0;
      return sum + attack;
    }, 0) / pokemons.length
  );

  const mostCommonTypes = Object.entries(typeCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        mb: 2,
        backgroundColor: 'background.default',
        borderRadius: 2
      }}
    >
      <Typography variant="h6" gutterBottom>
        Collection Stats
      </Typography>
      <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="body2" color="text.secondary">
            Total Favorites
          </Typography>
          <Typography variant="h4">
            {pokemons.length}
          </Typography>
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary">
            Avg. Attack Power
          </Typography>
          <Typography variant="h4">
            {avgAttack}
          </Typography>
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary">
            Most Common Types
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 0.5 }}>
            {mostCommonTypes.map(([type, count]) => (
              <Typography
                key={type}
                variant="body2"
                sx={{
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  backgroundColor: 'background.paper',
                  border: 1,
                  borderColor: 'divider'
                }}
              >
                {type} ({count})
              </Typography>
            ))}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};