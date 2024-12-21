import { generateSequentialArray } from '../utils';
import { PAGINATION_MAX_VISIBLE_PAGES_COUNT } from '../constants';

interface Props {
    count: number;
    page: number;
    onChange: (page: number) => void;
}

export const Pagination = ({ page, count, onChange }: Props) => {
    const maxPages = Math.min(count, PAGINATION_MAX_VISIBLE_PAGES_COUNT);
    const pages = generateSequentialArray(page > maxPages ? page - maxPages + 1 : 1, page > maxPages ? page : maxPages);

    return (
        <div className="pagination">
            {page > 1 && (
                <button className="pagination__button" onClick={() => onChange(page - 1)}>
                    Previous
                </button>
            )}
            {pages.map((p) => (
                <a
                    className={`pagination__page ${page === p ? 'pagination__page--active' : ''}`}
                    onClick={() => onChange(p)}
                >
                    {p}{' '}
                </a>
            ))}
            {page < count && (
                <button className="pagination__button" onClick={() => onChange(page + 1)}>
                    Next
                </button>
            )}
        </div>
    );
};
