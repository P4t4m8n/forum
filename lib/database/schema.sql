--UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Forums Table
CREATE TABLE forums (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    title VARCHAR(255) DEFAULT 'New Forum',
    description TEXT DEFAULT 'New Forum Description',
    type VARCHAR(50) NOT NULL CHECK (type IN ('public', 'private', 'restricted')),
    subjects TEXT[] NOT NULL DEFAULT '{General}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    username VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL CHECK (
        email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z.-]+\.[A-Za-z]{2,}$'
    ),
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) DEFAULT '',
    last_name VARCHAR(50) DEFAULT '',
    permission INT DEFAULT 0,
    img_url VARCHAR(255) DEFAULT 'https://www.gravatar.com/avatar/',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (username),
    UNIQUE (email)
);

-- Forum Admins (Junction Table for Many-to-Many Relationship)
CREATE TABLE forum_admins (
    forum_id UUID REFERENCES forums (id) ON DELETE CASCADE,
    admin_id UUID REFERENCES users (id) ON DELETE CASCADE,
    PRIMARY KEY (forum_id, admin_id)
);

-- Posts Table
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    forum_id UUID REFERENCES forums (id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    tags TEXT[] DEFAULT '{other}',
    is_pinned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NULL,
    author_id UUID REFERENCES users (id) NOT NULL
);

-- Comments Table
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    post_id UUID REFERENCES posts (id) ON DELETE CASCADE,
    parent_id UUID REFERENCES comments (id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NULL,
    author_id UUID REFERENCES users (id) NOT NULL
);

-- Unique Views Table
CREATE TABLE unique_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    forum_id UUID REFERENCES forums (id) ON DELETE CASCADE,
    post_id UUID REFERENCES posts (id) ON DELETE CASCADE,
    comment_id UUID REFERENCES comments (id) ON DELETE CASCADE,
    user_id UUID REFERENCES users (id) ON DELETE CASCADE,
    visiter_id VARCHAR(255),
    unique_view_count INT DEFAULT 0,
    UNIQUE (forum_id, post_id, comment_id, user_id)
);

-- Likes Table
CREATE TABLE likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    post_id UUID REFERENCES posts (id) ON DELETE CASCADE,
    comment_id UUID REFERENCES comments (id) ON DELETE CASCADE,
    user_id UUID REFERENCES users (id) ON DELETE CASCADE,
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
