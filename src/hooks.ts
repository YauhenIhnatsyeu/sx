import { HistoryItem, IAutocompleteItem, PersistedStore, Store } from './models';
import { useCallback, useEffect, useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { AUTOCOMPLETE_LIMIT } from './constants';
import { fetchArticles, fetchAutocomplete } from './api';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getLocalStorageWithDatePersistence } from './utils';
import { v4 as uuid } from 'uuid';

export const useArticles = (search: string) => {
    const { page, setPage } = useStore();

    const { data, isFetching } = useQuery({
        queryKey: ['articles', search, page],
        queryFn: async () => {
            return await fetchArticles(search, page);
        },
        enabled: !!search,
        placeholderData: keepPreviousData,
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
    const { data: searchedArticles = [] } = useQuery({
        queryKey: ['autocomplete', search],
        queryFn: async ({ signal }) => (search ? (await fetchAutocomplete(search, signal)).articles : []),
        placeholderData: keepPreviousData,
    });
    const titlesFromHistory = autocompleteHistory
        .filter((article) => article.payload.toLowerCase().startsWith(search.toLowerCase()))
        .sort((a, b) => b.lastViewed.getTime() - a.lastViewed.getTime())
        .slice(0, AUTOCOMPLETE_LIMIT)
        .map((article) => article.payload);
    const searchedTitles = searchedArticles
        .filter((article) => !titlesFromHistory.includes(article.title))
        .slice(0, AUTOCOMPLETE_LIMIT - titlesFromHistory.length);
    const result = [
        ...titlesFromHistory.map((title) => ({ value: title, visited: true, id: uuid() }) as IAutocompleteItem),
        ...searchedTitles.map((article) => ({ value: article.title, id: uuid() }) as IAutocompleteItem),
    ];

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

    return { autocomplete: result, setHistory, removeHistory };
};
