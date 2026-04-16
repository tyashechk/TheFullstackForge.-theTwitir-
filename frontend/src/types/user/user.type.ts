export interface UserDto {
    id: number;
    username: string;
    email?: string;
    avatarUrl?: string;
    createdAt?: string;
}

export interface SubscriptionDto {
    id: number;
    followingId: number;
    followerId: number;
    createdAt: string;
}