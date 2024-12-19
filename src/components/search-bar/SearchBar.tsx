import { KeyboardEvent, useDeferredValue, useEffect, useRef, useState } from 'react';
import { IAutocompleteItem } from '../../models';
import { AutocompleteItem } from './AutocompleteItem';

interface Props {
    getAutocomplete: (search: string) => Promise<IAutocompleteItem[]>;
    onSearch: (search: string, autocomplete?: IAutocompleteItem) => void;
    autoFocus?: boolean;
}

export const SearchBar = ({ getAutocomplete, onSearch, autoFocus }: Props) => {
    const [search, setSearch] = useState('');
    const [focused, setFocused] = useState(false);
    const [autocomplete, setAutocomplete] = useState<IAutocompleteItem[]>([]);
    const showAutocomplete = autocomplete.length > 0 && focused;
    const deferredSearch = useDeferredValue(search);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSearch = (autocomplete?: IAutocompleteItem) => {
        onSearch(search, autocomplete);
        setAutocomplete([]);
        inputRef.current!.blur();

        if (autocomplete) {
            setSearch(autocomplete.value);
        }
    };

    const handleKeyUp = ({ key }: KeyboardEvent<HTMLInputElement>) => {
        if (key === 'Enter') {
            handleSearch();
        }
    };

    useEffect(() => {
        getAutocomplete(deferredSearch).then((result) => {
            setAutocomplete(result);
        });
    }, [deferredSearch, getAutocomplete]);

    return (
        <div>
            <input
                ref={inputRef}
                type="text"
                autoFocus={autoFocus}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyUp={handleKeyUp}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
            />
            {showAutocomplete && (
                <div>
                    {autocomplete.map((item) => (
                        <AutocompleteItem
                            key={item.value}
                            search={search}
                            item={item}
                            onClick={() => handleSearch(item)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
