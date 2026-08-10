export const REVIEW_MAX_CONTENT = 2000;
export const REVIEW_MAX_NAME = 80;
// DB列 ReviewComment.pageUrl は VARCHAR(191)。超過値の insert 時 500 を避けるため列幅に合わせる。
export const REVIEW_MAX_PAGE_URL = 191;
export const REVIEW_STATUSES = ["open", "resolved"] as const;

export type ReviewStatus = (typeof REVIEW_STATUSES)[number];
