const TAG_SPLIT_PATTERN = /[,\s]+/;

export const normalizeTag = (tag: string) => tag.replace(/^#/, '').trim().toLowerCase();

export const parseTags = (value: string) =>
    value
        .split(TAG_SPLIT_PATTERN)
        .map(normalizeTag)
        .filter(Boolean)
        .filter((tag, index, tags) => tags.indexOf(tag) === index);

export const formatTags = (tags?: string[]) => tags?.map(normalizeTag).filter(Boolean).join(', ') ?? '';
