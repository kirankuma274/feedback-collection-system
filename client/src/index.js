import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import  AuthProvider  from './context/AuthContext';
import ThemeToggleProvider from './context/ThemeContext';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

<React.StrictMode>
  <ThemeToggleProvider>
    <AuthProvider>
      <App />
    </AuthProvider>
  </ThemeToggleProvider>
</React.StrictMode>

);







