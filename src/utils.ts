import { PersistStorage, StorageValue } from 'zustand/middleware';

export const findIntersectionStopIndex = (a: string, b: string) => {
    let index = 0;

    while (index < a.length && index < b.length && a[index].toLowerCase() === b[index].toLowerCase()) {
        index++;
    }

    return index;
};

const isISODateString = (value: string) => {
    const date = new Date(value);
    return !isNaN(date.getTime()) && value === date.toISOString();
};

export const getLocalStorageWithDatePersistence = <T>(): PersistStorage<T> | undefined => ({
    getItem: (name) => {
        const storedValue = localStorage.getItem(name);
        if (storedValue) {
            const parsedValue = JSON.parse(storedValue);

            // Recursively check for ISO date strings and convert them to Date objects
            const convertDates = (obj: object): object => {
                if (typeof obj === 'string' && isISODateString(obj)) {
                    return new Date(obj);
                }

                if (Array.isArray(obj)) {
                    return obj.map(convertDates);
                }

                if (obj && typeof obj === 'object') {
                    return Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, convertDates(value)]));
                }

                return obj;
            };

            return convertDates(parsedValue) as StorageValue<T>;
        }

        return null;
    },
    setItem: (name, value) => {
        localStorage.setItem(name, JSON.stringify(value));
    },
    removeItem: (name) => {
        localStorage.removeItem(name);
    },
});

export const generateSequentialArray = (from: number, to: number) =>
    Array.from({ length: to - from + 1 }, (_, i) => i + from);
