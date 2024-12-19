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
        <section>
            {searchArticles.map((article) => (
                <Article article={article} />
            ))}
        </section>
    );
};
