import { useState, useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { Pokemon } from '../types/pokemon';
import { getPokemon, searchPokemons } from '../services/api';
import { useDebounce } from './useDebounce';
import type { PokemonType } from '../components/TypeFilter';

const ITEMS_PER_PAGE = 20;

export function usePokemonList(initialLimit = ITEMS_PER_PAGE) {
  const [offset, setOffset] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<PokemonType | ''>('');
  const [allPokemons, setAllPokemons] = useState<Pokemon[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 300);
  const debouncedType = useDebounce(selectedType, 300);

  const {
    data: newPokemonList = [] as Pokemon[],
    isLoading: isNewDataLoading,
    error,
    isFetching
  } = useQuery<Pokemon[]>({
    queryKey: ['pokemons', offset, initialLimit, debouncedSearch, debouncedType],
    queryFn: () => searchPokemons({ 
      query: debouncedSearch, 
      type: debouncedType, 
      limit: initialLimit,
      offset: offset
    }),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 2,
    gcTime: 1000 * 60 * 10 // Keep in cache for 10 minutes
  });

  // Update allPokemons when new data arrives
  useEffect(() => {
    if (offset === 0) {
      setAllPokemons(newPokemonList);
    } else if (newPokemonList.length > 0) {
      setAllPokemons(prev => {
        // Remove duplicates by name
        const existingNames = new Set(prev.map(p => p.name));
        const uniqueNew = newPokemonList.filter(p => !existingNames.has(p.name));
        return [...prev, ...uniqueNew];
      });
    }
  }, [newPokemonList, offset]);

  // Reset when search or type changes
  useEffect(() => {
    setOffset(0);
    setAllPokemons([]);
  }, [debouncedSearch, debouncedType]);

  // Track loading state changes
  useEffect(() => {
    if (isFetching && offset > 0) {
      setIsLoadingMore(true);
    } else if (!isFetching) {
      // Add a small delay to prevent rapid state updates
      const timeoutId = setTimeout(() => {
        setIsLoadingMore(false);
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [isFetching, offset]);

  const loadMore = useCallback(() => {
    if (!isFetching && newPokemonList.length >= initialLimit) {
      setOffset(prevOffset => prevOffset + initialLimit);
    }
  }, [isFetching, newPokemonList.length, initialLimit]);

  return {
    pokemons: allPokemons,
    isLoading: isNewDataLoading && offset === 0,
    error,
    loadMore,
    hasMore: newPokemonList.length >= initialLimit,
    isFetchingMore: isLoadingMore,
    isError: !!error,
    searchQuery,
    setSearchQuery,
    selectedType,
    setSelectedType
  };
}

export function usePokemonDetails(nameOrId: string | number) {
  return useQuery({
    queryKey: ['pokemon', nameOrId],
    queryFn: () => getPokemon(nameOrId),
    enabled: !!nameOrId,
  });
}