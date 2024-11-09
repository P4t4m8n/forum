import pool from "@/lib/database/config";

export async function createPlaceType(placeType: IPlaceType): Promise<{ id: string }> {
  const client = await pool.connect();
  try {
    const query = `
      INSERT INTO place_types (place_type_name)
      VALUES ($1)
      RETURNING id
    `;
    const values = [placeType.placeTypeName];

    const res = await client.query(query, values);
    return { id: res.rows[0].id };
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
}

export async function getPlaceTypeById(id: string): Promise<IPlaceType> {
  const client = await pool.connect();
  try {
    const query = `
      SELECT id, place_type_name
      FROM place_types
      WHERE id = $1
    `;
    const res = await client.query(query, [id]);

    if (res.rows.length === 0) {
      throw new Error('Place type not found');
    }

    const row = res.rows[0];
    return {
      id: row.id,
      placeTypeName: row.place_type_name,
    };
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
}

export async function updatePlaceType(
  id: string,
  placeType: Partial<IPlaceType>
): Promise<{ id: string }> {
  const client = await pool.connect();
  try {
    const fields = [];
    const values = [];
    let idx = 1;

    if (placeType.placeTypeName !== undefined) {
      fields.push(`place_type_name = $${idx++}`);
      values.push(placeType.placeTypeName);
    }

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    const query = `
      UPDATE place_types
      SET ${fields.join(', ')}
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

export async function deletePlaceType(id: string): Promise<{ message: string }> {
  const client = await pool.connect();
  try {
    const query = `DELETE FROM place_types WHERE id = $1`;
    const res = await client.query(query, [id]);

    if (res.rowCount === 0) {
      throw new Error('Place type not found');
    }

    return { message: 'Place type deleted successfully' };
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
}

export async function listPlaceTypes(): Promise<IPlaceType[]> {
  const client = await pool.connect();
  try {
    const query = `SELECT id, place_type_name FROM place_types ORDER BY place_type_name ASC`;
    const res = await client.query(query);

    return res.rows.map((row) => ({
      id: row.id,
      placeTypeName: row.place_type_name,
    }));
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
}
