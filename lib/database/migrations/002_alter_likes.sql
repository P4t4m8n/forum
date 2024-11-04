-- Step 1: Drop the existing composite primary key constraint
ALTER TABLE likes
DROP CONSTRAINT likes_pkey;

-- Step 2: Add the new 'id' column as a primary key
ALTER TABLE likes
ADD COLUMN id SERIAL PRIMARY KEY;

-- Step 3: Add a unique constraint to ensure uniqueness of (post_id, comment_id, user_id)
ALTER TABLE likes
ADD CONSTRAINT unique_like_per_post_comment_user UNIQUE (post_id, comment_id, user_id);
