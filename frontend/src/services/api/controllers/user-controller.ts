import { api } from "..";
import { UserDto } from "@/types/user/user.type";
import { Pageable } from "@/types/common/pageable.type";
import { PageableObject } from "@/types/page/page.types";

export const userController = {
    getUsers: (pageable: Pageable) => {
        return api.get<PageableObject<UserDto>>(`/users?page=${pageable.page}&size=${pageable.size}&sort=${pageable.sort?.join(",")}`);
    },

    getUserById: (id: number) => {
        return api.get<UserDto>(`/users/${id}`);
    },

    getCurrentUser: () => {
        return api.get<UserDto>(`/users/me`);
    },

    getSubscriptions: (pageable: Pageable) => {
        return api.get(`/subscriptions?page=${pageable.page}&size=${pageable.size}`);
    },

    subscribe: (userId: number) => {
        return api.post(`/subscriptions/subscribe/${userId}`, {});
    },

    unsubscribe: (userId: number) => {
        return api.delete(`/subscriptions/unsubscribe/${userId}`);
    },
};
