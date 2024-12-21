import { Article } from './Article';
import { useArticles } from '../hooks';

interface Props {
    search: string;
}

export const SearchResults = ({ search }: Props) => {
    const { articles, loading } = useArticles(search);

    return (
        <section className="search-result-list-container">
            {loading ? (
                <span>Loading...</span>
            ) : (
                articles.map((article) => <Article key={article.title} article={article} />)
            )}
        </section>
    );
};
