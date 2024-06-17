import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#ff4081' },
  },
  components: {
    MuiListItem: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: '#1976d2',
            color: 'white',
            '&:hover': { backgroundColor: '#115293' },
          },
          '&:hover': { backgroundColor: '#1976d2', color: 'white' },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: { backgroundColor: '#f5f5f5', color: '#1976d2' },
      },
    },
  },
});

export default theme;
