import LightThemeIcon from '../assets/icons/sun.svg';
import DarkThemeIcon from '../assets/icons/moon.svg';
import { useTheme } from '../hooks';

export const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <img
            className="icon theme-toggle"
            src={theme === 'light' ? DarkThemeIcon : LightThemeIcon}
            onClick={toggleTheme}
        />
    );
};
