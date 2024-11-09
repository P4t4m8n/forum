import pool from "@/lib/database/config";

export async function createCharacter(characterDto: ICharacterDto) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const insertCharacterQuery = `
        INSERT INTO characters (
          name, gender_id, origin_place_id, born, death, father_id, mother_id,
          spouse_id, actor, status_id, img_url, seasons, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7,
          $8, $9, $10, $11, $12, NOW(), NULL
        ) RETURNING id
      `;

    const characterValues = [
      characterDto.name,
      characterDto.genderId,
      characterDto.originPlaceId || null,
      characterDto.born || null,
      characterDto.death || null,
      characterDto.fatherId || null,
      characterDto.motherId || null,
      characterDto.spouseId || null,
      characterDto.actor || null,
      characterDto.statusId,
      characterDto.imgUrl || null,
      characterDto.seasons,
    ];

    const res = await client.query(insertCharacterQuery, characterValues);
    const characterId = res.rows[0].id;

    // Insert into character_titles junction table
    for (const titleId of characterDto.titleIds) {
      await client.query(
        `INSERT INTO character_titles (character_id, title_id) VALUES ($1, $2)`,
        [characterId, titleId]
      );
    }

    // Insert into character_cultures junction table
    for (const cultureId of characterDto.cultureIds) {
      await client.query(
        `INSERT INTO character_cultures (character_id, culture_id) VALUES ($1, $2)`,
        [characterId, cultureId]
      );
    }

    // Insert into character_religions junction table
    for (const religionId of characterDto.religionIds) {
      await client.query(
        `INSERT INTO character_religions (character_id, religion_id) VALUES ($1, $2)`,
        [characterId, religionId]
      );
    }

    // Insert into character_houses junction table
    for (const houseId of characterDto.housesIds) {
      await client.query(
        `INSERT INTO character_houses (character_id, house_id) VALUES ($1, $2)`,
        [characterId, houseId]
      );
    }

    // Insert character relationships
    for (const relationship of characterDto.characterRelationships) {
      await client.query(
        `INSERT INTO character_relationships (character_id, related_character_id, relationship_type_id)
           VALUES ($1, $2, $3)`,
        [
          characterId,
          relationship.relatedCharacterId,
          relationship.relationTypeId,
        ]
      );
    }

    await client.query("COMMIT");
    return { id: characterId };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function getCharacterById(id: string): Promise<ICharacter> {
  const client = await pool.connect();
  try {
    const query = `
      SELECT
        c.id,
        c.name,
        c.born,
        c.death,
        c.actor,
        c.img_url,
        c.seasons,
        c.created_at,
        c.updated_at,
        -- Gender
        g.id AS gender_id,
        g.gender_name,
        -- Status
        cs.id AS status_id,
        cs.character_status_name,
        -- Origin Place
        op.id AS origin_place_id,
        op.name AS origin_place_name,
        -- Father
        f.id AS father_id,
        f.name AS father_name,
        f.img_url AS father_img_url,
        -- Mother
        m.id AS mother_id,
        m.name AS mother_name,
        m.img_url AS mother_img_url,
        -- Spouse
        s.id AS spouse_id,
        s.name AS spouse_name,
        s.img_url AS spouse_img_url,
        -- Titles
        COALESCE(
          JSON_AGG(DISTINCT jsonb_build_object('id', t.id, 'title', t.title))
          FILTER (WHERE t.id IS NOT NULL), '[]'
        ) AS titles,
        -- Cultures
        COALESCE(
          JSON_AGG(DISTINCT jsonb_build_object('id', cu.id, 'culture_name', cu.culture_name))
          FILTER (WHERE cu.id IS NOT NULL), '[]'
        ) AS cultures,
        -- Religions
        COALESCE(
          JSON_AGG(DISTINCT jsonb_build_object('id', r.id, 'religion_name', r.religion_name))
          FILTER (WHERE r.id IS NOT NULL), '[]'
        ) AS religions,
        -- Houses
        COALESCE(
          JSON_AGG(DISTINCT jsonb_build_object('id', h.id, 'house_name', h.house_name))
          FILTER (WHERE h.id IS NOT NULL), '[]'
        ) AS houses,
        -- Relationships
        COALESCE(
          JSON_AGG(DISTINCT jsonb_build_object(
            'relatedCharacterId', cr.related_character_id,
            'relationType', rt.relationship_name,
            'relatedCharacterName', rc.name,
            'relatedCharacterImgUrl', rc.img_url
          )) FILTER (WHERE cr.related_character_id IS NOT NULL), '[]'
        ) AS relationships
      FROM characters c
      -- Joins
      LEFT JOIN genders g ON c.gender_id = g.id
      LEFT JOIN character_statuses cs ON c.status_id = cs.id
      LEFT JOIN places op ON c.origin_place_id = op.id
      LEFT JOIN characters f ON c.father_id = f.id
      LEFT JOIN characters m ON c.mother_id = m.id
      LEFT JOIN characters s ON c.spouse_id = s.id
      -- Titles
      LEFT JOIN character_titles ct ON c.id = ct.character_id
      LEFT JOIN titles t ON ct.title_id = t.id
      -- Cultures
      LEFT JOIN character_cultures cc ON c.id = cc.character_id
      LEFT JOIN cultures cu ON cc.culture_id = cu.id
      -- Religions
      LEFT JOIN character_religions crl ON c.id = crl.character_id
      LEFT JOIN religions r ON crl.religion_id = r.id
      -- Houses
      LEFT JOIN character_houses ch ON c.id = ch.character_id
      LEFT JOIN houses h ON ch.house_id = h.id
      -- Relationships
      LEFT JOIN character_relationships cr ON c.id = cr.character_id
      LEFT JOIN relationship_types rt ON cr.relationship_type_id = rt.id
      LEFT JOIN characters rc ON cr.related_character_id = rc.id
      WHERE c.id = $1
      GROUP BY
        c.id, g.id, cs.id, op.id, f.id, m.id, s.id
    `;

    const res = await client.query(query, [id]);

    if (res.rows.length === 0) {
      throw new Error("Character not found");
    }

    const row = res.rows[0];

    return row;
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
}

export async function updateCharacter(
  id: string,
  characterDto: Partial<ICharacterDto>
) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Update character's main fields
    const fields = [];
    const values = [];
    let idx = 1;

    if (characterDto.name !== undefined) {
      fields.push(`name = $${idx++}`);
      values.push(characterDto.name);
    }
    if (characterDto.genderId !== undefined) {
      fields.push(`gender_id = $${idx++}`);
      values.push(characterDto.genderId);
    }
    // Include other fields similarly...

    if (fields.length > 0) {
      const updateQuery = `
          UPDATE characters SET ${fields.join(", ")}, updated_at = NOW()
          WHERE id = $${idx}
        `;
      values.push(id);
      await client.query(updateQuery, values);
    }

    // Update many-to-many relationships in bulk
    // Titles
    if (characterDto.titleIds !== undefined) {
      await client.query(
        `DELETE FROM character_titles WHERE character_id = $1`,
        [id]
      );
      if (characterDto.titleIds.length > 0) {
        const titleValues = characterDto.titleIds.map(
          (titleId) => `('${id}', '${titleId}')`
        );
        const insertTitlesQuery = `
            INSERT INTO character_titles (character_id, title_id) VALUES ${titleValues.join(
              ", "
            )}
          `;
        await client.query(insertTitlesQuery);
      }
    }

    // Repeat similar process for cultures, religions, houses...

    // Update character relationships
    if (characterDto.characterRelationships !== undefined) {
      await client.query(
        `DELETE FROM character_relationships WHERE character_id = $1`,
        [id]
      );
      if (characterDto.characterRelationships.length > 0) {
        const relationshipValues = characterDto.characterRelationships.map(
          (rel) =>
            `('${id}', '${rel.relatedCharacterId}', '${rel.relationTypeId}')`
        );
        const insertRelationshipsQuery = `
            INSERT INTO character_relationships (character_id, related_character_id, relationship_type_id)
            VALUES ${relationshipValues.join(", ")}
          `;
        await client.query(insertRelationshipsQuery);
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

export async function deleteCharacter(id: string) {
  const client = await pool.connect();
  try {
    const deleteQuery = `DELETE FROM characters WHERE id = $1`;
    const res = await client.query(deleteQuery, [id]);

    if (res.rowCount === 0) {
      throw new Error("Character not found");
    }

    return { message: "Character deleted successfully" };
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
}

export async function getCharacters(): Promise<ICharacter[]> {
  const client = await pool.connect();
  try {
    const query = `
      SELECT
        c.id,
        c.name,
        c.born,
        c.death,
        c.actor,
        c.img_url,
        c.seasons,
        c.created_at,
        c.updated_at,
        -- Gender
        g.id AS gender_id,
        g.gender_name,
        -- Status
        cs.id AS status_id,
        cs.character_status_name,
        -- Origin Place
        op.id AS origin_place_id,
        op.name AS origin_place_name,
        -- Father
        f.id AS father_id,
        f.name AS father_name,
        f.img_url AS father_img_url,
        -- Mother
        m.id AS mother_id,
        m.name AS mother_name,
        m.img_url AS mother_img_url,
        -- Spouse
        s.id AS spouse_id,
        s.name AS spouse_name,
        s.img_url AS spouse_img_url,
        -- Titles
        COALESCE(
          JSON_AGG(DISTINCT jsonb_build_object('id', t.id, 'title', t.title))
          FILTER (WHERE t.id IS NOT NULL), '[]'
        ) AS titles,
        -- Cultures
        COALESCE(
          JSON_AGG(DISTINCT jsonb_build_object('id', cu.id, 'culture_name', cu.culture_name))
          FILTER (WHERE cu.id IS NOT NULL), '[]'
        ) AS cultures,
        -- Religions
        COALESCE(
          JSON_AGG(DISTINCT jsonb_build_object('id', r.id, 'religion_name', r.religion_name))
          FILTER (WHERE r.id IS NOT NULL), '[]'
        ) AS religions,
        -- Houses
        COALESCE(
          JSON_AGG(DISTINCT jsonb_build_object('id', h.id, 'house_name', h.house_name))
          FILTER (WHERE h.id IS NOT NULL), '[]'
        ) AS houses,
        -- Relationships
        COALESCE(
          JSON_AGG(DISTINCT jsonb_build_object(
            'relatedCharacterId', cr.related_character_id,
            'relationType', rt.relationship_name,
            'relatedCharacterName', rc.name,
            'relatedCharacterImgUrl', rc.img_url
          )) FILTER (WHERE cr.related_character_id IS NOT NULL), '[]'
        ) AS relationships
      FROM characters c
      -- Joins
      LEFT JOIN genders g ON c.gender_id = g.id
      LEFT JOIN character_statuses cs ON c.status_id = cs.id
      LEFT JOIN places op ON c.origin_place_id = op.id
      LEFT JOIN characters f ON c.father_id = f.id
      LEFT JOIN characters m ON c.mother_id = m.id
      LEFT JOIN characters s ON c.spouse_id = s.id
      -- Titles
      LEFT JOIN character_titles ct ON c.id = ct.character_id
      LEFT JOIN titles t ON ct.title_id = t.id
      -- Cultures
      LEFT JOIN character_cultures cc ON c.id = cc.character_id
      LEFT JOIN cultures cu ON cc.culture_id = cu.id
      -- Religions
      LEFT JOIN character_religions crl ON c.id = crl.character_id
      LEFT JOIN religions r ON crl.religion_id = r.id
      -- Houses
      LEFT JOIN character_houses ch ON c.id = ch.character_id
      LEFT JOIN houses h ON ch.house_id = h.id
      -- Relationships
      LEFT JOIN character_relationships cr ON c.id = cr.character_id
      LEFT JOIN relationship_types rt ON cr.relationship_type_id = rt.id
      LEFT JOIN characters rc ON cr.related_character_id = rc.id
      GROUP BY
        c.id, g.id, cs.id, op.id, f.id, m.id, s.id
      ORDER BY c.name ASC
    `;

    const res = await client.query(query);

    return res.rows.map((row) => row);

    // const characters: ICharacter[] = res.rows.map((row) => {
    //   // Parse JSON arrays
    //   const titles: ITitle[] = JSON.parse(row.titles);
    //   const cultures: ICultureSmall[] = JSON.parse(row.cultures);
    //   const religions: IReligionSmall[] = JSON.parse(row.religions);
    //   const houses: IHouseSmall[] = JSON.parse(row.houses);
    //   const relationshipsData: any[] = JSON.parse(row.relationships);

    //   // Process relationships into the required format
    //   const characterRelationships = processRelationships(relationshipsData);

    //   return {
    //     id: row.id,
    //     name: row.name,
    //     born: row.born,
    //     death: row.death,
    //     actor: row.actor,
    //     imgUrl: row.img_url,
    //     seasons: row.seasons,
    //     createdAt: row.created_at,
    //     updatedAt: row.updated_at,
    //     gender: {
    //       id: row.gender_id,
    //       gender_name: row.gender_name,
    //     },
    //     status: {
    //       id: row.status_id,
    //       character_status_name: row.character_status_name,
    //     },
    //     originPlace: row.origin_place_id
    //       ? {
    //           id: row.origin_place_id,
    //           name: row.origin_place_name,
    //         }
    //       : null,
    //     father: row.father_id
    //       ? {
    //           id: row.father_id,
    //           name: row.father_name,
    //           imgUrl: row.father_img_url,
    //         }
    //       : null,
    //     mother: row.mother_id
    //       ? {
    //           id: row.mother_id,
    //           name: row.mother_name,
    //           imgUrl: row.mother_img_url,
    //         }
    //       : null,
    //     spouse: row.spouse_id
    //       ? {
    //           id: row.spouse_id,
    //           name: row.spouse_name,
    //           imgUrl: row.spouse_img_url,
    //         }
    //       : null,
    //     titles,
    //     cultures,
    //     religions,
    //     houses,
    //     characterRelationships,
    //   };
    // });

    // return characters;
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
}
