-- Migration: 20241104T18350_migration.sql
-- Up migration
BEGIN;

DROP TABLE IF EXISTS likes;

CREATE TABLE likes (
    id SERIAL PRIMARY KEY,
    post_id INT REFERENCES posts (id) ON DELETE CASCADE,
    comment_id INT REFERENCES comments (id) ON DELETE CASCADE,
    user_id INT REFERENCES users (id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (post_id, comment_id, user_id),
    CHECK (
        (
            post_id IS NOT NULL
            AND comment_id IS NULL
        )
        OR (
            post_id IS NULL
            AND comment_id IS NOT NULL
        )
    )
);

COMMIT;
