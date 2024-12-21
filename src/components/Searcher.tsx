import { useState } from 'react';
import { SearchBar } from './search-bar/SearchBar';
import { useArticles, useAutocomplete } from '../hooks';
import { IAutocompleteItem } from '../models';
import { SearchResults } from './SearchResults';

export const Searcher = () => {
    const [dirtySearch, setDirtySearch] = useState('');
    const [search, setSearch] = useState('');
    const { autocomplete, setHistory, removeHistory } = useAutocomplete(dirtySearch);

    useArticles(search);

    const handleSearch = (search: string, autocomplete?: IAutocompleteItem) => {
        setSearch(autocomplete ? autocomplete.value : search);

        if (autocomplete) {
            setHistory(autocomplete.value);
        }
    };

    return (
        <>
            <div className="search-bar-container">
                <SearchBar
                    autocomplete={autocomplete}
                    onSearch={handleSearch}
                    onChange={setDirtySearch}
                    autoFocus
                    onAutocompleteRemove={(autocomplete) => removeHistory(autocomplete.value)}
                />
            </div>
            <SearchResults search={search} />
        </>
    );
};
