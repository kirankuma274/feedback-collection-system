import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useThemeToggle } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { mode, toggleTheme } = useThemeToggle();
  const navigate = useNavigate();

  return (
    <AppBar position="static">
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6" component={Link} to="/" color="inherit" sx={{ textDecoration: 'none' }}>
          Feedback System
        </Typography>

        <Box>
          <IconButton color="inherit" onClick={toggleTheme}>
            {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </IconButton>

          {user ? (
            <>
              {user.role === 'admin' && (
                <Button color="inherit" onClick={() => navigate('/admin')}>Dashboard</Button>
              )}
                <Button
                   color="inherit"
                   onClick={() => {
                   logout();          // clears localStorage + user
                   navigate('/login'); // redirects to login after logout
                   }}
                   >
                Logout
               </Button>
              
            </>
          ) : (
            <>
              <Button color="inherit" onClick={() => navigate('/login')}>Login</Button>
              <Button color="inherit" onClick={() => navigate('/register')}>Register</Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
