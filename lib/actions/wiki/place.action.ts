import pool from "@/lib/database/config";

export async function createPlace(
  placeDto: IPlaceDto
): Promise<{ id: string }> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const insertPlaceQuery = `
      INSERT INTO places (name, type_id, img_url, ruler_type, ruler_id, created_at)
      VALUES ($1, $2, $3, $4, $5, NOW())
      RETURNING id
    `;

    const values = [
      placeDto.name,
      placeDto.typeId || null,
      placeDto.imgUrl || null,
      placeDto.rulerType || null,
      placeDto.rulerId || null,
    ];

    await client.query(insertPlaceQuery, values);

    const res = await client.query("SELECT LASTVAL()");
    const placeId = res.rows[0].lastval;

    await client.query("COMMIT");
    return { id: placeId };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function getPlaceById(id: string): Promise<IPlace> {
  const client = await pool.connect();
  try {
    const placeQuery = `
      SELECT
        p.id,
        p.name,
        p.img_url,
        p.created_at,
        p.updated_at,
        pt.place_type_name AS type,
        p.ruler_type,
        p.ruler_id,
        -- Ruler details
        CASE
          WHEN p.ruler_type = 'house' THEN json_build_object('id', h.id, 'name', h.name, 'imgUrl', h.img_url)
          WHEN p.ruler_type = 'character' THEN json_build_object('id', c.id, 'name', c.name, 'imgUrl', c.img_url)
          ELSE NULL
        END AS ruler
      FROM places p
      LEFT JOIN place_types pt ON p.type_id = pt.id
      LEFT JOIN houses h ON p.ruler_type = 'house' AND p.ruler_id = h.id
      LEFT JOIN characters c ON p.ruler_type = 'character' AND p.ruler_id = c.id
      WHERE p.id = $1
    `;

    const res = await client.query(placeQuery, [id]);

    if (res.rows.length === 0) {
      throw new Error("Place not found");
    }

    const row = res.rows[0];

    const place: IPlace = {
      id: row.id,
      name: row.name,
      imgUrl: row.img_url,
      type: row.type,
      ruler: row.ruler ? row.ruler : null,
    };

    return place;
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
}

export async function updatePlace(
  id: string,
  placeDto: Partial<IPlaceDto>
): Promise<{ id: string }> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const fields = [];
    const values = [];
    let idx = 1;

    if (placeDto.name !== undefined) {
      fields.push(`name = $${idx++}`);
      values.push(placeDto.name);
    }
    if (placeDto.typeId !== undefined) {
      fields.push(`type_id = $${idx++}`);
      values.push(placeDto.typeId || null);
    }
    if (placeDto.imgUrl !== undefined) {
      fields.push(`img_url = $${idx++}`);
      values.push(placeDto.imgUrl);
    }
    if (placeDto.rulerId !== undefined || placeDto.rulerType !== undefined) {
      if (placeDto.rulerId === null || placeDto.rulerType === null) {
        fields.push(`ruler_type = NULL`);
        fields.push(`ruler_id = NULL`);
      } else {
        fields.push(`ruler_type = $${idx++}`);
        values.push(placeDto.rulerType);
        fields.push(`ruler_id = $${idx++}`);
        values.push(placeDto.rulerId);
      }
    }

    if (fields.length > 0) {
      const updateQuery = `
        UPDATE places
        SET ${fields.join(", ")}, updated_at = NOW()
        WHERE id = $${idx}
      `;
      values.push(id);
      await client.query(updateQuery, values);
    }

    await client.query("COMMIT");
    return { id };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function deletePlace(id: string): Promise<{ message: string }> {
  const client = await pool.connect();
  try {
    const deleteQuery = `DELETE FROM places WHERE id = $1`;
    const res = await client.query(deleteQuery, [id]);

    if (res.rowCount === 0) {
      throw new Error("Place not found");
    }

    return { message: "Place deleted successfully" };
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
}

export async function listPlaces(): Promise<IPlaceSmall[]> {
  const client = await pool.connect();
  try {
    const listQuery = `
      SELECT
        p.id,
        p.name,
        p.img_url,
        pt.place_type_name AS type
      FROM places p
      LEFT JOIN place_types pt ON p.type_id = pt.id
      ORDER BY p.name ASC
    `;

    const res = await client.query(listQuery);

    const places: IPlaceSmall[] = res.rows.map((row) => ({
      id: row.id,
      name: row.name,
      imgUrl: row.img_url,
      type: row.type,
    }));

    return places;
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
}