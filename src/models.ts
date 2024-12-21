export interface IArticle {
    id: number;
    title: string;
    description: string;
}

export interface HistoryItem<T> {
    payload: T;
    lastViewed: Date;
}

export interface HistoryItemStringified<T> extends Omit<HistoryItem<T>, 'lastViewed'> {
    lastViewed: string;
}

export interface IAutocompleteItem {
    id: string;
    value: string;
    visited?: boolean;
}

export interface IPost {
    id: string;
    title: string;
    body: string;
}

export interface Store {
    page: number;
    setPage: (page: number) => void;
}

export interface PersistedStore {
    autocompleteHistory: HistoryItem<string>[];
    setAutocompleteHistory: (history: HistoryItem<string>[]) => void;
}

export interface WikiDTO {
    query: {
        search: { title: string; snippet: string; pageid: number }[];
        searchinfo: { totalhits: number };
    };
}
