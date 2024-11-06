INSERT INTO
    types (type)
VALUES
    ('resource sharing'),
    ('moderator'),
    ('tech support'),
    ('discussions'),
    ('admin');

-- Insert demo users
INSERT INTO
    users (
        username,
        email,
        password_hash,
        first_name,
        last_name,
        permission,
        img_url
    )
VALUES
    (
        'johndoe',
        'johndoe@example.com',
        'password', -- Replace with hashed password in production
        'John',
        'Doe',
        1,
        'https://res.cloudinary.com/dpnevk8db/image/upload/v1727205327/igor-karimov-lPLqDlnhxbE-unsplash_hfnaer.jpg'
    ),
    (
        'janedoe',
        'janedoe@example.com',
        'password', -- Replace with hashed password in production
        'Jane',
        'Doe',
        1,
        'https://res.cloudinary.com/dpnevk8db/image/upload/v1727205327/igor-karimov-lPLqDlnhxbE-unsplash_hfnaer.jpg'
    ),
    (
        'bobsmith',
        'bobsmith@example.com',
        'password', -- Replace with hashed password in production
        'Bob',
        'Smith',
        0,
        'https://res.cloudinary.com/dpnevk8db/image/upload/v1727205327/igor-karimov-lPLqDlnhxbE-unsplash_hfnaer.jpg'
    ),
    (
        'alicesmith',
        'alicesmith@example.com',
        'password', -- Replace with hashed password in production
        'Alice',
        'Smith',
        0,
        'https://res.cloudinary.com/dpnevk8db/image/upload/v1727205327/igor-karimov-lPLqDlnhxbE-unsplash_hfnaer.jpg'
    );

-- Insert Forums
INSERT INTO
    forums (title, description, created_at, updated_at)
VALUES
    (
        'Lore and History',
        'Discussion about the lore and history of the Game of Thrones universe.',
        NOW(),
        NOW()
    ),
    (
        'TV Show',
        'Discussion about the Game of Thrones TV show.',
        NOW(),
        NOW()
    ),
    (
        'Books',
        'Discussion about the Game of Thrones books.',
        NOW(),
        NOW()
    ),
    (
        'Fan Creations',
        'Share and discuss fan-made creations.',
        NOW(),
        NOW()
    ),
    (
        'Quizzes and Challenges',
        'Participate in quizzes and challenges.',
        NOW(),
        NOW()
    );

-- Assign 'johndoe' as admin to all forums
INSERT INTO
    forum_admins (forum_id, admin_id)
SELECT
    f.id,
    u.id
FROM
    forums f,
    users u
WHERE
    u.username = 'johndoe';

-- Insert Threads
-- Threads Data
WITH
    threads_data AS (
        SELECT
            'Lore and History' AS forum_title,
            'Characters' AS thread_title,
            'Discuss characters from the series.' AS description
        UNION ALL
        SELECT
            'Lore and History',
            'Events',
            'Discuss major events in the lore.'
        UNION ALL
        SELECT
            'Lore and History',
            'Factions',
            'Discuss the different factions and houses.'
        UNION ALL
        SELECT
            'TV Show',
            'Episode Discussions',
            'Discuss individual episodes.'
        UNION ALL
        SELECT
            'TV Show',
            'Cast and Crew',
            'Talk about the actors and production team.'
        UNION ALL
        SELECT
            'TV Show',
            'Speculations',
            'Share your speculations about the show.'
        UNION ALL
        SELECT
            'Books',
            'Book Series Discussion',
            'General discussion about the book series.'
        UNION ALL
        SELECT
            'Books',
            'Theories',
            'Share and discuss theories.'
        UNION ALL
        SELECT
            'Books',
            'Winds of Winter',
            'Discuss the upcoming book.'
        UNION ALL
        SELECT
            'Fan Creations',
            'Art and Videos',
            'Share your artwork and videos.'
        UNION ALL
        SELECT
            'Fan Creations',
            'Fanfiction',
            'Share and discuss fanfiction.'
        UNION ALL
        SELECT
            'Fan Creations',
            'Projects',
            'Collaborate on fan projects.'
        UNION ALL
        SELECT
            'Quizzes and Challenges',
            'Trivia Games',
            'Participate in trivia games.'
        UNION ALL
        SELECT
            'Quizzes and Challenges',
            'User-Created Quizzes',
            'Share your own quizzes.'
    )
INSERT INTO
    threads (
        forum_id,
        title,
        description,
        created_at,
        updated_at
    )
SELECT
    f.id,
    td.thread_title,
    td.description,
    NOW(),
    NOW()
FROM
    threads_data td
    JOIN forums f ON f.title = td.forum_title;

-- Assign 'janedoe' as moderator to all threads in 'Lore and History'
INSERT INTO
    thread_moderators (thread_id, admin_id)
SELECT
    t.id,
    u.id
FROM
    threads t
    JOIN forums f ON t.forum_id = f.id
    JOIN users u ON u.username = 'janedoe'
WHERE
    f.title = 'Lore and History';

-- Insert Posts
-- Posts Data
WITH
    posts_data AS (
        SELECT
            'Characters' AS thread_title,
            'Favorite Characters' AS post_title,
            'Who are your favorite characters and why?' AS content,
            'bobsmith' AS author
        UNION ALL
        SELECT
            'Episode Discussions',
            'Season Finale Thoughts',
            'Let''s discuss the season finale!',
            'alicesmith'
    )
INSERT INTO
    posts (
        thread_id,
        title,
        content,
        created_at,
        updated_at,
        author_id
    )
SELECT
    t.id,
    pd.post_title,
    pd.content,
    NOW(),
    NOW(),
    u.id
FROM
    posts_data pd
    JOIN threads t ON t.title = pd.thread_title
    JOIN users u ON u.username = pd.author;

-- Insert Comments
-- First, insert root comments (parent_id IS NULL)
INSERT INTO
    comments (
        post_id,
        parent_id,
        content,
        created_at,
        updated_at,
        author_id
    )
SELECT
    p.id,
    NULL,
    'I really like Tyrion because of his wit.',
    NOW(),
    NOW(),
    u.id
FROM
    posts p
    JOIN users u ON u.username = 'alicesmith'
WHERE
    p.title = 'Favorite Characters';

-- Then, insert replies
INSERT INTO
    comments (
        post_id,
        parent_id,
        content,
        created_at,
        updated_at,
        author_id
    )
SELECT
    p.id,
    c.id,
    'Yes, Tyrion is amazing! His dialogues are the best.',
    NOW(),
    NOW(),
    u.id
FROM
    posts p
    JOIN comments c ON c.post_id = p.id
    AND c.content = 'I really like Tyrion because of his wit.'
    JOIN users u ON u.username = 'bobsmith'
WHERE
    p.title = 'Favorite Characters';

-- Insert Post Likes
-- 'bobsmith' likes 'Season Finale Thoughts' Post
INSERT INTO
    post_likes (post_id, user_id, created_at)
SELECT
    p.id,
    u.id,
    NOW()
FROM
    posts p
    JOIN users u ON u.username = 'bobsmith'
WHERE
    p.title = 'Season Finale Thoughts';

-- 'alicesmith' likes 'Favorite Characters' Post
INSERT INTO
    post_likes (post_id, user_id, created_at)
SELECT
    p.id,
    u.id,
    NOW()
FROM
    posts p
    JOIN users u ON u.username = 'alicesmith'
WHERE
    p.title = 'Favorite Characters';

-- Insert Post Views
-- 'bobsmith' views 'Favorite Characters' Post
INSERT INTO
    post_views (post_id, user_id, visitor_id, unique_view_count)
SELECT
    p.id,
    u.id,
    NULL,
    1
FROM
    posts p
    JOIN users u ON u.username = 'bobsmith'
WHERE
    p.title = 'Favorite Characters';

-- 'alicesmith' views 'Season Finale Thoughts' Post
INSERT INTO
    post_views (post_id, user_id, visitor_id, unique_view_count)
SELECT
    p.id,
    u.id,
    NULL,
    1
FROM
    posts p
    JOIN users u ON u.username = 'alicesmith'
WHERE
    p.title = 'Season Finale Thoughts';
