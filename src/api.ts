import { DummyDTO } from './models';

export const fetchPosts = async (search: string) => {
    const response = await fetch(`https://dummyjson.com/posts/search?q=${search.toLowerCase()}&limit=0`);

    return (await response.json()) as DummyDTO;
};
