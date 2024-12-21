import DOMPurify from 'dompurify';
import { IArticle } from '../models';

interface Props {
    article: IArticle;
}

export const Article = ({ article }: Props) => {
    const url = `https://en.wikipedia.org/wiki/${article.title}`;

    return (
        <article className="search-result-item">
            <a href={url} target="_blank" className="search-result-item__link-group">
                <span className="search-result-item__title">{article.title}</span>
                <br />
                <span className="search-result-item__url">{url}</span>
            </a>
            <p
                className="search-result-item__description"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.description) }}
            ></p>
        </article>
    );
};
