import { useState, useMemo, useEffect, lazy, Suspense } from 'react';
import { 
  ThemeProvider, 
  CssBaseline, 
  Box, 
  Typography, 
  Tabs, 
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip
} from '@mui/material';
import { Sort, ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { ViewToggle, type ViewMode } from './components/ViewToggle';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import type { Pokemon } from './types/pokemon';
import { Loading } from './components/Loading';
import { usePokemonList } from './hooks/usePokemons';
import { useNavigate } from 'react-router-dom';
import { FavoritesProvider, useFavorites } from './context/FavoritesContext';
import { theme } from './theme';

// Eager loaded components (for essential UI)
import { SearchBar } from './components/SearchBar';
import { TypeFilter } from './components/TypeFilter';

// Lazy loaded components (for heavy content)
const FavoritesList = lazy(() => import('./components/FavoritesList').then(module => ({ default: module.FavoritesList })));
const ScrollableGrid = lazy(() => import('./components/ScrollableGrid').then(module => ({ default: module.ScrollableGrid })));

const PokemonDetailsPage = lazy(() => import('./pages/PokemonDetailsPage').then(module => ({ default: module.PokemonDetailsPage })));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
    },
  },
});

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup function to clear the timeout if value changes
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

function PokemonListContent() {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'id' | 'attack'>('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  
  const { 
    pokemons, 
    isLoading, 
    loadMore, 
    hasMore, 
    isFetchingMore, 
    setSearchQuery: setApiSearchQuery,
    selectedType,
    setSelectedType
  } = usePokemonList();
  const { favorites } = useFavorites();

  useEffect(() => {
    setApiSearchQuery(debouncedSearchQuery);
  }, [debouncedSearchQuery, setApiSearchQuery]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const sortedPokemons = useMemo(() => {
    const getStat = (pokemon: Pokemon, statName: string) => 
      pokemon.stats.find(stat => stat.stat.name === statName)?.base_stat ?? 0;
      
    return [...pokemons].sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'id':
          comparison = a.id - b.id;
          break;
        case 'attack':
          const aTotal = getStat(a, 'attack') + getStat(a, 'special-attack');
          const bTotal = getStat(b, 'attack') + getStat(b, 'special-attack');
          comparison = aTotal - bTotal;
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [pokemons, sortBy, sortDirection]);

  return (
    <Box
      sx={{
        width: '100%'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: { xs: 2, md: 3 },
          mb: 3,
          backgroundColor: 'white',
          p: { xs: 1.5, sm: 2 },
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box',
          borderRadius: { xs: 0, sm: 1 },
          boxShadow: { xs: 'none', sm: '0 1px 3px rgba(0,0,0,0.1)' }
        }}
      >
        <Box sx={{ flex: { xs: '1', md: '1 1 50%' } }}>
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </Box>
        <Box 
          sx={{ 
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 2, sm: 2, md: 3 },
            alignItems: { xs: 'stretch', sm: 'center' },
            flex: { md: '0 1 auto' }
          }}
        >
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              width: { xs: '100%', sm: 'auto' },
              minWidth: { sm: '200px' }
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                display: { xs: 'none', md: 'block' },
                whiteSpace: 'nowrap',
                minWidth: 'fit-content'
              }}
            >
              Sort:
            </Typography>
            <FormControl 
              size="small" 
              sx={{ 
                width: '100%'
              }}
            >
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              >
                <MenuItem value="id">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Sort sx={{ color: 'text.secondary' }} />
                    Pokédex Number
                  </Box>
                </MenuItem>
                <MenuItem value="name">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Sort sx={{ color: 'text.secondary' }} />
                    Pokémon Name
                  </Box>
                </MenuItem>
                <MenuItem value="attack">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Sort sx={{ color: 'text.secondary' }} />
                    Total Attack Stats
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>
            <Tooltip title={`Sort ${sortDirection === 'asc' ? 'Ascending' : 'Descending'}`}>
              <IconButton 
                size="small"
                onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
                sx={{ 
                  border: 1, 
                  borderColor: 'grey.300',
                  bgcolor: 'background.paper'
                }}
              >
                {sortDirection === 'asc' ? <ArrowUpward /> : <ArrowDownward />}
              </IconButton>
            </Tooltip>
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '200px' } }}>
            <TypeFilter selectedType={selectedType} onTypeChange={setSelectedType} />
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: { xs: 2, sm: 0 },
          mb: 3,
          backgroundColor: 'white',
          p: { xs: 1.5, sm: 2 },
          width: '100%',
          boxSizing: 'border-box',
          borderRadius: { xs: 0, sm: 1 },
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}
      >
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          sx={{
            minHeight: 48,
            '& .MuiTabs-indicator': {
              backgroundColor: 'primary.main',
              height: 3,
              transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
            },
            '& .MuiTab-root': {
              minHeight: 48,
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '1rem',
              px: 3,
              transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
              border: '1px solid transparent',
              '&.Mui-selected': {
                color: 'primary.main',
              },
              '&:hover': {
                backgroundColor: 'action.hover',
              },
              '&:focus': {
                outline: 'none',
              },
            },
          }}
        >
          <Tab 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography>All Pokémon</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  ({pokemons.length})
                </Typography>
              </Box>
            } 
          />
          <Tab 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography>Favorites</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  ({favorites.length})
                </Typography>
              </Box>
            } 
          />
        </Tabs>
        <ViewToggle 
          view={viewMode} 
          onViewChange={setViewMode} 
        />
      </Box>

      <Box
        sx={{
          height: { xs: 'calc(100vh - 180px)', sm: 'calc(100vh - 200px)' },
          backgroundColor: 'white',
          width: '100%',
          boxSizing: 'border-box',
          m: 0,
          overflow: 'hidden',
          borderRadius: { xs: 0, sm: 1 },
          boxShadow: { xs: 'none', sm: '0 1px 3px rgba(0,0,0,0.1)' }
        }}
      >
        {tabValue === 0 ? (
          <Suspense fallback={<Loading />}>
            <ScrollableGrid
              pokemons={sortedPokemons}
              viewMode={viewMode}
              onPokemonClick={(id) => navigate(`/pokemon/${id}`)}
              onLoadMore={loadMore}
              hasMore={hasMore && sortBy === 'id' && tabValue === 0 && !debouncedSearchQuery && !selectedType}
              isLoading={isLoading}
              isFetchingMore={isFetchingMore}
            />
          </Suspense>
        ) : (
          <Suspense fallback={<Loading />}>
            <FavoritesList
              pokemons={sortedPokemons}
              onPokemonClick={(id) => navigate(`/pokemon/${id}`)}
              viewMode={viewMode}
            />
          </Suspense>
        )}
      </Box>
    </Box>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <style>
          {`
            body {
              margin: 0;
              padding: 0;
              width: 100vw;
              overflow-x: hidden;
            }
            #root {
              width: 100vw;
              margin: 0;
              padding: 0;
            }
          `}
        </style>
        <FavoritesProvider>
          <BrowserRouter>
            <Box
              sx={{
                minHeight: '100vh',
                minWidth: '100vw',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: 'grey.50',
                margin: 0,
                padding: 0
              }}
            >
              <Box
                component="header"
                sx={{
                  bgcolor: 'white',
                  borderBottom: 1,
                  borderColor: 'grey.200',
                  position: 'sticky',
                  top: 0,
                  zIndex: 1100,
                  py: { xs: 1.5, sm: 2 },
                  width: '100%',
                  boxSizing: 'border-box',
                  m: 0,
                  boxShadow: { xs: '0 1px 2px rgba(0,0,0,0.05)', sm: 'none' }
                }}
              >
                <Box 
                  sx={{ 
                    px: { xs: 1.5, sm: 2, md: 3 },
                    maxWidth: { sm: '600px', md: '900px', lg: '1200px' },
                    mx: 'auto',
                    width: '100%'
                  }}
                >
                  <Typography 
                    variant="h4" 
                    component="h1" 
                    fontWeight="bold"
                    sx={{
                      fontSize: { xs: '1.5rem', sm: '2rem', md: '2.25rem' }
                    }}
                  >
                    Pokédex
                  </Typography>
                </Box>
              </Box>
              <Box
                component="main"
                sx={{
                  flex: 1,
                  py: { xs: 1.5, sm: 2, md: 3 },
                  px: { xs: 1, sm: 2, md: 3 },
                  maxWidth: { sm: '600px', md: '900px', lg: '1200px' },
                  mx: 'auto',
                  width: '100%',
                  boxSizing: 'border-box'
                }}
              >
                <Suspense fallback={<Loading />}>
                  <Routes>
                    <Route path="/" element={<PokemonListContent />} />
                    <Route path="/pokemon/:id" element={<PokemonDetailsPage />} />
                  </Routes>
                </Suspense>
              </Box>
            </Box>
          </BrowserRouter>
        </FavoritesProvider>
      </ThemeProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}