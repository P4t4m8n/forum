TRUNCATE TABLE likes,
unique_views,
comments,
posts,
forum_admins,
forums,
users RESTART IDENTITY CASCADE;
