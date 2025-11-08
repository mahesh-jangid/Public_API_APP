import { useParams, useNavigate, Link } from 'react-router-dom';
import { Box, IconButton, Typography, Paper, Container, Breadcrumbs } from '@mui/material';
import { ArrowBack, NavigateNext } from '@mui/icons-material';
import { usePokemonDetails } from '../hooks/usePokemons';
import { Loading } from '../components/Loading';

export function PokemonDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: pokemon, isLoading } = usePokemonDetails(id || '');

  if (isLoading) return <Loading />;
  if (!pokemon) return <Typography>Pokemon not found</Typography>;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs separator={<NavigateNext fontSize="small" />}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Typography color="text.secondary">Pokédex</Typography>
          </Link>
          <Typography color="text.primary">{pokemon.name}</Typography>
        </Breadcrumbs>
      </Box>

      <Paper 
        elevation={0}
        sx={{ 
          p: 4,
          borderRadius: 2,
          bgcolor: 'background.paper',
          position: 'relative'
        }}
      >
        <IconButton 
          onClick={() => navigate(-1)}
          sx={{ 
            position: 'absolute',
            top: 16,
            left: 16,
            bgcolor: 'background.paper',
            '&:hover': { bgcolor: 'action.hover' }
          }}
        >
          <ArrowBack />
        </IconButton>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
          <Box sx={{ flex: '0 0 auto', width: { xs: '100%', md: 400 } }}>
            <Box
              component="img"
              src={pokemon.sprites.other?.['official-artwork'].front_default || pokemon.sprites.front_default}
              alt={pokemon.name}
              sx={{
                width: '100%',
                height: 'auto',
                objectFit: 'contain',
                borderRadius: 2,
                bgcolor: 'grey.50'
              }}
            />
          </Box>

          <Box sx={{ flex: 1 }}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" component="h1" gutterBottom sx={{ textTransform: 'capitalize', fontWeight: 'bold' }}>
                {pokemon.name}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                #{pokemon.id.toString().padStart(3, '0')}
              </Typography>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>Stats</Typography>
              {pokemon.stats.map((stat) => (
                <Box key={stat.stat.name} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                      {stat.stat.name.replace('-', ' ')}
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {stat.base_stat}
                    </Typography>
                  </Box>
                  <Box sx={{ width: '100%', bgcolor: 'grey.100', borderRadius: 1, height: 8 }}>
                    <Box
                      sx={{
                        width: `${(stat.base_stat / 255) * 100}%`,
                        bgcolor: 'primary.main',
                        height: '100%',
                        borderRadius: 1,
                        transition: 'width 1s ease-out'
                      }}
                    />
                  </Box>
                </Box>
              ))}
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>Types</Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {pokemon.types.map((type) => (
                  <Box
                    key={type.type.name}
                    sx={{
                      px: 2,
                      py: 0.5,
                      borderRadius: 2,
                      bgcolor: 'primary.main',
                      color: 'white'
                    }}
                  >
                    <Typography sx={{ textTransform: 'capitalize' }}>
                      {type.type.name}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom>Abilities</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {pokemon.abilities.map((ability) => (
                  <Box
                    key={ability.ability.name}
                    sx={{
                      px: 2,
                      py: 0.5,
                      borderRadius: 2,
                      bgcolor: 'grey.100'
                    }}
                  >
                    <Typography sx={{ textTransform: 'capitalize' }}>
                      {ability.ability.name.replace('-', ' ')}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}