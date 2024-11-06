"use server";

import { redirect } from "next/navigation";
import pool from "../database/config";
import { sanitizeForumForm } from "../sanitize/forum.sanitize";
import { validateForumDto } from "../validations/forum.validation";

export const saveForum = async (formData: FormData) => {
  const dto = sanitizeForumForm(formData);

  const errors = validateForumDto(dto);
  if (errors.title || errors.description || errors.type || errors.admins) {
    throw errors;
  }
  console.log("dto:", dto);

  const forum = dto?.id ? await updateForum(dto) : await createForum(dto);
  console.log("forum:", forum);

  redirect(`/forum/${forum.id}`);
};

export async function createForum(dto: IForumDto) {
  const { title, description, type, admins } = dto;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const forumQuery = `
      INSERT INTO forums (title, description, type)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const forumValues = [title, description, type];
    const forumResult = await client.query(forumQuery, forumValues);
    const forum = forumResult.rows[0];
    console.log("forum:", forum);

    if (admins && admins.length > 0) {
      const adminInsertValues: string[] = [];
      const adminInsertPlaceholders = admins
        .map((adminId, idx) => {
          adminInsertValues.push(forum.id, adminId);
          const param1 = idx * 2 + 1;
          const param2 = idx * 2 + 2;
          return `($${param1}, $${param2})`;
        })
        .join(", ");

      const adminQuery = `
        INSERT INTO forum_admins (forum_id, admin_id)
        VALUES ${adminInsertPlaceholders};
      `;
      await client.query(adminQuery, adminInsertValues);
    }

    await client.query("COMMIT");
    console.info("Forum created with admins successfully.");
    return forum;
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error creating forum:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function updateForum(dto: IForumDto) {
  const { title, description, type, admins, id } = dto;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const forumQuery = `
      UPDATE forums
      SET title = COALESCE($1, title),
          description = COALESCE($2, description),
          type = COALESCE($3, type),
          updated_at = NOW()
      WHERE id = $5
      RETURNING *;
    `;
    const forumValues = [title, description, type, id];
    const forumResult = await client.query(forumQuery, forumValues);
    const forum = forumResult.rows[0];

    if (admins) {
      const deleteQuery = `
        DELETE FROM forum_admins
        WHERE forum_id = $1;
      `;
      await client.query(deleteQuery, [id]);

      if (admins.length > 0) {
        const adminInsertValues: string[] = [];
        const adminInsertPlaceholders = admins
          .map((adminId, idx) => {
            adminInsertValues.push(id!, adminId);
            const param1 = idx * 2 + 1;
            const param2 = idx * 2 + 2;
            return `($${param1}, $${param2})`;
          })
          .join(", ");

        const adminQuery = `
          INSERT INTO forum_admins (forum_id, admin_id)
          VALUES ${adminInsertPlaceholders};
        `;
        await client.query(adminQuery, adminInsertValues);
      }
    }

    await client.query("COMMIT");
    console.info("Forum updated with admins successfully.");
    return forum;
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error updating forum:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function getForumById(id: string) {
  const query = `
    SELECT 
      f.id,
      f.title,
      f.description,
      f.type,
      f.created_at AS "createdAt",
      ARRAY(
        SELECT json_build_object(
          'id', u.id,
          'username', u.username,
          'imgUrl', u.img_url
        )
        FROM forum_admins fa
        JOIN users u ON fa.admin_id = u.id
        WHERE fa.forum_id = f.id
      ) AS admins
    FROM forums f
    WHERE f.id = $1;
  `;

  const result = await pool.query(query, [id]);
  return result.rows[0];
}

export async function deleteForum(id: number) {
  const query = `DELETE FROM forums WHERE id = $1 RETURNING *;`;
  const result = await pool.query(query, [id]);
  return result.rows[0];
}

export async function getForums(): Promise<IForum[]> {
  const query = `
    SELECT 
      f.id,
      f.title,
      f.description,

      -- Types
      (
        SELECT ARRAY_AGG(t.type)
        FROM forum_types ft
        JOIN types t ON ft.type_id = t.id
        WHERE ft.forum_id = f.id
      ) AS type,

      -- Admins
      (
        SELECT ARRAY_AGG(
          json_build_object(
            'id', u.id,
            'username', u.username,
            'imgUrl', u.img_url
          )
        )
        FROM forum_admins fa
        JOIN users u ON fa.admin_id = u.id
        WHERE fa.forum_id = f.id
      ) AS admins,

      -- Threads
      (
        SELECT ARRAY_AGG(
          json_build_object(
            'id', t.id,
            'title', t.title,
            'description', t.description,

            -- Total Posts in the Thread
            'postCount', (
              SELECT COUNT(*)
              FROM posts p
              WHERE p.thread_id = t.id
            ),

            -- Total Likes in the Thread
            'likeCount', (
              SELECT COUNT(*)
              FROM post_likes pl
              JOIN posts p ON pl.post_id = p.id
              WHERE p.thread_id = t.id
            ),

            -- Latest Post
            'latestPost', (
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
              LIMIT 1
            ),

            -- Most Viewed Post
            'viewedPost', (
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
              ORDER BY COALESCE(pv.view_count, 0) DESC
              LIMIT 1
            ),

            -- Most Liked Post
            'likedPost', (
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
              ORDER BY COALESCE(pl.like_count, 0) DESC
              LIMIT 1
            )
          )
        )
        FROM threads t
        WHERE t.forum_id = f.id
      ) AS threads,

      -- Total post count for the forum
      (
        SELECT COUNT(*)
        FROM posts p
        JOIN threads t ON p.thread_id = t.id
        WHERE t.forum_id = f.id
      ) AS "totalPosts",

      -- Total unique views count for the forum
      (
        SELECT SUM(pv.view_count)
        FROM posts p
        JOIN threads t ON p.thread_id = t.id
        JOIN (
          SELECT post_id, SUM(unique_view_count) AS view_count
          FROM post_views
          GROUP BY post_id
        ) pv ON pv.post_id = p.id
        WHERE t.forum_id = f.id
      ) AS "viewCount"

    FROM forums f
    ORDER BY f.created_at DESC;
  `;
  const result = await pool.query(query);
  return result.rows;
}


