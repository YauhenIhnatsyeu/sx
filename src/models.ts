export interface IArticle {
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
