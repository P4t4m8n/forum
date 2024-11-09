import pool from "@/lib/database/config";

export async function createReligion(
  religionDto: IReligionDto
): Promise<{ id: string }> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Insert into religions table
    const insertReligionQuery = `
        INSERT INTO religions (name, img_url, created_at)
        VALUES ($1, $2, NOW())
        RETURNING id
      `;
    const religionValues = [religionDto.name, religionDto.imgUrl || null];

    const res = await client.query(insertReligionQuery, religionValues);
    const religionId = res.rows[0].id;

    // Insert into character_religions junction table
    if (religionDto.characterIds && religionDto.characterIds.length > 0) {
      const values = religionDto.characterIds.map(
        (characterId) => `('${characterId}', '${religionId}')`
      );
      const insertCharacterReligionsQuery = `
          INSERT INTO character_religions (character_id, religion_id)
          VALUES ${values.join(", ")}
        `;
      await client.query(insertCharacterReligionsQuery);
    }

    await client.query("COMMIT");
    return { id: religionId };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function getReligionById(id: string): Promise<IReligion> {
  const client = await pool.connect();
  try {
    const query = `
        SELECT
          r.id,
          r.name,
          r.img_url,
          r.created_at,
          r.updated_at,
          COALESCE(
            JSON_AGG(
              DISTINCT jsonb_build_object(
                'id', c.id,
                'name', c.name,
                'imgUrl', c.img_url
              )
            ) FILTER (WHERE c.id IS NOT NULL),
            '[]'
          ) AS characters
        FROM religions r
        LEFT JOIN character_religions cr ON r.id = cr.religion_id
        LEFT JOIN characters c ON cr.character_id = c.id
        WHERE r.id = $1
        GROUP BY r.id
      `;
    const res = await client.query(query, [id]);

    if (res.rows.length === 0) {
      throw new Error("Religion not found");
    }

    const row = res.rows[0];

    const religion: IReligion = {
      id: row.id,
      name: row.name,
      imgUrl: row.img_url,
      characters: JSON.parse(row.characters),
    };

    return religion;
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
}

export async function updateReligion(
  id: string,
  religionDto: Partial<IReligionDto>
): Promise<{ id: string }> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const fields = [];
    const values = [];
    let idx = 1;

    if (religionDto.name !== undefined) {
      fields.push(`name = $${idx++}`);
      values.push(religionDto.name);
    }
    if (religionDto.imgUrl !== undefined) {
      fields.push(`img_url = $${idx++}`);
      values.push(religionDto.imgUrl);
    }

    if (fields.length > 0) {
      const updateReligionQuery = `
          UPDATE religions
          SET ${fields.join(", ")}, updated_at = NOW()
          WHERE id = $${idx}
        `;
      values.push(id);
      await client.query(updateReligionQuery, values);
    }

    // Update character associations
    if (religionDto.characterIds !== undefined) {
      // Remove existing associations
      await client.query(
        `DELETE FROM character_religions WHERE religion_id = $1`,
        [id]
      );

      // Insert new associations
      if (religionDto.characterIds.length > 0) {
        const values = religionDto.characterIds.map(
          (characterId) => `('${characterId}', '${id}')`
        );
        const insertCharacterReligionsQuery = `
            INSERT INTO character_religions (character_id, religion_id)
            VALUES ${values.join(", ")}
          `;
        await client.query(insertCharacterReligionsQuery);
      }
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

export async function deleteReligion(id: string): Promise<{ message: string }> {
  const client = await pool.connect();
  try {
    const deleteQuery = `DELETE FROM religions WHERE id = $1`;
    const res = await client.query(deleteQuery, [id]);

    if (res.rowCount === 0) {
      throw new Error("Religion not found");
    }

    // ON DELETE CASCADE will handle deleting entries from character_religions

    return { message: "Religion deleted successfully" };
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
}

export async function listReligions(): Promise<IReligionSmall[]> {
  const client = await pool.connect();
  try {
    const query = `
        SELECT id, name, img_url
        FROM religions
        ORDER BY name ASC
      `;
    const res = await client.query(query);

    const religions: IReligionSmall[] = res.rows.map((row) => ({
      id: row.id,
      name: row.name,
      imgUrl: row.img_url,
    }));

    return religions;
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
}
