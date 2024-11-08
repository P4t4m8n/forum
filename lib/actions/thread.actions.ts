/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import pool from "../database/config";

export const getThreads = async (filter: IThreadFilter) => {};

export const getThreadById = async (id: string): Promise<IThread> => {
  const query = `
  SELECT
    t.id,
    t.title,
    t.description,
    forum_id AS "forumId",
    t.created_at AS "createdAt",
    ARRAY(
      SELECT json_build_object(
        'id', u.id,
        'username', u.username,
        'imgUrl', u.img_url
      )
      FROM thread_moderators tm
      JOIN users u ON tm.admin_id = u.id 
      WHERE tm.thread_id = t.id
    ) AS admins,
    ARRAY(
      SELECT json_build_object(
        'id', p.id,
        'title', p.title,
        'content', p.content,
        'createdAt', p.created_at,
        'viewCount', COALESCE(pv.view_count, 0),
        'likeCount', COALESCE(pl.like_count, 0),
        'author', json_build_object(
          'id', u.id,
          'username', u.username,
          'imgUrl', u.img_url
        )
      )
      FROM posts p
      LEFT JOIN (
        SELECT post_id, SUM(unique_view_count) AS view_count
        FROM post_views
        GROUP BY post_id
      ) pv ON pv.post_id = p.id
      LEFT JOIN (
        SELECT post_id, COUNT(*) AS like_count
        FROM post_likes
        GROUP BY post_id
      ) pl ON pl.post_id = p.id
      JOIN users u ON p.author_id = u.id
      WHERE p.thread_id = t.id
      ORDER BY p.created_at DESC
    ) AS posts
  FROM threads t
  WHERE t.id = $1
`;

  const thread = await pool.query(query, [id]);

  return thread.rows[0];
};

export const saveThread = async (formData: FormData) => {};

export const removeThread = async (id: string): Promise<void> => {};

export const createThread = async (dto: IThreadDto) => {};

export const updateThread = async (dto: IThreadDto) => {};
