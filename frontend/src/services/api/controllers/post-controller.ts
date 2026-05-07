import { api } from "..";
import { PostDto } from "@/types/post/post.type";
import { Pageable } from "@/types/common/pageable.type";
import { PageableObject } from "@/types/page/page.types";

export const postsController = {
    getPosts: (pageable: Pageable) => {
        return api.get<PageableObject<PostDto>>(`/posts/?page=${pageable.page}&size=${pageable.size}&sort=${pageable.sort?.join(",")}`);
    },

    searchByTag: (tag: string, pageable: Pageable) => {
        const normalizedTag = tag.replace(/^#/, '').trim();
        return api.get<PageableObject<PostDto>>(`/posts/search?tag=${encodeURIComponent(normalizedTag)}&page=${pageable.page}&size=${pageable.size}&sort=${pageable.sort?.join(",")}`);
    },

    getPostId: (id: number) => {
        return api.get<PostDto>(`/posts/${id}`)
    },

    editPost: (id: number, data: PostDto) => {
        return api.patch<PostDto>(`/posts/${id}`, data);
    },

    createPost: (data: PostDto) => {
        return api.post<PostDto>(`/posts/`, data);
    }
}
