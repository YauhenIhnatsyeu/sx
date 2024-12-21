import { IArticle, HistoryItem, IAutocompleteItem, Store } from './models';
import { useCallback, useEffect, useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { AUTOCOMPLETE_LIMIT } from './constants';
import { fetchPosts } from './api';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getLocalStorageWithDatePersistence } from './utils';

export const useArticles = (search: string) => {
    const { data, isFetching } = useQuery({
        queryKey: ['articles', search],
        queryFn: async () => {
            const { posts, total } = await fetchPosts(search);
            const articles = posts
                .map(
                    (post) => ({ id: post.id, title: post.title.replace('.', ''), description: post.body }) as IArticle,
                )
                .filter((article) => article.title.toLowerCase().includes(search.toLowerCase()));

            return { articles, totalResults: total };
        },
        enabled: !!search,
        placeholderData: keepPreviousData,
    });

    return {
        articles: data?.articles ?? [],
        totalResult: data?.totalResults ?? 0,
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

const useStore = create<Store>()(
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
    const { autocompleteHistory, setAutocompleteHistory } = useStore();

    const { data: searchedArticles = [] } = useQuery({
        queryKey: ['autocomplete', search],
        queryFn: async () => {
            if (!search) {
                return [];
            }

            const { posts } = await fetchPosts(search);
            const articles = posts
                .map(
                    (post) => ({ id: post.id, title: post.title.replace('.', ''), description: post.body }) as IArticle,
                )
                .filter((article) => article.title.toLowerCase().startsWith(search.toLowerCase()));
            return articles;
        },
        placeholderData: keepPreviousData,
    });
    const titlesFromHistory = autocompleteHistory
        .filter((article) => article.payload.toLowerCase().startsWith(search.toLowerCase()))
        .sort((a, b) => b.lastViewed.getTime() - a.lastViewed.getTime())
        .map((article) => article.payload);
    const searchedTitles = searchedArticles
        .filter((article) => !titlesFromHistory.includes(article.title))
        .slice(0, AUTOCOMPLETE_LIMIT - titlesFromHistory.length);
    const result = [
        ...titlesFromHistory.map((title) => ({ value: title, visited: true }) as IAutocompleteItem),
        ...searchedTitles.map((article) => ({ value: article.title }) as IAutocompleteItem),
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
