import { Sun, Moon } from 'lucide-react';
import useDarkMode from '../hooks/useDarkMode';
import styles from './ThemeWidget.module.css';

export default function ThemeWidget() {
    const { isDark, toggleTheme } = useDarkMode();

    return (
        <button
            className={styles.widget}
            aria-label="Toggle dark mode"
            onClick={toggleTheme}
        >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
    );
}