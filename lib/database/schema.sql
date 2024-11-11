-- Enable UUID extension if not already enabled
--UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Types table to store different types of forums
CREATE TABLE types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    type VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Forums table to store forum details
CREATE TABLE forums (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Junction table to establish many-to-many relationship between forums and types
CREATE TABLE forum_types (
    forum_id UUID REFERENCES forums (id) ON DELETE CASCADE,
    type_id UUID REFERENCES types (id) ON DELETE CASCADE,
    PRIMARY KEY (forum_id, type_id)
);

-- Users table to store user details
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    username VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) DEFAULT '',
    last_name VARCHAR(50) DEFAULT '',
    permission INT DEFAULT 0,
    img_url VARCHAR(255) DEFAULT 'https://www.gravatar.com/avatar/',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (username),
    UNIQUE (email)
);

-- Junction table to establish many-to-many relationship between forums and admins
CREATE TABLE forum_admins (
    forum_id UUID REFERENCES forums (id) ON DELETE CASCADE,
    admin_id UUID REFERENCES users (id) ON DELETE CASCADE,
    PRIMARY KEY (forum_id, admin_id)
);

-- Threads table to store thread details within forums
CREATE TABLE threads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    forum_id UUID REFERENCES forums (id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NULL
);

-- Junction table to establish many-to-many relationship between threads and moderators
CREATE TABLE thread_moderators (
    thread_id UUID REFERENCES threads (id) ON DELETE CASCADE,
    admin_id UUID REFERENCES users (id) ON DELETE CASCADE,
    PRIMARY KEY (thread_id, admin_id)
);

-- Posts table to store post details within threads
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    thread_id UUID REFERENCES threads (id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    is_pinned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NULL,
    author_id UUID REFERENCES users (id) NOT NULL
);

-- Comments table to store comments on posts
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    post_id UUID REFERENCES posts (id) ON DELETE CASCADE,
    parent_id UUID REFERENCES comments (id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NULL,
    author_id UUID REFERENCES users (id) NOT NULL
);

-- Unique views table for forums
CREATE TABLE forum_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    forum_id UUID REFERENCES forums (id) ON DELETE CASCADE,
    user_id UUID REFERENCES users (id) ON DELETE CASCADE,
    visitor_id VARCHAR(255),
    unique_view_count INT DEFAULT 0,
    UNIQUE (forum_id, user_id)
);

-- Index for forums created_at column
CREATE INDEX idx_forums_created_at ON forums (created_at);

-- Index for forums updated_at column
CREATE INDEX idx_forums_updated_at ON forums (updated_at);

-- Unique views table for posts
CREATE TABLE post_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    post_id UUID REFERENCES posts (id) ON DELETE CASCADE,
    user_id UUID REFERENCES users (id) ON DELETE CASCADE,
    visitor_id VARCHAR(255),
    unique_view_count INT DEFAULT 0,
    UNIQUE (post_id, user_id)
);

-- Unique views table for comments
CREATE TABLE comment_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    comment_id UUID REFERENCES comments (id) ON DELETE CASCADE,
    user_id UUID REFERENCES users (id) ON DELETE CASCADE,
    visitor_id VARCHAR(255),
    unique_view_count INT DEFAULT 0,
    UNIQUE (comment_id, user_id)
);

-- Post likes table to store likes on posts
CREATE TABLE post_likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    post_id UUID REFERENCES posts (id) ON DELETE CASCADE,
    user_id UUID REFERENCES users (id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, post_id)
);

-- Comment likes table to store likes on comments
CREATE TABLE comment_likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    comment_id UUID REFERENCES comments (id) ON DELETE CASCADE,
    user_id UUID REFERENCES users (id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, comment_id)
);

-- Function to update updated_at column
CREATE
OR REPLACE FUNCTION update_updated_at () RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Trigger to update updated_at column before update on forums table
CREATE TRIGGER trg_update_forums_updated_at BEFORE
UPDATE ON forums FOR EACH ROW
EXECUTE PROCEDURE update_updated_at ();

-- Trigger to update updated_at column before update on users table
CREATE TRIGGER trg_update_users_updated_at BEFORE
UPDATE ON users FOR EACH ROW
EXECUTE PROCEDURE update_updated_at ();

-- Trigger to update updated_at column before update on threads table
CREATE TRIGGER trg_update_threads_updated_at BEFORE
UPDATE ON threads FOR EACH ROW
EXECUTE PROCEDURE update_updated_at ();

-- Trigger to update updated_at column before update on posts table
CREATE TRIGGER trg_update_posts_updated_at BEFORE
UPDATE ON posts FOR EACH ROW
EXECUTE PROCEDURE update_updated_at ();

-- Trigger to update updated_at column before update on comments table
CREATE TRIGGER trg_update_comments_updated_at BEFORE
UPDATE ON comments FOR EACH ROW
EXECUTE PROCEDURE update_updated_at ();
