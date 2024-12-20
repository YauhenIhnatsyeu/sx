import { ChangeEvent, KeyboardEvent, useDeferredValue, useEffect, useRef, useState } from 'react';
import { IAutocompleteItem } from '../../models';
import { AutocompleteItem } from './AutocompleteItem';
import { useFocus } from '../../hooks';
import { Icon } from '../Icon';

interface Props {
    getAutocomplete: (search: string) => Promise<IAutocompleteItem[]>;
    onSearch: (search: string, autocomplete?: IAutocompleteItem) => void;
    autoFocus?: boolean;
    onAutocompleteRemove?: (autocomplete: IAutocompleteItem) => void;
}

export const SearchBar = ({ getAutocomplete, onSearch, autoFocus, onAutocompleteRemove }: Props) => {
    const [search, setSearch] = useState('');
    const [focused, setFocused] = useFocus(['search-bar__input', 'autocomplete-item__delete']);
    const [autocomplete, setAutocomplete] = useState<IAutocompleteItem[]>([]);
    const showAutocomplete = autocomplete.length > 0 && focused;
    const deferredSearch = useDeferredValue(search);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSearch = (autocomplete?: IAutocompleteItem) => {
        onSearch(search, autocomplete);
        setAutocomplete([]);
        inputRef.current!.blur();

        if (autocomplete) {
            setSearch(autocomplete.value.toLowerCase());
        }
    };

    const handleChange = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
        setSearch(value);
        setFocused(true);
    };

    const handleKeyUp = ({ key }: KeyboardEvent<HTMLInputElement>) => {
        if (key === 'Enter') {
            handleSearch();
        }
    };

    const handleAutocompleteRemove = (autocomplete: IAutocompleteItem) => {
        if (onAutocompleteRemove) {
            onAutocompleteRemove(autocomplete);
        }
    };

    const handleClear = () => {
        setSearch('');
        inputRef.current!.focus();
    };

    useEffect(() => {
        getAutocomplete(deferredSearch).then((result) => {
            setAutocomplete(result);
        });
    }, [deferredSearch, getAutocomplete]);

    return (
        <div className="search-bar">
            <div className="search-bar__input-container">
                <input
                    ref={inputRef}
                    className={`search-bar__input ${showAutocomplete ? 'search-bar__input--with-autocomplete' : ''}`}
                    type="text"
                    autoFocus={autoFocus}
                    value={search}
                    onChange={handleChange}
                    onKeyUp={handleKeyUp}
                    placeholder="Search..."
                />
                {search && <Icon className="search-bar__input-cross" type="cross" onClick={handleClear} />}
            </div>
            {showAutocomplete && (
                <section className="autocomplete-list-container">
                    {autocomplete.map((item) => (
                        <AutocompleteItem
                            key={item.value}
                            search={search}
                            item={item}
                            onClick={() => handleSearch(item)}
                            onRemove={() => handleAutocompleteRemove(item)}
                        />
                    ))}
                </section>
            )}
        </div>
    );
};
