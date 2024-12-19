import { IArticle, HistoryItem, HistoryItemStringified } from './models';
import articles from './assets/articles.json';
import { useLocalStorage } from 'react-use';
import { useCallback } from 'react';

export const useArticles = (): IArticle[] => {
    return articles;
};

export const useHistory = <T>(key: string, equalsFn: (a: T, b: T) => boolean = (a, b) => a === b) => {
    const [items, setToLocalStorage] = useLocalStorage<HistoryItem<T>[]>(key, [], {
        raw: false,
        serializer: (value) => JSON.stringify(value),
        // JSON.stringify saves dates as ISO strings, so when returning them back from local storage they need to be parsed back to Date
        deserializer: (json) =>
            (JSON.parse(json) as HistoryItemStringified<T>[]).map((x) => ({
                ...x,
                lastViewed: new Date(x.lastViewed),
            })),
    });

    const set = useCallback(
        (payload: T) => {
            if (items?.find((x) => equalsFn(x.payload, payload))) {
                setToLocalStorage(
                    items.map((x) => (equalsFn(x.payload, payload) ? { ...x, lastViewed: new Date() } : x)),
                );

                return;
            }

            const newItem: HistoryItem<T> = { payload, lastViewed: new Date() };

            setToLocalStorage(items ? [...items, newItem] : [newItem]);
        },
        [equalsFn, items, setToLocalStorage],
    );

    const remove = useCallback(
        (payload: T) => {
            if (!items) {
                return;
            }

            setToLocalStorage(items.filter((x) => !equalsFn(x.payload, payload)));
        },
        [equalsFn, items, setToLocalStorage],
    );

    return { items: items ?? [], set, remove };
};
