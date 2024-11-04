-- Insert users
INSERT INTO
    users (
        username,
        email,
        password,
        first_name,
        last_name,
        permission
    )
VALUES
    (
        'john_doe',
        'john@example.com',
        'password123',
        'John',
        'Doe',
        1
    ),
    (
        'jane_smith',
        'jane@example.com',
        'password123',
        'Jane',
        'Smith',
        2
    ),
    (
        'alice_wonder',
        'alice@example.com',
        'password123',
        'Alice',
        'Wonder',
        0
    );

-- Insert forums
INSERT INTO
    forums (title, description, type, subjects)
VALUES
    (
        'General Discussion',
        'A place for general topics and discussions.',
        'public',
        ARRAY['General', 'Discussion']
    ),
    (
        'Tech Talk',
        'Discuss the latest in technology and gadgets.',
        'public',
        ARRAY['Technology', 'Gadgets']
    ),
    (
        'Private Group',
        'A restricted forum for select members.',
        'restricted',
        ARRAY['Private', 'Members Only']
    );

-- Insert forum admins
INSERT INTO
    forum_admins (forum_id, admin_id)
VALUES
    (1, 1), -- John Doe is an admin of General Discussion
    (2, 2), -- Jane Smith is an admin of Tech Talk
    (3, 3);

-- Alice Wonder is an admin of Private Group
-- Insert posts
INSERT INTO
    posts (
        forum_id,
        title,
        content,
        tags,
        is_pinned,
        author_id
    )
VALUES
    (
        1,
        'Welcome to the Forum!',
        'Feel free to introduce yourself and share your thoughts.',
        ARRAY['Welcome', 'Intro'],
        TRUE,
        1
    ),
    (
        1,
        'Forum Rules',
        'Please read and follow the forum rules.',
        ARRAY['Rules', 'Community'],
        TRUE,
        2
    ),
    (
        2,
        'New Gadgets 2024',
        'What new tech are you excited about this year?',
        ARRAY['Technology', 'Gadgets'],
        FALSE,
        2
    ),
    (
        3,
        'Private Group Guidelines',
        'Only approved members are allowed here.',
        ARRAY['Guidelines', 'Private'],
        TRUE,
        3
    );

-- Insert comments
INSERT INTO
    comments (post_id, parent_id, content, author_id)
VALUES
    (1, NULL, 'Thanks for the welcome!', 2), -- Jane Smith comments on the welcome post
    (1, NULL, 'Excited to be here!', 3), -- Alice Wonder comments on the welcome post
    (
        3,
        NULL,
        'I can’t wait to see the latest smartphones!',
        1
    );

-- John Doe comments on New Gadgets 2024
-- Insert unique views
INSERT INTO
    unique_views (
        forum_id,
        post_id,
        comment_id,
        user_id,
        visiter_id,
        unique_view_count
    )
VALUES
    (1, NULL, NULL, 1, 'visitor_123', 1), -- Unique view for forum 1 by visitor 123
    (1, 1, NULL, 2, 'visitor_456', 1), -- Unique view for post 1 by visitor 456
    (2, 3, NULL, 3, 'visitor_789', 2);

-- Unique view for post 3 by visitor 789
-- Insert likes
INSERT INTO
    likes (post_id, comment_id, user_id)
VALUES
    (1, NULL, 2), -- Jane Smith likes the welcome post
    (2, NULL, 1), -- John Doe likes the Forum Rules post
    (3, NULL, 3); -- Alice Wonder likes the New Gadgets 2024 post
