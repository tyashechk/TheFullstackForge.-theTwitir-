import { useEffect, useState } from "react";

import { postsController } from "@/services/api/controllers/post-controller";

import { PostDto } from "@/types/post/post.type";
import { formatTags, parseTags } from "@/utils/post-tags";

interface ShowPostProps {
    postId: number | undefined;
    onSaved?: () => void;
}

const ShowPost = (props: ShowPostProps) => {
    const [post, setPost] = useState<PostDto>();
    const [tagsText, setTagsText] = useState('');

    useEffect(() => { 
        if (props.postId) {
            setPost(undefined);
            setTagsText('');
            postsController.getPostId(props.postId)
                .then((response) => {
                    setPost(response.data);
                    setTagsText(formatTags(response.data.tags));
                })
                .catch((error) => console.log(error));
        } else {
            setPost(undefined);
            setTagsText('');
        }
    }, [props.postId]);

    const changeContentPost = () => {
        if (props.postId && post) {
            postsController.editPost(props.postId, {
                ...post,
                tags: parseTags(tagsText),
            })
                .then((response) => {
                    setPost(response.data);
                    setTagsText(formatTags(response.data.tags));
                    props.onSaved?.();
                })
                .catch((err) => console.log(err));
        }
    }

    return props.postId ?
        <div className="home-page__post-editor">
            <input
                type="text"
                value={post?.content ?? ''}
                onChange={(e) => {
                    if (post) {
                        setPost({ ...post, content: e.target.value });
                    }
                }}
            />
            <input
                type="text"
                value={tagsText}
                onChange={(e) => setTagsText(e.target.value)}
                placeholder="Теги через запятую"
            />
            <button onClick={changeContentPost}>Изменить</button>
        </div>
        :
        null
}

export default ShowPost;
