import { Article } from './Article';
import { useArticles, useStore } from '../hooks';
import { Pagination } from './Pagination';
import { PAGE_SIZE } from '../constants';

interface Props {
    search: string;
}

export const SearchResults = ({ search }: Props) => {
    const { articles, loading, totalResults } = useArticles(search);
    const { page, setPage } = useStore();
    const pagesCount = Math.ceil(totalResults / PAGE_SIZE);

    return (
        <section className="search-result-list-container">
            {totalResults !== 0 && (
                <p className="search-result-list-container__total-results">{totalResults} results found</p>
            )}
            {loading ? (
                <span>Loading...</span>
            ) : (
                <>
                    {articles.map((article) => (
                        <Article key={article.id} article={article} />
                    ))}
                    {articles.length > 0 && pagesCount > 1 && (
                        <Pagination page={page} count={pagesCount} onChange={setPage} />
                    )}
                </>
            )}
        </section>
    );
};
