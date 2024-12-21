import { createContext } from 'react';
import { Theme } from './types';

export const ThemeContext = createContext<{ theme: Theme; toggleTheme: () => void }>({
    theme: 'light',
    toggleTheme: () => {},
});
