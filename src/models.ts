export interface IArticle {
    id: string;
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
    value: string;
    visited?: boolean;
}

export interface IPost {
    id: string;
    title: string;
    body: string;
}

export interface DummyDTO {
    posts: IPost[];
    total: number;
}

export interface Store {
    autocompleteHistory: HistoryItem<string>[];
    setAutocompleteHistory: (history: HistoryItem<string>[]) => void;
}
