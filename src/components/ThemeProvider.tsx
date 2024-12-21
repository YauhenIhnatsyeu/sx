import { PropsWithChildren, useEffect, useState } from 'react';
import { usePrevious } from 'react-use';
import { ThemeContext } from '../contexts';
import { Theme } from '../types';

export const ThemeProvider = ({ children }: PropsWithChildren) => {
    const [theme, setTheme] = useState<Theme>('light');
    const prevTheme = usePrevious(theme);

    const toggleTheme = () => {
        setTheme((prev: Theme) => (prev === 'light' ? 'dark' : 'light'));
    };

    useEffect(() => {
        if (prevTheme) {
            document.body.classList.remove(prevTheme);
        }

        document.body.classList.add(theme);
    }, [prevTheme, theme]);

    return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
};
