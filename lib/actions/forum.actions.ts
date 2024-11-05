"use server";

import pool from "../database/config";
import { sanitizeForumForm } from "../sanitize/forum.sanitize";
import { validateForumDto } from "../validations/forum.validation";

export const saveForum = async (formData: FormData) => {
  const dto = sanitizeForumForm(formData);

  const errors = validateForumDto(dto);
  if (errors.title || errors.description || errors.type || errors.admins) {
    throw errors;
  }

  const forum = dto?.id ? await updateForum(dto) : await createForum(dto);

  return forum;
};

export async function createForum(dto: IForumDto) {
  const { title, description, type, subjects, admins } = dto;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const forumQuery = `
      INSERT INTO forums (title, description, type, subjects)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const forumValues = [title, description, type, subjects];
    const forumResult = await client.query(forumQuery, forumValues);
    const forum = forumResult.rows[0];

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
    console.log("Forum created with admins successfully.");
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
  const { title, description, type, subjects, admins, id } = dto;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const forumQuery = `
      UPDATE forums
      SET title = COALESCE($1, title),
          description = COALESCE($2, description),
          type = COALESCE($3, type),
          subjects = COALESCE($4, subjects),
          updated_at = NOW()
      WHERE id = $5
      RETURNING *;
    `;
    const forumValues = [title, description, type, subjects, id];
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
    console.log("Forum updated with admins successfully.");
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
      f.subjects,
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
      ) AS admins,
      (SELECT COUNT(*) FROM posts p WHERE p.forum_id = f.id) AS "totalPosts",
      (SELECT SUM(uv.unique_view_count) FROM unique_views uv WHERE uv.forum_id = f.id) AS "viewCount"
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

export async function getForums(): Promise<IForumSmall[]> {
  const query = `SELECT 
    f.id ,
    f.title,
    f.description,
    f.type,
    f.subjects,
    f.created_at,

    -- Latest post
    (
        SELECT json_build_object(
            'id', p.id ,
            'title', p.title,
            'content', p.content,
            'createdAt', p.created_at,
            'viewCount', COALESCE(uv.unique_view_count, 0),
            'likeCount', COUNT(l.user_id),
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
        
        WHERE p.forum_id = f.id
        GROUP BY p.id, u.id, uv.unique_view_count
        ORDER BY p.created_at DESC
        LIMIT 1
    ) AS "latestPost",

    -- Top viewed post
    (
        SELECT json_build_object(
            'id', p.id,
            'title', p.title,
            'content', p.content,
            'viewCount', COALESCE(uv.unique_view_count, 0),
            'likeCount', COUNT(l.user_id),
            'createdAt', p.created_at,
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
        WHERE p.forum_id = f.id
        GROUP BY p.id, u.id, uv.unique_view_count
        ORDER BY uv.unique_view_count DESC
        LIMIT 1
    ) AS "viewedPost",

    -- Liked post
    (
        SELECT json_build_object(
            'id', p.id,
            'title', p.title,
            'content', p.content,
            'likeCount', COUNT(l.user_id),
            'viewCount', COALESCE(uv.unique_view_count, 0),
            'createdAt', p.created_at,
            'author', json_build_object(
                'id', u.id,
                'username', u.username,
                'imgUrl', u.img_url
            )
        )
        FROM posts p
        LEFT JOIN likes l ON l.post_id = p.id
        LEFT JOIN unique_views uv ON uv.post_id = p.id
        JOIN users u ON p.author_id = u.id
        WHERE p.forum_id = f.id
        GROUP BY p.id, u.id, uv.unique_view_count
        ORDER BY COUNT(l.user_id) DESC
        LIMIT 1
    ) AS "likedPost",

    -- Total post count for the forum
    (SELECT COUNT(*) FROM posts p WHERE p.forum_id = f.id) AS "totalPosts",

    -- Total unique views count for the forum
    (SELECT SUM(COALESCE(uv.unique_view_count, 0)) FROM unique_views uv WHERE uv.forum_id = f.id) AS "viewCount"

FROM forums f
ORDER BY f.created_at DESC;`;
  const result = await pool.query(query);
  return result.rows;
}
