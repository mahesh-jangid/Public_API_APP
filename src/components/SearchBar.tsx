import { TextField, InputAdornment } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchBar = ({ value, onChange, placeholder = 'Search pokémon...' }: SearchBarProps) => {
  return (
    <TextField
      fullWidth
      size="small"
      variant="outlined"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon color="action" />
          </InputAdornment>
        ),
        sx: {
          bgcolor: 'background.paper',
          '&:hover': {
            bgcolor: 'background.paper',
          }
        }
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: 'grey.300',
          },
          '&:hover fieldset': {
            borderColor: 'grey.400',
          }
        }
      }}
    />
  );
};