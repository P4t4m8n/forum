import pool from "@/lib/database/config";

export async function createCharacterStatus(
  status: ICharacterStatus
): Promise<ICharacterStatus> {
  const client = await pool.connect();
  try {
    const query = `
      INSERT INTO character_statuses (character_status_name)
      VALUES ($1)
      RETURNING id
    `;
    const values = [status.characterStatusName];

    const res = await client.query(query, values);
    return { id: res.rows[0].id };
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
}

export async function getCharacterStatusById(
  id: string
): Promise<ICharacterStatus> {
  const client = await pool.connect();
  try {
    const query = `
      SELECT id, character_status_name
      FROM character_statuses
      WHERE id = $1
    `;
    const res = await client.query(query, [id]);

    if (res.rows.length === 0) {
      throw new Error("Character status not found");
    }

    const row = res.rows[0];
    return {
      id: row.id,
      characterStatusName: row.character_status_name,
    };
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
}

export async function updateCharacterStatus(
  id: string,
  status: Partial<ICharacterStatus>
): Promise<{ id: string }> {
  const client = await pool.connect();
  try {
    const fields = [];
    const values = [];
    let idx = 1;

    if (status.characterStatusName !== undefined) {
      fields.push(`character_status_name = $${idx++}`);
      values.push(status.characterStatusName);
    }

    if (fields.length === 0) {
      throw new Error("No fields to update");
    }

    const query = `
      UPDATE character_statuses
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

export async function deleteCharacterStatus(
  id: string
): Promise<{ message: string }> {
  const client = await pool.connect();
  try {
    const query = `DELETE FROM character_statuses WHERE id = $1`;
    const res = await client.query(query, [id]);

    if (res.rowCount === 0) {
      throw new Error("Character status not found");
    }

    return { message: "Character status deleted successfully" };
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
}

export async function listCharacterStatuses(): Promise<ICharacterStatus[]> {
  const client = await pool.connect();
  try {
    const query = `SELECT id, character_status_name FROM character_statuses ORDER BY character_status_name ASC`;
    const res = await client.query(query);

    return res.rows.map((row) => ({
      id: row.id,
      characterStatusName: row.character_status_name,
    }));
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
}
