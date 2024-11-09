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

-- Lookup table for genders
CREATE TABLE genders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    gender_name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE titles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    title TEXT NOT NULL
);

-- Lookup table for place types
CREATE TABLE place_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    place_type_name TEXT UNIQUE NOT NULL
);

-- Lookup table for character statuses
CREATE TABLE character_statuses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    character_status_name VARCHAR(50) UNIQUE NOT NULL
);

-- Lookup table for relationship types
CREATE TABLE relationship_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    relationship_name TEXT UNIQUE NOT NULL
);

-- Characters table to store character details
CREATE TABLE characters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    name VARCHAR(100) NOT NULL,
    gender_id INT REFERENCES genders (id) NOT NULL,
    origin_place_id UUID REFERENCES places (id) ON DELETE SET NULL,
    born VARCHAR(100) DEFAULT NULL,
    death VARCHAR(100) DEFAULT NULL,
    father_id UUID REFERENCES characters (id) ON DELETE SET NULL,
    mother_id UUID REFERENCES characters (id) ON DELETE SET NULL,
    spouse_id UUID REFERENCES characters (id) ON DELETE SET NULL,
    actor VARCHAR(100),
    status_id INT REFERENCES character_statuses (id) NOT NULL,
    img_url VARCHAR(255),
    seasons INT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NULL
);

-- Places table to store place details
CREATE TABLE places (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    name VARCHAR(50) NOT NULL,
    type_id UUID REFERENCES place_types (id),
    img_url VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NULL,
    ruler_type VARCHAR(50),
    ruler_id UUID,
    CHECK (ruler_type IN ('house', 'character')),
    CHECK (
        (
            ruler_type IS NOT NULL
            AND ruler_id IS NOT NULL
        )
        OR (
            ruler_type IS NULL
            AND ruler_id IS NULL
        )
    )
);

-- Index for places ruler columns
CREATE INDEX idx_places_ruler ON places (ruler_type, ruler_id);

-- Cultures table to store culture details
CREATE TABLE cultures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    name VARCHAR(50) NOT NULL,
    img_url VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NULL
);

-- Religions table to store religion details
CREATE TABLE religions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    name VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NULL
);

-- Houses table to store house details
CREATE TABLE houses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    name VARCHAR(50) NOT NULL,
    img_url VARCHAR(255),
    sigil TEXT,
    words TEXT,
    seat_id UUID REFERENCES places (id) ON DELETE SET NULL,
    founder_id UUID REFERENCES characters (id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NULL
);

-- Index for houses seat_id column
CREATE INDEX idx_houses_seat_id ON houses (seat_id);

-- Index for houses founder_id column
CREATE INDEX idx_houses_founder_id ON houses (founder_id);

-- Quotes table to store quotes between characters
CREATE TABLE quotes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    from_character_id UUID REFERENCES characters (id) ON DELETE SET NULL,
    to_character_id UUID REFERENCES characters (id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NULL
);

-- Index for quotes from_character_id column
CREATE INDEX idx_quotes_from_character_id ON quotes (from_character_id);

-- Index for quotes to_character_id column
CREATE INDEX idx_quotes_to_character_id ON quotes (to_character_id);

-- Junction table to establish many-to-many relationship between characters and cultures
CREATE TABLE character_cultures (
    character_id UUID REFERENCES characters (id) ON DELETE CASCADE,
    culture_id UUID REFERENCES cultures (id) ON DELETE CASCADE,
    PRIMARY KEY (character_id, culture_id)
);

-- Junction table to establish many-to-many relationship between characters and religions
CREATE TABLE character_religions (
    character_id UUID REFERENCES characters (id) ON DELETE CASCADE,
    religion_id UUID REFERENCES religions (id) ON DELETE CASCADE,
    PRIMARY KEY (character_id, religion_id)
);

-- Junction table to establish many-to-many relationship between characters and houses
CREATE TABLE character_houses (
    character_id UUID REFERENCES characters (id) ON DELETE CASCADE,
    house_id UUID REFERENCES houses (id) ON DELETE CASCADE,
    PRIMARY KEY (character_id, house_id)
);

-- Junction table to establish many-to-many relationship between houses and their vassals
CREATE TABLE house_vassals (
    house_id UUID REFERENCES houses (id) ON DELETE CASCADE,
    vassal_house_id UUID REFERENCES houses (id) ON DELETE CASCADE CHECK (house_id <> vassal_house_id),
    PRIMARY KEY (house_id, vassal_house_id)
);

-- Junction table to establish many-to-many relationship between characters and their relationships
CREATE TABLE character_relationships (
    character_id UUID REFERENCES characters (id) ON DELETE CASCADE,
    related_character_id UUID REFERENCES characters (id) ON DELETE CASCADE CHECK (character_id <> related_character_id),
    relationship_type_id UUID REFERENCES relationship_types (id),
    PRIMARY KEY (
        character_id,
        related_character_id,
        relationship_type_id
    )
);

CREATE TABLE character_titles (
    character_id UUID REFERENCES characters (id) ON DELETE SET NULL,
    title_id UUID REFERENCES titles (id) ON DELETE CASCADE,
    PRIMARY KEY (character_id, title_id)
)
-- Function to validate ruler type and ID
CREATE
OR REPLACE FUNCTION validate_ruler () RETURNS TRIGGER AS $$
BEGIN
    IF NEW.ruler_type = 'house' THEN
        IF NOT EXISTS (SELECT 1 FROM houses WHERE id = NEW.ruler_id) THEN
            RAISE EXCEPTION 'Invalid house ID %', NEW.ruler_id;
        END IF;
    ELSIF NEW.ruler_type = 'character' THEN
        IF NOT EXISTS (SELECT 1 FROM characters WHERE id = NEW.ruler_id) THEN
            RAISE EXCEPTION 'Invalid character ID %', NEW.ruler_id;
        END IF;
    ELSIF NEW.ruler_type IS NOT NULL THEN
        RAISE EXCEPTION 'Invalid ruler_type %', NEW.ruler_type;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to validate ruler before insert or update on places table
CREATE TRIGGER trg_validate_ruler BEFORE INSERT
OR
UPDATE ON places FOR EACH ROW
EXECUTE PROCEDURE validate_ruler ();

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

-- Trigger to update updated_at column before update on characters table
CREATE TRIGGER trg_update_characters_updated_at BEFORE
UPDATE ON characters FOR EACH ROW
EXECUTE PROCEDURE update_updated_at ();

-- Trigger to update updated_at column before update on places table
CREATE TRIGGER trg_update_places_updated_at BEFORE
UPDATE ON places FOR EACH ROW
EXECUTE PROCEDURE update_updated_at ();

-- Trigger to update updated_at column before update on cultures table
CREATE TRIGGER trg_update_cultures_updated_at BEFORE
UPDATE ON cultures FOR EACH ROW
EXECUTE PROCEDURE update_updated_at ();

-- Trigger to update updated_at column before update on religions table
CREATE TRIGGER trg_update_religions_updated_at BEFORE
UPDATE ON religions FOR EACH ROW
EXECUTE PROCEDURE update_updated_at ();

-- Trigger to update updated_at column before update on houses table
CREATE TRIGGER trg_update_houses_updated_at BEFORE
UPDATE ON houses FOR EACH ROW
EXECUTE PROCEDURE update_updated_at ();

-- Trigger to update updated_at column before update on quotes table
CREATE TRIGGER trg_update_quotes_updated_at BEFORE
UPDATE ON quotes FOR EACH ROW
EXECUTE PROCEDURE update_updated_at ();