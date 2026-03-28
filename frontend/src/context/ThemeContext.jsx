import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check localStorage for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    setIsDarkMode(shouldBeDark);
  }, []);

  useEffect(() => {
    // Update localStorage and document class when theme changes
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    
    const root = document.documentElement;
    const body = document.body;
    console.log('Theme effect: isDarkMode =', isDarkMode);
    
    if (isDarkMode) {
      root.classList.add('dark');
      body.classList.add('dark');
      console.log('Added dark class to root and body');
    } else {
      root.classList.remove('dark');
      body.classList.remove('dark');
      console.log('Removed dark class from root and body');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    console.log('Theme toggle clicked');
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeContext.Provider value={{ isDark: isDarkMode, isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
