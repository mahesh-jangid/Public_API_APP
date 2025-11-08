import { useState, useMemo } from 'react';
import type { Pokemon } from '../types/pokemon';

export type SortOption = 'name' | 'id' | 'attack';
export type SortDirection = 'asc' | 'desc';

export function useSort(pokemons: Pokemon[]) {
  const [sortBy, setSortBy] = useState<SortOption>('id');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const getStat = (pokemon: Pokemon, statName: string) => 
    pokemon.stats.find(stat => stat.stat.name === statName)?.base_stat ?? 0;

  const sortedPokemons = useMemo(() => {
    const sorted = [...pokemons];
    
    switch (sortBy) {
      case 'name':
        sorted.sort((a, b) => {
          const comparison = a.name.localeCompare(b.name);
          return sortDirection === 'asc' ? comparison : -comparison;
        });
        break;
      case 'id':
        sorted.sort((a, b) => {
          const comparison = a.id - b.id;
          return sortDirection === 'asc' ? comparison : -comparison;
        });
        break;
      case 'attack':
        sorted.sort((a, b) => {
          const aTotal = getStat(a, 'attack') + getStat(a, 'special-attack');
          const bTotal = getStat(b, 'attack') + getStat(b, 'special-attack');
          const comparison = aTotal - bTotal;
          return sortDirection === 'asc' ? comparison : -comparison;
        });
        break;
    }
    
    return sorted;
  }, [pokemons, sortBy, sortDirection]);

  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  return {
    sortedPokemons,
    sortBy,
    setSortBy,
    sortDirection,
    toggleSortDirection
  };
}