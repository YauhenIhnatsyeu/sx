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
                    {articles.length > 0 && (
                        <Pagination page={page} count={Math.floor(totalResults / PAGE_SIZE)} onChange={setPage} />
                    )}
                </>
            )}
        </section>
    );
};
