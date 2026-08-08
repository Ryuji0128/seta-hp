export const REVIEW_MAX_CONTENT = 2000;
export const REVIEW_MAX_NAME = 80;
export const REVIEW_MAX_PAGE_URL = 500;
export const REVIEW_STATUSES = ["open", "resolved"] as const;

export type ReviewStatus = (typeof REVIEW_STATUSES)[number];
