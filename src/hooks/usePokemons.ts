import { useState, useMemo } from 'react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import type { Pokemon } from '../types/pokemon';
import { getPokemon, searchPokemons, getAllPokemons } from '../services/api';
import type { PokemonType } from '../components/TypeFilter';

const ITEMS_PER_PAGE = 20;

export function usePokemonList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<PokemonType | ''>('');

  // Fetch all pokemons once and cache them. This is for client-side search/filter.
  const { data: allPokemons, isLoading: isAllLoading } = useQuery<Pokemon[]>({
    queryKey: ['allPokemons'],
    queryFn: getAllPokemons,
    staleTime: Infinity,
  });

  // Infinite query for paginated data
  const { 
    data, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage, 
    isLoading: isInfiniteLoading,
    error,
  } = useInfiniteQuery<Pokemon[]>({
    queryKey: ['pokemons'],
    queryFn: ({ pageParam = 0 }) => searchPokemons({ query: '', limit: ITEMS_PER_PAGE, offset: pageParam as number }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < ITEMS_PER_PAGE) return undefined;
      return allPages.length * ITEMS_PER_PAGE;
    },
    enabled: !searchQuery && !selectedType, // Only run this query when not searching/filtering
  });

  const pokemons = useMemo(() => {
    if (searchQuery || selectedType) {
      return (allPokemons || []).filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (!selectedType || p.types.some(t => t.type.name === selectedType))
      );
    }
    return data?.pages.flat() ?? [];
  }, [data, allPokemons, searchQuery, selectedType]);

  return {
    pokemons,
    isLoading: (isInfiniteLoading && !data) || (isAllLoading && (!!searchQuery || !!selectedType)),
    error,
    loadMore: fetchNextPage,
    hasMore: !searchQuery && !selectedType && hasNextPage,
    isFetchingMore: isFetchingNextPage,
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