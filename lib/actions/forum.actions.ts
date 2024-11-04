"use server";

import pool from "../database/config";

export async function createForum(data: {
  title: string;
  description: string;
  type: string;
  subjects: string[];
}) {
  const { title, description, type, subjects } = data;
  const query = `
    INSERT INTO forums (title, description, type, subjects)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const values = [title, description, type, subjects];

  const result = await pool.query(query, values);
  return result.rows[0];
}

export async function getForumById(id: number) {
  const query = `SELECT 
    f.id AS forum_id,
    f.title,
    f.description,
    f.type,
    f.subjects,
    f.created_at,
    
    -- Last 3 posts
    ARRAY(
        SELECT json_build_object(
            'id', p.id,
            'title', p.title,
            'content', p.content,
            'created_at', p.created_at,
            'is_pinned', p.is_pinned
        )
        FROM posts p
        WHERE p.forum_id = f.id
        ORDER BY p.created_at DESC
        LIMIT 3
    ) AS last_3_posts,

    -- Top 3 most viewed posts
    ARRAY(
        SELECT json_build_object(
            'id', p.id,
            'title', p.title,
            'content', p.content,
            'view_count', uv.unique_view_count
        )
        FROM posts p
        LEFT JOIN unique_views uv ON uv.post_id = p.id
        WHERE p.forum_id = f.id
        GROUP BY p.id, uv.unique_view_count
        ORDER BY uv.unique_view_count DESC
        LIMIT 3
    ) AS top_3_most_viewed_posts,

    -- Top 3 most liked posts
    ARRAY(
        SELECT json_build_object(
            'id', p.id,
            'title', p.title,
            'content', p.content,
            'like_count', COUNT(l.user_id)
        )
        FROM posts p
        LEFT JOIN likes l ON l.post_id = p.id
        WHERE p.forum_id = f.id
        GROUP BY p.id
        ORDER BY COUNT(l.user_id) DESC
        LIMIT 3
    ) AS top_3_most_liked_posts,

    -- Total post count for the forum
    (SELECT COUNT(*) FROM posts p WHERE p.forum_id = f.id) AS total_post_count,

    -- Total unique views count for the forum
    (SELECT SUM(uv.unique_view_count) FROM unique_views uv WHERE uv.forum_id = f.id) AS total_unique_views

FROM forums f;`;
  const result = await pool.query(query, [id]);
  return result.rows[0];
}

export async function updateForum(
  id: number,
  data: {
    title?: string;
    description?: string;
    type?: string;
    subjects?: string[];
  }
) {
  const { title, description, type, subjects } = data;
  const query = `
    UPDATE forums
    SET title = COALESCE($1, title),
        description = COALESCE($2, description),
        type = COALESCE($3, type),
        subjects = COALESCE($4, subjects),
        updated_at = NOW()
    WHERE id = $5
    RETURNING *;
  `;
  const values = [title, description, type, subjects, id];

  const result = await pool.query(query, values);
  return result.rows[0];
}

export async function deleteForum(id: number) {
  const query = `DELETE FROM forums WHERE id = $1 RETURNING *;`;
  const result = await pool.query(query, [id]);
  return result.rows[0]; 
}

export async function getForums() {
  const query = `SELECT * FROM forums ORDER BY created_at DESC;`;
  const result = await pool.query(query);
  return result.rows;
}
