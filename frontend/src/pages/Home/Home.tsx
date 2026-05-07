import { useCallback, useEffect, useState } from 'react';

import './Home.scss';

import { postsController } from '@/services/api/controllers/post-controller';

import { getDefaultPageable } from '@/types/common/pageable.type';
import { PostDto } from '@/types/post/post.type';

import ShowPost from '@/components/home/ShowPost';
import { parseTags } from '@/utils/post-tags';

const Home = () => {
    const [posts, setPosts] = useState<PostDto[]>([]);
    const [contentPost, setContentPost] = useState('');
    const [tagsPost, setTagsPost] = useState('');
    const [tagQuery, setTagQuery] = useState('');
    const [activeTag, setActiveTag] = useState('');
    const [error, setError] = useState('');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [postActiveId, setPostActiveId] = useState<number | undefined>(undefined);

    const fetchPosts = useCallback((nextPage: number, tag: string) => {
        const pageable = { ...getDefaultPageable(), page: nextPage };
        const request = tag.trim()
            ? postsController.searchByTag(tag, pageable)
            : postsController.getPosts(pageable);

        request
            .then(response => {
                setPosts(response.data.content);
                setTotalPages(response.data.totalPages);
                setError('');
            })
            .catch(() => setError('Ошибка загрузки постов'));
    }, []);

    useEffect(() => {
        fetchPosts(page, activeTag);
    }, [activeTag, fetchPosts, page]);

    const createNewPost = () => {
        if (!contentPost.trim()) return;

        postsController.createPost({ content: contentPost, tags: parseTags(tagsPost) })
            .then(() => {
                fetchPosts(page, activeTag);
                setContentPost('');
                setTagsPost('');
                setError('');
            })
            .catch(() => setError('Ошибка создания поста'));
    };

    const searchByTag = () => {
        setPage(0);
        setActiveTag(tagQuery);
    };

    const resetSearch = () => {
        setPage(0);
        setTagQuery('');
        setActiveTag('');
    };

    return (
        <div className="home-page">
            {error && <div className="home-page__error">{error}</div>}

            <div className="home-page__search">
                <input
                    value={tagQuery}
                    onChange={(e) => setTagQuery(e.target.value)}
                    placeholder="Поиск по тегу, например #spring"
                />
                <button onClick={searchByTag}>Найти</button>
                {activeTag && <button onClick={resetSearch}>Сбросить</button>}
            </div>

            {activeTag && (
                <div className="home-page__active-tag">
                    Посты с тегом #{activeTag.replace(/^#/, '').trim()}
                </div>
            )}

            <ul className="home-page__posts">
                {posts.length !== 0 ? (
                    posts.map((item, key) => (
                        <li key={item.id ?? key}>
                            <div>{item.content}</div>
                            {item.tags && item.tags.length > 0 && (
                                <div className="home-page__tags">
                                    {item.tags.map(tag => (
                                        <button
                                            key={tag}
                                            type="button"
                                            onClick={() => {
                                                setTagQuery(tag);
                                                setPage(0);
                                                setActiveTag(tag);
                                            }}
                                        >
                                            #{tag}
                                        </button>
                                    ))}
                                </div>
                            )}
                            <button
                                className="btn-post-edit"
                                disabled={!item.id}
                                onClick={() => item.id && setPostActiveId(item.id)}
                            >
                                Просмотреть / Изменить
                            </button>
                        </li>
                    ))
                ) : (
                    <li>Нет постов</li>
                )}
            </ul>

            <div className="home-page__pagination">
                <button disabled={page === 0} onClick={() => setPage(page - 1)}>
                    Назад
                </button>
                <span>{page + 1} / {Math.max(totalPages, 1)}</span>
                <button disabled={page + 1 >= totalPages} onClick={() => setPage(page + 1)}>
                    Вперёд
                </button>
            </div>

            <div className="home-page__create">
                <input
                    value={contentPost}
                    onChange={(e) => setContentPost(e.target.value)}
                    placeholder="Новый пост с тегами #java #spring"
                />
                <input
                    value={tagsPost}
                    onChange={(e) => setTagsPost(e.target.value)}
                    placeholder="Теги через запятую"
                />
                <button onClick={createNewPost}>Создать</button>
            </div>

            <ShowPost postId={postActiveId} onSaved={() => fetchPosts(page, activeTag)} />
        </div>
    );
};

export default Home;
