-- Forums Table
CREATE TABLE forums (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) DEFAULT 'New Forum',
    description TEXT DEFAULT 'New Forum Description',
    type VARCHAR(50) NOT NULL CHECK (type IN ('public', 'private', 'restricted')),
    subjects TEXT[] NOT NULL DEFAULT '{General}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Connection Table to store forum admins (many-to-many relationship)
CREATE TABLE forum_admins (
    forum_id INT REFERENCES forums (id) ON DELETE CASCADE,
    admin_id INT REFERENCES users (id) ON DELETE CASCADE,
    PRIMARY KEY (forum_id, admin_id)
);

-- Posts (many-to-one relationship with forums)
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    forum_id INT REFERENCES forums (id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    tags TEXT[] DEFAULT '{other}',
    is_pinned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NULL,
    author_id INT REFERENCES users (id) NOT NULL
);

-- Comments (many-to-one relationship with posts)
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    post_id INT REFERENCES posts (id) ON DELETE CASCADE,
    parent_id INT REFERENCES comments (id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NULL,
    author_id INT REFERENCES users (id) NOT NULL
);

-- Unique Views Table
CREATE TABLE unique_views (
    id SERIAL PRIMARY KEY,
    forum_id INT REFERENCES forums (id) ON DELETE CASCADE,
    post_id INT REFERENCES posts (id) ON DELETE CASCADE,
    comment_id INT REFERENCES comments (id) ON DELETE CASCADE,
    user_id INT REFERENCES users (id) ON DELETE CASCADE,
    visiter_id VARCHAR(255),
    unique_view_count INT DEFAULT 0,
    UNIQUE (forum_id, post_id, comment_id, user_id)
);

-- User Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL CHECK (
        email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    ),
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) DEFAULT '',
    last_name VARCHAR(50) DEFAULT '',
    permission INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (username),
    UNIQUE (email)
);

-- Likes Table
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

-- Indexes for better performance
CREATE INDEX idx_forums_created_at ON forums (created_at);

CREATE INDEX idx_forums_updated_at ON forums (updated_at);