import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { IAutocompleteItem } from '../../models';
import { AutocompleteItem } from './AutocompleteItem';
import { useFocus } from '../../hooks';
import CrossIcon from '../../assets/icons/cross.svg';

interface Props {
    autocomplete: IAutocompleteItem[];
    onSearch: (search: string, autocomplete?: IAutocompleteItem) => void;
    onChange: (search: string) => void;
    autoFocus?: boolean;
    onAutocompleteRemove?: (autocomplete: IAutocompleteItem) => void;
}

export const SearchBar = ({ autocomplete, onSearch, onChange, autoFocus, onAutocompleteRemove }: Props) => {
    const [search, setSearch] = useState('');
    const [focused, setFocused] = useFocus(['search-bar__input', 'autocomplete-item__delete']);
    const showAutocomplete = autocomplete.length > 0 && focused;
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSearch = (autocomplete?: IAutocompleteItem) => {
        onSearch(search, autocomplete);
        setFocused(false);

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
        setFocused(true);
        inputRef.current!.focus();
    };

    useEffect(() => {
        onChange(search);
    }, [onChange, search]);

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
                {search && <img className="icon search-bar__input-cross" src={CrossIcon} onClick={handleClear} />}
            </div>
            {showAutocomplete && (
                <div className="autocomplete-list-container">
                    {autocomplete.map((item, i) => (
                        <AutocompleteItem
                            key={i}
                            search={search}
                            item={item}
                            onClick={() => handleSearch(item)}
                            onRemove={() => handleAutocompleteRemove(item)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
