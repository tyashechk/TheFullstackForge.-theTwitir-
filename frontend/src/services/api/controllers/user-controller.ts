import { api } from "..";
import { UserDto } from "@/types/user/user.type";
import { Pageable } from "@/types/common/pageable.type";

export const userController = {
    getUsers: (pageable: Pageable) => {
        const token = localStorage.getItem('token');
        return api.get(`/users?page=${pageable.page}&size=${pageable.size}&sort=${pageable.sort?.join(",")}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    },

    getUserById: (id: number) => {
        const token = localStorage.getItem('token');
        return api.get<UserDto>(`/users/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    },

    getCurrentUser: () => {
        const token = localStorage.getItem('token');
        return api.get<UserDto>(`/users/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    },

    getSubscriptions: (pageable: Pageable) => {
        const token = localStorage.getItem('token');
        return api.get(`/subscriptions/?page=${pageable.page}&size=${pageable.size}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    },

    subscribe: (userId: number) => {
        const token = localStorage.getItem('token');
        return api.post(`/subscriptions/subscribe/${userId}`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
    },

    unsubscribe: (userId: number) => {
        const token = localStorage.getItem('token');
        return api.post(`/subscriptions/unsubscribe/${userId}`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
    },
};