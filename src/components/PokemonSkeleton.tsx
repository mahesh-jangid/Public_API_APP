import { Box, Skeleton, Card } from '@mui/material';
import type { ViewMode } from './ViewToggle';
import type { FC } from 'react';

interface PokemonSkeletonProps {
  viewMode: ViewMode;
}

export const PokemonSkeleton: FC<PokemonSkeletonProps> = ({ viewMode }) => {
  if (viewMode === 'list') {
    return (
      <Card
        sx={{
          display: 'flex',
          p: 2,
          gap: 2,
          alignItems: 'center',
          height: '100px'
        }}
      >
        <Skeleton 
          variant="rounded" 
          width={80} 
          height={80}
          animation="wave"
        />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width="40%" height={32} animation="wave" />
          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
            <Skeleton variant="rounded" width={60} height={24} animation="wave" />
            <Skeleton variant="rounded" width={60} height={24} animation="wave" />
          </Box>
        </Box>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        height: '100%'
      }}
    >
      <Skeleton 
        variant="rounded" 
        width={120} 
        height={120}
        animation="wave"
      />
      <Box sx={{ width: '100%', textAlign: 'center' }}>
        <Skeleton variant="text" width="60%" height={32} sx={{ mx: 'auto' }} animation="wave" />
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mt: 1 }}>
          <Skeleton variant="rounded" width={60} height={24} animation="wave" />
          <Skeleton variant="rounded" width={60} height={24} animation="wave" />
        </Box>
      </Box>
    </Card>
  );
};