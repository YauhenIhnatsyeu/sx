import { useCallback, useState } from 'react';
import './App.css';
import { Header } from './components/Header';
import { SearchBar } from './components/search-bar/SearchBar';
import { useArticles, useHistory } from './hooks';
import { AUTOCOMPLETE_LIMIT } from './constants';
import { IAutocompleteItem } from './models';
import { SearchResults } from './components/SearchResults';

function App() {
    const articles = useArticles();
    const { items: autocompleteHistory, set: setHistory } = useHistory<string>('autocomplete');
    const [search, setSearch] = useState('');

    const searchTitles = useCallback(
        (search: string) => {
            if (!search) {
                return Promise.resolve([]);
            }

            const itemsFromHistory = autocompleteHistory
                .filter((article) => article.payload.toLowerCase().startsWith(search.toLowerCase()))
                .sort((a, b) => b.lastViewed.getTime() - a.lastViewed.getTime());
            const titlesFromHistory = itemsFromHistory.map((article) => article.payload);
            const searchedTitles = articles
                .filter(
                    (article) =>
                        !titlesFromHistory.includes(article.title) &&
                        article.title.toLowerCase().startsWith(search.toLowerCase()),
                )
                .slice(0, AUTOCOMPLETE_LIMIT - titlesFromHistory.length);
            const result = [
                ...titlesFromHistory.map((title) => ({ value: title, used: true }) as IAutocompleteItem),
                ...searchedTitles.map((article) => ({ value: article.title }) as IAutocompleteItem),
            ];

            return Promise.resolve(result);
        },
        [articles, autocompleteHistory],
    );

    const handleSearch = (search: string, autocomplete?: IAutocompleteItem) => {
        setSearch(search);

        if (autocomplete) {
            setHistory(autocomplete.value);
        }
    };

    return (
        <>
            <Header />
            <main>
                <SearchBar getAutocomplete={searchTitles} onSearch={handleSearch} autoFocus />
                <SearchResults search={search} />
            </main>
            <footer></footer>
        </>
    );
}

export default App;
