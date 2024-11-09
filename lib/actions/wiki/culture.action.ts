import pool from "@/lib/database/config";

export async function createCulture(
  cultureDto: ICultureDTO
): Promise<{ id: string }> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Insert into cultures table
    const insertCultureQuery = `
        INSERT INTO cultures (name, img_url)
        VALUES ($1, $2)
        RETURNING id
      `;
    const cultureValues = [cultureDto.name, cultureDto.imgUrl || null];

    const res = await client.query(insertCultureQuery, cultureValues);
    const cultureId = res.rows[0].id;

    // Insert into character_cultures junction table
    if (cultureDto.characterIds && cultureDto.characterIds.length > 0) {
      const insertCharacterCulturesQuery = `
          INSERT INTO character_cultures (character_id, culture_id)
          VALUES ${cultureDto.characterIds
            .map((_, idx) => `($${idx * 2 + 1}, $${idx * 2 + 2})`)
            .join(", ")}
        `;
      const characterCultureValues = cultureDto.characterIds.flatMap(
        (characterId) => [characterId, cultureId]
      );

      await client.query(insertCharacterCulturesQuery, characterCultureValues);
    }

    await client.query("COMMIT");
    return { id: cultureId };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function getCultureById(id: string): Promise<ICulture> {
  const client = await pool.connect();
  try {
    const cultureQuery = `
        SELECT
          c.id,
          c.name,
          c.img_url,
          COALESCE(
            JSON_AGG(
              DISTINCT jsonb_build_object(
                'id', ch.id,
                'name', ch.name,
                'imgUrl', ch.img_url
              )
            ) FILTER (WHERE ch.id IS NOT NULL),
            '[]'
          ) AS characters
        FROM cultures c
        LEFT JOIN character_cultures cc ON c.id = cc.culture_id
        LEFT JOIN characters ch ON cc.character_id = ch.id
        WHERE c.id = $1
        GROUP BY c.id
      `;

    const res = await client.query(cultureQuery, [id]);

    if (res.rows.length === 0) {
      throw new Error("Culture not found");
    }

    const row = res.rows[0];

    const culture: ICulture = {
      id: row.id,
      name: row.name,
      imgUrl: row.img_url,
      characters: JSON.parse(row.characters),
    };

    return culture;
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
}

export async function updateCulture(
  id: string,
  cultureDto: Partial<ICultureDTO>
): Promise<{ id: string }> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Update culture fields
    const fields = [];
    const values = [];
    let idx = 1;

    if (cultureDto.name !== undefined) {
      fields.push(`name = $${idx++}`);
      values.push(cultureDto.name);
    }
    if (cultureDto.imgUrl !== undefined) {
      fields.push(`img_url = $${idx++}`);
      values.push(cultureDto.imgUrl);
    }

    if (fields.length > 0) {
      const updateCultureQuery = `
          UPDATE cultures SET ${fields.join(", ")}
          WHERE id = $${idx}
        `;
      values.push(id);
      await client.query(updateCultureQuery, values);
    }

    // Update character associations
    if (cultureDto.characterIds !== undefined) {
      // Remove existing associations
      await client.query(
        `DELETE FROM character_cultures WHERE culture_id = $1`,
        [id]
      );

      // Insert new associations
      if (cultureDto.characterIds.length > 0) {
        const insertCharacterCulturesQuery = `
            INSERT INTO character_cultures (character_id, culture_id)
            VALUES ${cultureDto.characterIds
              .map((_, idx) => `($${idx * 2 + 1}, $${idx * 2 + 2})`)
              .join(", ")}
          `;
        const characterCultureValues = cultureDto.characterIds.flatMap(
          (characterId) => [characterId, id]
        );

        await client.query(
          insertCharacterCulturesQuery,
          characterCultureValues
        );
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

export async function deleteCulture(id: string): Promise<{ message: string }> {
  const client = await pool.connect();
  try {
    const deleteQuery = `DELETE FROM cultures WHERE id = $1`;
    const res = await client.query(deleteQuery, [id]);

    if (res.rowCount === 0) {
      throw new Error("Culture not found");
    }

    // Due to ON DELETE CASCADE, related entries in character_cultures will be deleted automatically.

    return { message: "Culture deleted successfully" };
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
}

export async function listCultures(): Promise<ICultureSmall[]> {
  const client = await pool.connect();
  try {
    const listQuery = `
        SELECT id, name, img_url
        FROM cultures
        ORDER BY name ASC
      `;
    const res = await client.query(listQuery);

    const cultures: ICultureSmall[] = res.rows.map((row) => ({
      id: row.id,
      name: row.name,
      imgUrl: row.img_url,
    }));

    return cultures;
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
}
