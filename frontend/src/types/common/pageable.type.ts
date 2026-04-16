export interface Pageable {
    page: number;
    size: number;
    sort?: string[];
}

export const getDefaultPageable = (): Pageable => ({
    page: 0,
    size: 10,
    sort: ['id']
});

export interface Page<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}