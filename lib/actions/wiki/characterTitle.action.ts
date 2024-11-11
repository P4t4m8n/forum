import pool from "@/lib/database/config";

export async function createTitle(title: ITitle): Promise<{ id: string }> {
  const client = await pool.connect();
  try {
    const query = `
      INSERT INTO titles (title)
      VALUES ($1)
      RETURNING id
    `;
    const values = [title.titleName];

    const res = await client.query(query, values);
    return { id: res.rows[0].id };
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
}

export async function getTitleById(id: string): Promise<ITitle> {
  const client = await pool.connect();
  try {
    const query = `
      SELECT id, title
      FROM titles
      WHERE id = $1
    `;
    const res = await client.query(query, [id]);

    if (res.rows.length === 0) {
      throw new Error("Title not found");
    }

    const row = res.rows[0];
    return {
      id: row.id,
      titleName: row.title,
    };
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
}

export async function updateTitle(
  id: string,
  title: Partial<ITitle>
): Promise<{ id: string }> {
  const client = await pool.connect();
  try {
    const fields = [];
    const values = [];
    let idx = 1;

    if (title.titleName !== undefined) {
      fields.push(`title = $${idx++}`);
      values.push(title.titleName);
    }

    if (fields.length === 0) {
      throw new Error("No fields to update");
    }

    const query = `
      UPDATE titles
      SET ${fields.join(", ")}
      WHERE id = $${idx}
    `;
    values.push(id);

    await client.query(query, values);
    return { id };
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
}

export async function deleteTitle(id: string): Promise<{ message: string }> {
  const client = await pool.connect();
  try {
    const query = `DELETE FROM titles WHERE id = $1`;
    const res = await client.query(query, [id]);

    if (res.rowCount === 0) {
      throw new Error("Title not found");
    }

    return { message: "Title deleted successfully" };
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
}

export async function listTitles(): Promise<ITitle[]> {
  const client = await pool.connect();
  try {
    const query = `SELECT id, title FROM titles ORDER BY title ASC`;
    const res = await client.query(query);

    return res.rows.map((row) => ({
      id: row.id,
      titleName: row.title,
    }));
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
}

export async function addCharacterTitle(
  characterTitle: ICharacterTitleDto
): Promise<{ message: string }> {
  const client = await pool.connect();
  try {
    const query = `
        INSERT INTO character_titles (character_id, title_id)
        VALUES ($1, $2)
      `;
    const values = [characterTitle.characterId, characterTitle.titleId];

    await client.query(query, values);
    return { message: "Character title added successfully" };
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
}

export async function deleteCharacterTitle(
  characterTitle: ICharacterTitleDto
): Promise<{ message: string }> {
  const client = await pool.connect();
  try {
    const query = `
        DELETE FROM character_titles
        WHERE character_id = $1 AND title_id = $2
      `;
    const values = [characterTitle.characterId, characterTitle.titleId];

    const res = await client.query(query, values);
    if (res.rowCount === 0) {
      throw new Error("Character title not found");
    }

    return { message: "Character title deleted successfully" };
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
}

export async function getCharacterTitles(
  characterId: string
): Promise<ICharacterTitleDto[]> {
  const client = await pool.connect();
  try {
    const query = `
        SELECT character_id, title_id
        FROM character_titles
        WHERE character_id = $1
      `;
    const res = await client.query(query, [characterId]);

    return res.rows.map((row) => ({
      characterId: row.character_id,
      titleId: row.title_id,
    }));
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
}

export const getAllTitles = async () => {
  try {
    const query = `
      SELECT *
      FROM character_titles
    `;
    const res = await pool.query(query);
    return res.rows;
  } catch (error) {
    throw error;
  }
};
