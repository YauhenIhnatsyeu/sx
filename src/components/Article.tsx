import { IArticle } from '../models';

interface Props {
    article: IArticle;
}

export const Article = ({ article }: Props) => {
    return (
        <article>
            <h6>{article.title}</h6>
            <p>{article.description}</p>
        </article>
    );
};
