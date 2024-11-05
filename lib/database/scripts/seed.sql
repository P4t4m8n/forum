/* cSpell:disable */

-- Insert demo users
INSERT INTO users (id, username, email, password, first_name, last_name, permission)
VALUES 
    (uuid_generate_v4(), 'johndoe', 'johndoe@example.com', 'password', 'John', 'Doe', 1),
    (uuid_generate_v4(), 'janedoe', 'janedoe@example.com', 'password', 'Jane', 'Doe', 1),
    (uuid_generate_v4(), 'bobsmith', 'bobsmith@example.com', 'password', 'Bob', 'Smith', 0),
    (uuid_generate_v4(), 'alicesmith', 'alicesmith@example.com', 'password', 'Alice', 'Smith', 0);

-- Insert demo forums
INSERT INTO forums (id, title, description, type, subjects)
VALUES 
    (uuid_generate_v4(), 'Tech Forum', 'A forum about technology', 'public', '{Technology, Gadgets}'),
    (uuid_generate_v4(), 'Cooking Forum', 'A place to discuss recipes and cooking tips', 'public', '{Cooking, Recipes}'),
    (uuid_generate_v4(), 'Travel Forum', 'Share your travel experiences and tips', 'public', '{Travel, Adventure}');

-- Insert forum admins (assigning each user as an admin to different forums)
INSERT INTO forum_admins (forum_id, admin_id)
SELECT f.id, u.id
FROM forums f
JOIN users u ON u.username IN ('johndoe', 'janedoe')
LIMIT 4;

-- Insert demo posts in each forum
INSERT INTO posts (id, forum_id, title, content, author_id)
VALUES 
    (uuid_generate_v4(), (SELECT id FROM forums WHERE title = 'Tech Forum'), 'Best Laptops 2024', 'Lets discuss the best laptops of 2024.', (SELECT id FROM users WHERE username = 'johndoe')),
    (uuid_generate_v4(), (SELECT id FROM forums WHERE title = 'Tech Forum'), 'Future of AI', 'What do you think about AIs role in the future?', (SELECT id FROM users WHERE username = 'janedoe')),
    (uuid_generate_v4(), (SELECT id FROM forums WHERE title = 'Cooking Forum'), 'Best Pasta Recipes', 'Share your best pasta recipes!', (SELECT id FROM users WHERE username = 'bobsmith')),
    (uuid_generate_v4(), (SELECT id FROM forums WHERE title = 'Travel Forum'), 'Top Destinations for 2024', 'Where should we travel in 2024?', (SELECT id FROM users WHERE username = 'alicesmith'));

-- Insert comments for each post
INSERT INTO comments (id, post_id, content, author_id)
VALUES 
    (uuid_generate_v4(), (SELECT id FROM posts WHERE title = 'Best Laptops 2024'), 'I think the new MacBook Pro is great!', (SELECT id FROM users WHERE username = 'janedoe')),
    (uuid_generate_v4(), (SELECT id FROM posts WHERE title = 'Future of AI'), 'AI will change everything, but there are risks.', (SELECT id FROM users WHERE username = 'bobsmith')),
    (uuid_generate_v4(), (SELECT id FROM posts WHERE title = 'Best Pasta Recipes'), 'I love carbonara!', (SELECT id FROM users WHERE username = 'alicesmith')),
    (uuid_generate_v4(), (SELECT id FROM posts WHERE title = 'Top Destinations for 2024'), 'Paris is always a good idea!', (SELECT id FROM users WHERE username = 'johndoe'));

-- Insert likes for posts and comments
INSERT INTO likes (id, post_id, user_id)
VALUES 
    (uuid_generate_v4(), (SELECT id FROM posts WHERE title = 'Best Laptops 2024'), (SELECT id FROM users WHERE username = 'alicesmith')),
    (uuid_generate_v4(), (SELECT id FROM posts WHERE title = 'Future of AI'), (SELECT id FROM users WHERE username = 'bobsmith')),
    (uuid_generate_v4(), (SELECT id FROM posts WHERE title = 'Best Pasta Recipes'), (SELECT id FROM users WHERE username = 'johndoe'));

INSERT INTO likes (id, comment_id, user_id)
VALUES 
    (uuid_generate_v4(), (SELECT id FROM comments WHERE content = 'I think the new MacBook Pro is great!'), (SELECT id FROM users WHERE username = 'bobsmith')),
    (uuid_generate_v4(), (SELECT id FROM comments WHERE content = 'Paris is always a good idea!'), (SELECT id FROM users WHERE username = 'alicesmith'));

-- Insert unique views for posts
INSERT INTO unique_views (id, forum_id, post_id, user_id, unique_view_count)
VALUES 
    (uuid_generate_v4(), (SELECT id FROM forums WHERE title = 'Tech Forum'), (SELECT id FROM posts WHERE title = 'Best Laptops 2024'), (SELECT id FROM users WHERE username = 'bobsmith'), 5),
    (uuid_generate_v4(), (SELECT id FROM forums WHERE title = 'Tech Forum'), (SELECT id FROM posts WHERE title = 'Future of AI'), (SELECT id FROM users WHERE username = 'alicesmith'), 3),
    (uuid_generate_v4(), (SELECT id FROM forums WHERE title = 'Cooking Forum'), (SELECT id FROM posts WHERE title = 'Best Pasta Recipes'), (SELECT id FROM users WHERE username = 'janedoe'), 7);

-- Insert unique views for comments
INSERT INTO unique_views (id, comment_id, user_id, unique_view_count)
VALUES 
    (uuid_generate_v4(), (SELECT id FROM comments WHERE content = 'I think the new MacBook Pro is great!'), (SELECT id FROM users WHERE username = 'alicesmith'), 2),
    (uuid_generate_v4(), (SELECT id FROM comments WHERE content = 'Paris is always a good idea!'), (SELECT id FROM users WHERE username = 'bobsmith'), 1);
