import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { GridView, ViewList } from '@mui/icons-material';

export type ViewMode = 'grid' | 'list';

interface ViewToggleProps {
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export const ViewToggle = ({ view, onViewChange }: ViewToggleProps) => {
  const handleChange = (_: React.MouseEvent<HTMLElement>, newView: ViewMode | null) => {
    if (newView !== null) {
      onViewChange(newView);
    }
  };

  return (
    <ToggleButtonGroup
      value={view}
      exclusive
      onChange={handleChange}
      aria-label="view mode"
      size="small"
      sx={{
        '& .MuiToggleButton-root': {
          border: 1,
          borderColor: 'divider',
          px: 2,
          '&.Mui-selected': {
            backgroundColor: 'primary.main',
            color: 'white',
            '&:hover': {
              backgroundColor: 'primary.dark',
            },
          },
          '&:hover': {
            backgroundColor: 'action.hover',
          },
        },
      }}
    >
      <ToggleButton value="grid" aria-label="grid view">
        <GridView />
      </ToggleButton>
      <ToggleButton value="list" aria-label="list view">
        <ViewList />
      </ToggleButton>
    </ToggleButtonGroup>
  );
};