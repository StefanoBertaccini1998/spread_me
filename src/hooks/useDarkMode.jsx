import { useSyncExternalStore } from 'react';
import { themeStore } from '../utils/themeStore';

export default function useDarkMode() {
    const theme = useSyncExternalStore(
        themeStore.subscribe,
        themeStore.get,
        themeStore.get
    );

    return {
        theme,                      // 'light' | 'dark'
        toggleTheme: themeStore.toggle,
        isDark: theme === 'dark',
    };
}