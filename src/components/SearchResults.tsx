import { useMemo } from 'react';
import { useArticles } from '../hooks';
import { Article } from './Article';

interface Props {
    search: string;
}

export const SearchResults = ({ search }: Props) => {
    const articles = useArticles();
    const searchArticles = useMemo(
        () => (search ? articles.filter((article) => article.title.toLowerCase().includes(search.toLowerCase())) : []),
        [articles, search],
    );

    return (
        <section className="search-result-list-container">
            {searchArticles.map((article) => (
                <Article key={article.title} article={article} />
            ))}
        </section>
    );
};
