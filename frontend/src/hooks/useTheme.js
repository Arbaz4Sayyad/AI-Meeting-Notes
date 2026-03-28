import { useState, useEffect } from 'react';
import { useTheme as useThemeContext } from '../context/ThemeContext';

export const useTheme = () => {
  const { isDark, toggleTheme } = useThemeContext();
  return { isDark, toggleTheme };
};
