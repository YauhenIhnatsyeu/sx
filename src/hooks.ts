import { HistoryItem, IAutocompleteItem, PersistedStore, Store } from './models';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { AUTOCOMPLETE_LIMIT } from './constants';
import { fetchArticles, fetchAutocomplete } from './api';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getLocalStorageWithDatePersistence } from './utils';
import { ThemeContext } from './contexts';

export const useTheme = () => useContext(ThemeContext);

export const useArticles = (search: string) => {
    const { page, setPage } = useStore();

    const { data, isFetching } = useQuery({
        queryKey: ['articles', search, page],
        queryFn: async () => {
            return await fetchArticles(search, page);
        },
        enabled: !!search,
        placeholderData: keepPreviousData,
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        setPage(1);
    }, [search, setPage]);

    return {
        articles: data?.articles ?? [],
        totalResults: data?.totalResultss ?? 0,
        loading: isFetching,
    };
};

export const useFocus = (classesToBeClicked: string[]): [boolean, (value: boolean) => void] => {
    const [focused, setFocused] = useState(false);

    const handleMouseDown = useCallback(
        (e: MouseEvent) => {
            const targetClassList = (e.target as HTMLElement).classList;

            setFocused(classesToBeClicked.some((className) => targetClassList.contains(className)));
        },
        [classesToBeClicked],
    );

    useEffect(() => {
        document.addEventListener('mousedown', handleMouseDown);

        return () => document.removeEventListener('mousedown', handleMouseDown);
    }, [handleMouseDown]);

    return [focused, setFocused];
};

export const useStore = create<Store>()((set) => ({
    page: 1,
    setPage: (page: number) => set({ page }),
}));

export const usePersistedStore = create<PersistedStore>()(
    persist(
        (set) => ({
            autocompleteHistory: [],
            setAutocompleteHistory: (history: HistoryItem<string>[]) => set({ autocompleteHistory: history }),
        }),
        {
            name: 'store',
            storage: getLocalStorageWithDatePersistence(),
        },
    ),
);

export const useAutocomplete = (search: string) => {
    const { autocompleteHistory, setAutocompleteHistory } = usePersistedStore();
    const { data = [] } = useQuery({
        queryKey: ['autocomplete', search],
        queryFn: async ({ signal }) => (search ? (await fetchAutocomplete(search, signal)).articles : []),
        placeholderData: keepPreviousData,
        refetchOnWindowFocus: false,
    });

    const setHistory = useCallback(
        (payload: string) => {
            if (autocompleteHistory?.find((x) => x.payload === payload)) {
                setAutocompleteHistory(
                    autocompleteHistory.map((x) => (x.payload === payload ? { ...x, lastViewed: new Date() } : x)),
                );
            } else {
                const newItem: HistoryItem<string> = { payload, lastViewed: new Date() };

                setAutocompleteHistory(autocompleteHistory ? [...autocompleteHistory, newItem] : [newItem]);
            }
        },
        [autocompleteHistory, setAutocompleteHistory],
    );

    const removeHistory = useCallback(
        (payload: string) => {
            if (!autocompleteHistory) {
                return;
            }

            setAutocompleteHistory(autocompleteHistory.filter((x) => x.payload !== payload));
        },
        [autocompleteHistory, setAutocompleteHistory],
    );

    const autocomplete = useMemo(() => {
        // Getting saved titles from history, sorting them by last time they were used and cutting them if history length is more than limit
        const titlesFromHistory = autocompleteHistory
            .filter((article) => article.payload.toLowerCase().startsWith(search.toLowerCase()))
            .sort((a, b) => b.lastViewed.getTime() - a.lastViewed.getTime())
            .slice(0, AUTOCOMPLETE_LIMIT)
            .map((article) => article.payload);
        // Getting articles from the server, checking if there're some articles from the history and cutting them if articles + history length is more than limit
        const searchedArticles = data
            .filter((article) => !titlesFromHistory.includes(article.title))
            .slice(0, AUTOCOMPLETE_LIMIT - titlesFromHistory.length);

        // Combining articles from the server with the history into array of autocomplete items
        return [
            ...titlesFromHistory.map((title) => ({ value: title, visited: true }) as IAutocompleteItem),
            ...searchedArticles.map((article) => ({ value: article.title }) as IAutocompleteItem),
        ];
    }, [autocompleteHistory, data, search]);

    return { autocomplete, setHistory, removeHistory };
};
