import { useState } from 'react';
import { SearchBar } from './search-bar/SearchBar';
import { useArticles, useAutocomplete } from '../hooks';
import { IAutocompleteItem } from '../models';
import { SearchResults } from './SearchResults';

export const Searcher = () => {
    const [changingSearch, setChangingSearch] = useState('');
    const [confirmedSearch, setConfirmedSearch] = useState('');
    const { autocomplete, setHistory, removeHistory } = useAutocomplete(changingSearch);

    useArticles(confirmedSearch);

    const handleSearch = (search: string, autocomplete?: IAutocompleteItem) => {
        setConfirmedSearch(autocomplete ? autocomplete.value : search);

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
                    onChange={setChangingSearch}
                    autoFocus
                    onAutocompleteRemove={(autocomplete) => removeHistory(autocomplete.value)}
                />
            </div>
            <SearchResults search={confirmedSearch} />
        </>
    );
};
