import { 
  Box, 
  CircularProgress, 
  Typography, 
  Alert
} from '@mui/material';
import { useCallback, useRef, useEffect, useState, type FC } from 'react';
import { PokemonCard } from './PokemonCard';
import { PokemonSkeleton } from './PokemonSkeleton';
import type { ViewMode } from './ViewToggle';
import type { Pokemon } from '../types/pokemon';

interface ScrollableGridProps {
  pokemons: Pokemon[]; 
  viewMode: ViewMode;
  onPokemonClick: (name: string) => void;
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
  isFetchingMore: boolean;
}

const LoadingIndicator: FC = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      py: 3,
      width: '100%'
    }}
  >
    <CircularProgress size={30} />
  </Box>
);

export const ScrollableGrid: FC<ScrollableGridProps> = ({
  pokemons,
  viewMode,
  onPokemonClick,
  onLoadMore,
  hasMore,
  isLoading,
  isFetchingMore
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreTriggerRef = useRef<HTMLDivElement>(null);
  const [scrollShadow, setScrollShadow] = useState(false);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    setScrollShadow(target.scrollTop > 0);
  }, []);

  useEffect(() => {
    let isSubscribed = true;
    const currentTrigger = loadMoreTriggerRef.current;
    
    const options = {
      root: containerRef.current,
      rootMargin: '100px 0px',
      threshold: 0
    };

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      
      if (entry.isIntersecting && hasMore && !isFetchingMore && !isLoading && isSubscribed) {
        onLoadMore();
      }
    };

    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    if (currentTrigger && hasMore && !isFetchingMore && !isLoading) {
      observerRef.current = new IntersectionObserver(handleIntersect, options);
      observerRef.current.observe(currentTrigger);
    }

    return () => {
      isSubscribed = false;
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [hasMore, isFetchingMore, isLoading, onLoadMore]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      {scrollShadow && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0) 100%)',
            zIndex: 1
          }}
        />
      )}
      
      <Box
        ref={containerRef}
        onScroll={handleScroll}
        sx={{
          flex: 1,
          overflowY: 'overlay',
          position: 'relative',
          px: 2,
          overflowAnchor: 'none',
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch',
          '&:hover': {
            '&::-webkit-scrollbar-track': {
              background: 'rgba(0,0,0,0.08)'
            }
          },
          '::-webkit-scrollbar': {
            width: '10px',
            background: 'transparent'
          },
          '::-webkit-scrollbar-track': {
            background: 'rgba(0,0,0,0.05)',
            borderRadius: '8px',
            margin: '4px'
          },
          '::-webkit-scrollbar-thumb': {
            background: '#2196f3',
            borderRadius: '8px',
            border: '2px solid transparent',
            backgroundClip: 'padding-box',
            transition: 'all 0.2s ease'
          },
          '::-webkit-scrollbar-thumb:hover': {
            background: '#1976d2',
            border: '2px solid transparent',
            backgroundClip: 'padding-box'
          }
        }}
      >
        {isLoading ? (
          <Box
            component="section"
            aria-label="Pokemon loading skeletons"
            sx={{
              display: 'grid',
              gridTemplateColumns: viewMode === 'grid'
                ? {
                    xs: '1fr',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(3, 1fr)',
                    lg: 'repeat(4, 1fr)',
                    xl: 'repeat(6, 1fr)'
                  }
                : '1fr',
              gap: 2,
              pt: 2,
              pb: 4,
              minHeight: '200px'
            }}
          >
            {Array.from({ length: 12 }).map((_, index) => (
              <PokemonSkeleton key={index} viewMode={viewMode} />
            ))}
          </Box>
        ) : (
          <>
            <Box
              component="section"
              aria-label="Pokemon grid"
              sx={{
                display: 'grid',
                gridTemplateColumns: viewMode === 'grid'
                  ? {
                      xs: '1fr',
                      sm: 'repeat(2, 1fr)',
                      md: 'repeat(3, 1fr)',
                      lg: 'repeat(4, 1fr)',
                      xl: 'repeat(6, 1fr)'
                    }
                  : '1fr',
                gap: 2,
                pt: 2,
                pb: 4,
                minHeight: '200px',
                position: 'relative'
              }}
            >
              {pokemons.map((pokemon) => (
                <Box key={pokemon.name} sx={{ position: 'relative' }}>
                  {'overlay' in pokemon && pokemon.overlay}
                  <PokemonCard
                    pokemon={pokemon}
                    onClick={() => onPokemonClick(pokemon.name)}
                    viewMode={viewMode}
                  />
                </Box>
              ))}
            </Box>
            
            {/* Load More Trigger */}
            <Box
              ref={loadMoreTriggerRef}
              sx={{
                height: '20px',
                width: '100%',
                visibility: hasMore ? 'visible' : 'hidden'
              }}
            />

            {/* Loading More Indicator or End Message */}
            {isFetchingMore ? (
              <LoadingIndicator />
            ) : (
              !hasMore && pokemons.length > 0 && (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    width: '100%',
                    py: 3
                  }}
                >
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{
                      py: 1.5,
                      px: 3,
                      backgroundColor: 'background.paper',
                      borderRadius: 2,
                      boxShadow: 1
                    }}
                  >
                    You've caught them all! No more Pokémon to load
                  </Typography>
                </Box>
              )
            )}

            {!hasMore && pokemons.length === 0 && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  width: '100%',
                  py: 3
                }}
              >
                <Alert 
                  severity="info"
                  sx={{
                    boxShadow: 1
                  }}
                >
                  No Pokémon found. Try adjusting your search.
                </Alert>
              </Box>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};