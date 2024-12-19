import { IAutocompleteItem } from '../../models';

interface Props {
    search: string;
    item: IAutocompleteItem;
    onClick: () => void;
}

export const AutocompleteItem = ({ search, item, onClick }: Props) => {
    const beginning = search.toLowerCase();
    const end = item.value.substring(search.length).toLowerCase();

    return (
        // onMouseDown works before blur on the search bar, onClick will work after the blur, so this item will be gone by then
        <div onMouseDown={onClick}>
            <span>
                {beginning}
                <b>{end}</b>
            </span>
        </div>
    );
};
