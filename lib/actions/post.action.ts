/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";
import { redirect } from "next/navigation";
import pool from "../database/config";
import { sanitizePostForm } from "../sanitize/post.sanitize";
import { validatePostDto } from "../validations/post.validation";

export const getPostById = async (postId: string) => {
  try {
    const query = ` SELECT * FROM posts WHERE id = $1;`;
    const post = await pool.query(query, [postId]);
    return post.rows[0];
  } catch (error) {
    throw error;
  }
};

export const getPosts = async (filter: IPostFilter) => {};

export const savePost = async (formData: FormData) => {
  try {
    const dto = sanitizePostForm(formData);
    const errors = validatePostDto(dto);
    if (
      errors.title ||
      errors.content ||
      errors.authorId ||
      errors.forumId ||
      errors.threadId
    ) {
      throw errors;
    }

    const post = dto.id ? await updatePost(dto) : await createPost(dto);

    redirect(`/forum/${dto.forumId}/thread/${dto.threadId}/post/${post?.id}`);
  } catch (error) {
    throw error;
  }
};

export const createPost = async (dto: IPostDto): Promise<IPost> => {
  try {
    const { title, content, authorId, threadId } = dto;

    const query = `
      INSERT INTO posts (title, content, author_id, thread_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;

    const post = await pool.query(query, [title, content, authorId, threadId]);

    return post.rows[0];
  } catch (error) {
    throw error;
  }
};

export const updatePost = async (dto: IPostDto): Promise<IPost> => {
  try {
    const { title, content, id } = dto;

    const query = `
      UPDATE posts
      SET title = $1, content = $2
      WHERE id = $3
      RETURNING *;
    `;

    const post = await pool.query(query, [title, content, id]);

    return post.rows[0];
  } catch (error) {
    throw error;
  }
};

export const deletePost = async (postId: string) => {};
export async function getPinnedPosts(forumId: string) {
  const query = `
      SELECT json_build_object(
        'id', p.id,
        'title', p.title,
        'content', p.content,
        'createdAt', p.created_at,
        'viewCount', COALESCE(uv.unique_view_count, 0),
        'likeCount', COUNT(l.user_id),
        'lastComment', (
          SELECT json_build_object(
            'id', c.id,
            'content', c.content,
            'createdAt', c.created_at,
            'author', json_build_object(
              'id', cu.id,
              'username', cu.username,
              'imgUrl', cu.img_url
            )
          )
          FROM comments c
          JOIN users cu ON c.author_id = cu.id
          WHERE c.post_id = p.id
          ORDER BY c.created_at DESC
          LIMIT 1
        ),
        'author', json_build_object(
          'id', u.id,
          'username', u.username,
          'imgUrl', u.img_url
        )
      )
      FROM posts p
      LEFT JOIN unique_views uv ON uv.post_id = p.id
      LEFT JOIN likes l ON l.post_id = p.id
      JOIN users u ON p.author_id = u.id
      WHERE p.forum_id = $1 AND p.is_pinned = true
      GROUP BY p.id, u.id, uv.unique_view_count
      ORDER BY p.created_at DESC;
    `;

  const result = await pool.query(query, [forumId]);
  return result.rows.map((row) => row.json_build_object);
}

export async function getNonPinnedPostsPaginated(
  forumId: string,
  page: number = 1,
  pageSize: number = 10
) {
  const offset = (page - 1) * pageSize;
  const query = `
      SELECT json_build_object(
        'id', p.id,
        'title', p.title,
        'content', p.content,
        'createdAt', p.created_at,
        'viewCount', COALESCE(uv.unique_view_count, 0),
        'likeCount', COUNT(l.user_id),
        'lastComment', (
          SELECT json_build_object(
            'id', c.id,
            'content', c.content,
            'createdAt', c.created_at,
            'author', json_build_object(
              'id', cu.id,
              'username', cu.username,
              'imgUrl', cu.img_url
            )
          )
          FROM comments c
          JOIN users cu ON c.author_id = cu.id
          WHERE c.post_id = p.id
          ORDER BY c.created_at DESC
          LIMIT 1
        ),
        'author', json_build_object(
          'id', u.id,
          'username', u.username,
          'imgUrl', u.img_url
        )
      )
      FROM posts p
      LEFT JOIN unique_views uv ON uv.post_id = p.id
      LEFT JOIN likes l ON l.post_id = p.id
      JOIN users u ON p.author_id = u.id
      WHERE p.forum_id = $1 AND p.is_pinned = false
      GROUP BY p.id, u.id, uv.unique_view_count
      ORDER BY p.created_at DESC
      LIMIT $2 OFFSET $3;
    `;

  const result = await pool.query(query, [forumId, pageSize, offset]);
  return result.rows.map((row) => row.json_build_object);
}
