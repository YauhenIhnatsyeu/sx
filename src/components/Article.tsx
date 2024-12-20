import { IArticle } from '../models';

interface Props {
    article: IArticle;
}

export const Article = ({ article }: Props) => {
    return (
        <article className="search-result-item">
            <a
                className="search-result-item__title"
                href={`https://www.google.com/search?q=${article.title}`}
                target="_blank"
            >
                {article.title}
            </a>
            <p className="search-result-item_description">{article.description}</p>
        </article>
    );
};
