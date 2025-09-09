import React, { useState } from 'react';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { Box, AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import './App.css';
import UserChatDemo from './components/UserChatDemo';
import AdminPanel from './components/AdminPanel';
import SystemExplanation from './components/SystemExplanation';

type ViewType = 'user' | 'admin' | 'explanation';

// Create RTL theme
const theme = createTheme({
  direction: 'rtl',
  typography: {
    fontFamily: '"Vazirmatn", "Tahoma", sans-serif',
  },
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#9c27b0',
      light: '#ba68c8',
      dark: '#7b1fa2',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          direction: 'rtl',
        },
      },
    },
  },
});

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('explanation');

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)' 
      }}>
        {/* Header */}
        <AppBar 
          position="static" 
          elevation={2}
          sx={{ 
            background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
          }}
        >
          <Toolbar>
            <Container maxWidth="xl" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
                  سیستم چت‌بات فروشگاه فارسی
                </Typography>
                <Typography variant="subtitle1" sx={{ opacity: 0.9, mt: 0.5 }}>
                  دمو جامع برای مدیران ارشد و تیم مارکتینگ
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  onClick={() => setCurrentView('explanation')}
                  variant={currentView === 'explanation' ? 'contained' : 'outlined'}
                  color={currentView === 'explanation' ? 'secondary' : 'inherit'}
                  sx={{
                    minWidth: 120,
                    fontWeight: 600,
                    borderColor: currentView !== 'explanation' ? 'rgba(255,255,255,0.5)' : undefined,
                    color: currentView !== 'explanation' ? 'white' : undefined,
                    '&:hover': {
                      borderColor: currentView !== 'explanation' ? 'white' : undefined,
                      bgcolor: currentView !== 'explanation' ? 'rgba(255,255,255,0.1)' : undefined,
                    }
                  }}
                >
                  توضیح سیستم
                </Button>
                <Button
                  onClick={() => setCurrentView('user')}
                  variant={currentView === 'user' ? 'contained' : 'outlined'}
                  color={currentView === 'user' ? 'secondary' : 'inherit'}
                  sx={{
                    minWidth: 120,
                    fontWeight: 600,
                    borderColor: currentView !== 'user' ? 'rgba(255,255,255,0.5)' : undefined,
                    color: currentView !== 'user' ? 'white' : undefined,
                    '&:hover': {
                      borderColor: currentView !== 'user' ? 'white' : undefined,
                      bgcolor: currentView !== 'user' ? 'rgba(255,255,255,0.1)' : undefined,
                    }
                  }}
                >
                  نمای کاربر
                </Button>
                <Button
                  onClick={() => setCurrentView('admin')}
                  variant={currentView === 'admin' ? 'contained' : 'outlined'}
                  color={currentView === 'admin' ? 'secondary' : 'inherit'}
                  sx={{
                    minWidth: 120,
                    fontWeight: 600,
                    borderColor: currentView !== 'admin' ? 'rgba(255,255,255,0.5)' : undefined,
                    color: currentView !== 'admin' ? 'white' : undefined,
                    '&:hover': {
                      borderColor: currentView !== 'admin' ? 'white' : undefined,
                      bgcolor: currentView !== 'admin' ? 'rgba(255,255,255,0.1)' : undefined,
                    }
                  }}
                >
                  پنل مدیریت
                </Button>
              </Box>
            </Container>
          </Toolbar>
        </AppBar>

        {/* Content */}
        <Box sx={{ py: 4 }}>
          {currentView === 'explanation' && <SystemExplanation />}
          {currentView === 'user' && <UserChatDemo />}
          {currentView === 'admin' && <AdminPanel />}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;