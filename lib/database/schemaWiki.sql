-- Lookup table for genders
CREATE TABLE genders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    gender_name VARCHAR(50) UNIQUE NOT NULL
);
-- Lookup table for titles
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
-- Places table to store place details
CREATE TABLE places (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    type_id UUID REFERENCES place_types (id),
    name VARCHAR(50) NOT NULL,
    img_url VARCHAR(255),
    ruler_type VARCHAR(50) CHECK (ruler_type IN ('house', 'character')) DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NULL
);
-- Characters table to store character details
CREATE TABLE characters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    gender_id UUID REFERENCES genders (id) NOT NULL,
    status_id UUID REFERENCES character_statuses (id) NOT NULL,
    origin_place_id UUID REFERENCES places (id) ON DELETE SET NULL,
    name VARCHAR(100) NOT NULL,
    born VARCHAR(100) DEFAULT NULL,
    death VARCHAR(100) DEFAULT NULL,
    actor VARCHAR(100),
    img_url VARCHAR(255),
    seasons INT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NULL
);
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
    seat_id UUID REFERENCES places (id) ON DELETE SET NULL,
    founder_id UUID REFERENCES characters (id) ON DELETE SET NULL,
    name VARCHAR(50) NOT NULL,
    img_url VARCHAR(255),
    sigil TEXT,
    words TEXT,
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
    quote TEXT NOT NULL,
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
-- Junction table to establish many-to-many relationship between places and houses
CREATE TABLE places_ruler_house (
    place_id UUID REFERENCES places (id) ON DELETE CASCADE,
    house_id UUID REFERENCES houses (id) ON DELETE CASCADE,
    PRIMARY KEY (place_id, house_id)
);
-- Junction table to establish many-to-many relationship between places and characters
CREATE TABLE places_ruler_character (
    place_id UUID REFERENCES places (id) ON DELETE CASCADE,
    character_id UUID REFERENCES characters (id) ON DELETE CASCADE,
    PRIMARY KEY (place_id, character_id)
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
);
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