import pool from "@/lib/database/config";

export async function createGender(gender: IGender): Promise<{ id: string }> {
  const client = await pool.connect();
  try {
    const query = `
        INSERT INTO genders (gender_name)
        VALUES ($1)
        RETURNING id
      `;
    const values = [gender.genderName];

    const res = await client.query(query, values);
    return { id: res.rows[0].id };
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
}

export async function getGenderById(id: string): Promise<IGender> {
  const client = await pool.connect();
  try {
    const query = `
        SELECT id, gender_name
        FROM genders
        WHERE id = $1
      `;
    const res = await client.query(query, [id]);

    if (res.rows.length === 0) {
      throw new Error("Gender not found");
    }

    const row = res.rows[0];
    return {
      id: row.id,
      genderName: row.gender_name,
    };
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
}

export async function updateGender(
  id: string,
  gender: Partial<IGender>
): Promise<{ id: string }> {
  const client = await pool.connect();
  try {
    const fields = [];
    const values = [];
    let idx = 1;

    if (gender.genderName !== undefined) {
      fields.push(`gender_name = $${idx++}`);
      values.push(gender.genderName);
    }

    if (fields.length === 0) {
      throw new Error("No fields to update");
    }

    const query = `
        UPDATE genders
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

export async function deleteGender(id: string): Promise<{ message: string }> {
  const client = await pool.connect();
  try {
    const query = `DELETE FROM genders WHERE id = $1`;
    const res = await client.query(query, [id]);

    if (res.rowCount === 0) {
      throw new Error("Gender not found");
    }

    return { message: "Gender deleted successfully" };
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
}

export async function listGenders(): Promise<IGender[]> {
  const client = await pool.connect();
  try {
    const query = `SELECT id, gender_name FROM genders ORDER BY gender_name ASC`;
    const res = await client.query(query);

    return res.rows.map((row) => ({
      id: row.id,
      genderName: row.gender_name,
    }));
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
}
