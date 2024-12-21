import { useHoverDirty } from 'react-use';
import { IAutocompleteItem } from '../../models';
import { MouseEventHandler, useRef } from 'react';
import { findIntersectionStopIndex } from '../../utils';
import HistoryIcon from '../../assets/icons/history.svg';
import SearchIcon from '../../assets/icons/search.svg';

interface Props {
    search: string;
    item: IAutocompleteItem;
    onClick?: () => void;
    onRemove?: () => void;
}

export const AutocompleteItem = ({ search, item, onClick, onRemove }: Props) => {
    const index = findIntersectionStopIndex(search, item.value);
    const beginning = item.value.substring(0, index).toLowerCase();
    const end = item.value.substring(index).toLowerCase();
    const ref = useRef<HTMLDivElement>(null);
    const hovered = useHoverDirty(ref);

    const handleDelete: MouseEventHandler<HTMLAnchorElement> = (e) => {
        e.stopPropagation();

        if (onRemove) {
            onRemove();
        }
    };

    return (
        // onMouseDown works before blur on the search bar, onClick will work after the blur, so this item will be gone by then
        <div
            ref={ref}
            className={`autocomplete-item ${item.visited ? 'autocomplete-item--visited' : ''}`}
            onMouseDown={onClick}
        >
            <div className="autocomplete-item__icon-string-container">
                <img className="icon" src={item.visited ? HistoryIcon : SearchIcon} />
                <span>
                    {beginning}
                    <span className="autocomplete-item__end">{end}</span>
                </span>
            </div>
            {item.visited && hovered && (
                <a className="autocomplete-item__delete" onMouseDown={handleDelete}>
                    Delete
                </a>
            )}
        </div>
    );
};
