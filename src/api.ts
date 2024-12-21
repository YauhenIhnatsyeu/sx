import { PAGE_SIZE } from './constants';
import { IArticle, WikiDTO } from './models';

export const fetchAutocomplete = async (search: string, signal?: AbortSignal) => {
    const response = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${search}*&format=json&origin=*&srlimit=100&srsort=just_match`,
        { signal },
    );

    const data = (await response.json()) as WikiDTO;

    return {
        articles: data.query.search
            .map((s) => ({ id: s.pageid, title: s.title, description: s.snippet }) as IArticle)
            .filter((article) => article.title.toLowerCase().startsWith(search.toLowerCase())),
    };
};

export const fetchArticles = async (search: string, page: number, signal?: AbortSignal) => {
    const response = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${search}*&format=json&origin=*&srsort=just_match&srlimit=${PAGE_SIZE}&sroffset=${(page - 1) * PAGE_SIZE}`,
        { signal },
    );

    const data = (await response.json()) as WikiDTO;

    return {
        articles: data.query.search.map((s) => ({ id: s.pageid, title: s.title, description: s.snippet }) as IArticle),
        totalResultss: data.query.searchinfo.totalhits,
    };
};
