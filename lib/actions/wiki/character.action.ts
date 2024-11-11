import pool from "@/lib/database/config";

export const createCharacter = async (
  characterDto: ICharacterDto
): Promise<ICharacter> => {
  try {
    const insertCharacterQuery = `
        INSERT INTO characters (
          name, gender_id, origin_place_id, born, death,
          actor, status_id, img_url, seasons
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7,
          $8, $9
        ) RETURNING *
      `;

    const characterValues = [
      characterDto?.name,
      characterDto?.genderId,
      characterDto?.originPlaceId || null,
      characterDto?.born || null,
      characterDto?.death || null,
      characterDto?.actor || null,
      characterDto?.statusId,
      characterDto?.imgUrl || null,
      characterDto?.seasons,
    ];

    const res = await pool.query(insertCharacterQuery, characterValues);
    const character = res.rows[0];

    return { ...character };
  } catch (error) {
    throw error;
  }
};

// export async function getCharacterById(id: string): Promise<ICharacter> {
//   const client = await pool.connect();
//   try {
//     const query = `
//       SELECT
//         c.id,
//         c.name,
//         c.born,
//         c.death,
//         c.actor,
//         c.img_url,
//         c.seasons,
//         c.created_at,
//         c.updated_at,
//         -- Gender
//         g.id AS gender_id,
//         g.gender_name,
//         -- Status
//         cs.id AS status_id,
//         cs.character_status_name,
//         -- Origin Place
//         op.id AS origin_place_id,
//         op.name AS origin_place_name,
//         -- Father
//         f.id AS father_id,
//         f.name AS father_name,
//         f.img_url AS father_img_url,
//         -- Mother
//         m.id AS mother_id,
//         m.name AS mother_name,
//         m.img_url AS mother_img_url,
//         -- Spouse
//         s.id AS spouse_id,
//         s.name AS spouse_name,
//         s.img_url AS spouse_img_url,
//         -- Titles
//         COALESCE(
//           JSON_AGG(DISTINCT jsonb_build_object('id', t.id, 'title', t.title))
//           FILTER (WHERE t.id IS NOT NULL), '[]'
//         ) AS titles,
//         -- Cultures
//         COALESCE(
//           JSON_AGG(DISTINCT jsonb_build_object('id', cu.id, 'culture_name', cu.culture_name))
//           FILTER (WHERE cu.id IS NOT NULL), '[]'
//         ) AS cultures,
//         -- Religions
//         COALESCE(
//           JSON_AGG(DISTINCT jsonb_build_object('id', r.id, 'religion_name', r.religion_name))
//           FILTER (WHERE r.id IS NOT NULL), '[]'
//         ) AS religions,
//         -- Houses
//         COALESCE(
//           JSON_AGG(DISTINCT jsonb_build_object('id', h.id, 'house_name', h.house_name))
//           FILTER (WHERE h.id IS NOT NULL), '[]'
//         ) AS houses,
//         -- Relationships
//         COALESCE(
//           JSON_AGG(DISTINCT jsonb_build_object(
//             'relatedCharacterId', cr.related_character_id,
//             'relationType', rt.relationship_name,
//             'relatedCharacterName', rc.name,
//             'relatedCharacterImgUrl', rc.img_url
//           )) FILTER (WHERE cr.related_character_id IS NOT NULL), '[]'
//         ) AS relationships
//       FROM characters c
//       -- Joins
//       LEFT JOIN genders g ON c.gender_id = g.id
//       LEFT JOIN character_statuses cs ON c.status_id = cs.id
//       LEFT JOIN places op ON c.origin_place_id = op.id
//       LEFT JOIN characters f ON c.father_id = f.id
//       LEFT JOIN characters m ON c.mother_id = m.id
//       LEFT JOIN characters s ON c.spouse_id = s.id
//       -- Titles
//       LEFT JOIN character_titles ct ON c.id = ct.character_id
//       LEFT JOIN titles t ON ct.title_id = t.id
//       -- Cultures
//       LEFT JOIN character_cultures cc ON c.id = cc.character_id
//       LEFT JOIN cultures cu ON cc.culture_id = cu.id
//       -- Religions
//       LEFT JOIN character_religions crl ON c.id = crl.character_id
//       LEFT JOIN religions r ON crl.religion_id = r.id
//       -- Houses
//       LEFT JOIN character_houses ch ON c.id = ch.character_id
//       LEFT JOIN houses h ON ch.house_id = h.id
//       -- Relationships
//       LEFT JOIN character_relationships cr ON c.id = cr.character_id
//       LEFT JOIN relationship_types rt ON cr.relationship_type_id = rt.id
//       LEFT JOIN characters rc ON cr.related_character_id = rc.id
//       WHERE c.id = $1
//       GROUP BY
//         c.id, g.id, cs.id, op.id, f.id, m.id, s.id
//     `;

//     const res = await client.query(query, [id]);

//     if (res.rows.length === 0) {
//       throw new Error("Character not found");
//     }

//     const row = res.rows[0];

//     return row;
//   } catch (error) {
//     throw error;
//   } finally {
//     client.release();
//   }
// }

export async function updateCharacter(characterDto: ICharacterDto) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const fields = [];
    const values = [];
    const { id } = characterDto;
    let character;
    let idx = 1;

    if (characterDto?.name !== undefined) {
      fields.push(`name = $${idx++}`);
      values.push(characterDto.name);
    }
    if (characterDto?.genderId !== undefined) {
      fields.push(`gender_id = $${idx++}`);
      values.push(characterDto.genderId);
    }

    if (characterDto?.originPlaceId !== undefined) {
      fields.push(`origin_place_id = $${idx++}`);
      values.push(characterDto.originPlaceId);
    }

    if (characterDto?.born !== undefined) {
      fields.push(`born = $${idx++}`);
      values.push(characterDto.born);
    }

    if (characterDto?.death !== undefined) {
      fields.push(`death = $${idx++}`);
      values.push(characterDto.death);
    }

    if (characterDto?.actor !== undefined) {
      fields.push(`actor = $${idx++}`);
      values.push(characterDto.actor);
    }

    if (characterDto?.statusId !== undefined) {
      fields.push(`status_id = $${idx++}`);
      values.push(characterDto.statusId);
    }

    if (characterDto?.imgUrl !== undefined) {
      fields.push(`img_url = $${idx++}`);
      values.push(characterDto.imgUrl);
    }

    if (characterDto?.seasons !== undefined) {
      fields.push(`seasons = $${idx++}`);
      values.push(characterDto.seasons);
    }

    if (fields.length > 0) {
      const updateQuery = `
          UPDATE characters SET ${fields.join(", ")}, updated_at = NOW()
          WHERE id = $${idx} RETURNING *
        `;
      values.push(id);
      console.log("values:", values);
      character = await client.query(updateQuery, values);
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
    return character?.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

// export async function deleteCharacter(id: string) {
//   const client = await pool.connect();
//   try {
//     const deleteQuery = `DELETE FROM characters WHERE id = $1`;
//     const res = await client.query(deleteQuery, [id]);

//     if (res.rowCount === 0) {
//       throw new Error("Character not found");
//     }

//     return { message: "Character deleted successfully" };
//   } catch (error) {
//     throw error;
//   } finally {
//     client.release();
//   }
// }

export async function getCharacters(): Promise<ICharacter[]> {
  try {
    const query = `SELECT 
    c.id,
    c.name,
    c.born,
    c.death,
    cs.character_status_name AS status,
    c.seasons,
    json_agg(DISTINCT r.name) AS religions,
    json_agg(DISTINCT t.title) AS titles
FROM 
    characters c
LEFT JOIN character_religions cr ON c.id = cr.character_id
LEFT JOIN religions r ON cr.religion_id = r.id
LEFT JOIN character_titles ct ON c.id = ct.character_id
LEFT JOIN titles t ON ct.title_id = t.id
LEFT JOIN character_statuses cs ON c.status_id = cs.id
GROUP BY 
    c.id, c.name, c.born, c.death, c.seasons, cs.character_status_name;
     `;

    const res = await pool.query(query);

    return res.rows;
  } catch (error) {
    throw error;
  }
}
// export async function getCharacters(): Promise<ICharacter[]> {
//   const client = await pool.connect();
//   try {
//     const query = `
//       SELECT
//         c.id,
//         c.name,
//         c.born,
//         c.death,
//         c.actor,
//         c.img_url,
//         c.seasons,
//         c.created_at,
//         c.updated_at,
//         -- Gender
//         g.id AS gender_id,
//         g.gender_name,
//         -- Status
//         cs.id AS status_id,
//         cs.character_status_name,
//         -- Origin Place
//         op.id AS origin_place_id,
//         op.name AS origin_place_name,
//         -- Father
//         f.id AS father_id,
//         f.name AS father_name,
//         f.img_url AS father_img_url,
//         -- Mother
//         m.id AS mother_id,
//         m.name AS mother_name,
//         m.img_url AS mother_img_url,
//         -- Spouse
//         s.id AS spouse_id,
//         s.name AS spouse_name,
//         s.img_url AS spouse_img_url,
//         -- Titles
//         COALESCE(
//           JSON_AGG(DISTINCT jsonb_build_object('id', t.id, 'title', t.title))
//           FILTER (WHERE t.id IS NOT NULL), '[]'
//         ) AS titles,
//         -- Cultures
//         COALESCE(
//           JSON_AGG(DISTINCT jsonb_build_object('id', cu.id, 'culture_name', cu.culture_name))
//           FILTER (WHERE cu.id IS NOT NULL), '[]'
//         ) AS cultures,
//         -- Religions
//         COALESCE(
//           JSON_AGG(DISTINCT jsonb_build_object('id', r.id, 'religion_name', r.religion_name))
//           FILTER (WHERE r.id IS NOT NULL), '[]'
//         ) AS religions,
//         -- Houses
//         COALESCE(
//           JSON_AGG(DISTINCT jsonb_build_object('id', h.id, 'house_name', h.house_name))
//           FILTER (WHERE h.id IS NOT NULL), '[]'
//         ) AS houses,
//         -- Relationships
//         COALESCE(
//           JSON_AGG(DISTINCT jsonb_build_object(
//             'relatedCharacterId', cr.related_character_id,
//             'relationType', rt.relationship_name,
//             'relatedCharacterName', rc.name,
//             'relatedCharacterImgUrl', rc.img_url
//           )) FILTER (WHERE cr.related_character_id IS NOT NULL), '[]'
//         ) AS relationships
//       FROM characters c
//       -- Joins
//       LEFT JOIN genders g ON c.gender_id = g.id
//       LEFT JOIN character_statuses cs ON c.status_id = cs.id
//       LEFT JOIN places op ON c.origin_place_id = op.id
//       LEFT JOIN characters f ON c.father_id = f.id
//       LEFT JOIN characters m ON c.mother_id = m.id
//       LEFT JOIN characters s ON c.spouse_id = s.id
//       -- Titles
//       LEFT JOIN character_titles ct ON c.id = ct.character_id
//       LEFT JOIN titles t ON ct.title_id = t.id
//       -- Cultures
//       LEFT JOIN character_cultures cc ON c.id = cc.character_id
//       LEFT JOIN cultures cu ON cc.culture_id = cu.id
//       -- Religions
//       LEFT JOIN character_religions crl ON c.id = crl.character_id
//       LEFT JOIN religions r ON crl.religion_id = r.id
//       -- Houses
//       LEFT JOIN character_houses ch ON c.id = ch.character_id
//       LEFT JOIN houses h ON ch.house_id = h.id
//       -- Relationships
//       LEFT JOIN character_relationships cr ON c.id = cr.character_id
//       LEFT JOIN relationship_types rt ON cr.relationship_type_id = rt.id
//       LEFT JOIN characters rc ON cr.related_character_id = rc.id
//       GROUP BY
//         c.id, g.id, cs.id, op.id, f.id, m.id, s.id
//       ORDER BY c.name ASC
//     `;

//     const res = await client.query(query);

//     return res.rows.map((row) => row);

//     // const characters: ICharacter[] = res.rows.map((row) => {
//     //   // Parse JSON arrays
//     //   const titles: ITitle[] = JSON.parse(row.titles);
//     //   const cultures: ICultureSmall[] = JSON.parse(row.cultures);
//     //   const religions: IReligionSmall[] = JSON.parse(row.religions);
//     //   const houses: IHouseSmall[] = JSON.parse(row.houses);
//     //   const relationshipsData: any[] = JSON.parse(row.relationships);

//     //   // Process relationships into the required format
//     //   const characterRelationships = processRelationships(relationshipsData);

//     //   return {
//     //     id: row.id,
//     //     name: row.name,
//     //     born: row.born,
//     //     death: row.death,
//     //     actor: row.actor,
//     //     imgUrl: row.img_url,
//     //     seasons: row.seasons,
//     //     createdAt: row.created_at,
//     //     updatedAt: row.updated_at,
//     //     gender: {
//     //       id: row.gender_id,
//     //       gender_name: row.gender_name,
//     //     },
//     //     status: {
//     //       id: row.status_id,
//     //       character_status_name: row.character_status_name,
//     //     },
//     //     originPlace: row.origin_place_id
//     //       ? {
//     //           id: row.origin_place_id,
//     //           name: row.origin_place_name,
//     //         }
//     //       : null,
//     //     father: row.father_id
//     //       ? {
//     //           id: row.father_id,
//     //           name: row.father_name,
//     //           imgUrl: row.father_img_url,
//     //         }
//     //       : null,
//     //     mother: row.mother_id
//     //       ? {
//     //           id: row.mother_id,
//     //           name: row.mother_name,
//     //           imgUrl: row.mother_img_url,
//     //         }
//     //       : null,
//     //     spouse: row.spouse_id
//     //       ? {
//     //           id: row.spouse_id,
//     //           name: row.spouse_name,
//     //           imgUrl: row.spouse_img_url,
//     //         }
//     //       : null,
//     //     titles,
//     //     cultures,
//     //     religions,
//     //     houses,
//     //     characterRelationships,
//     //   };
//     // });

//     // return characters;
//   } catch (error) {
//     throw error;
//   } finally {
//     client.release();
//   }
// }

export const createCharacterRelationship = async (
  relationTypeId: string,
  characterId: string,
  relatedCharacterId: string
) => {
  try {
    const insertCharacterRelationshipQuery = `
        INSERT INTO character_relationships (
          relationship_type_id, character_id, related_character_id
        ) VALUES (
          $1, $2, $3
        ) RETURNING *
      `;

    const characterRelationshipValues = [
      relationTypeId,
      characterId,
      relatedCharacterId,
    ];
    const res = await pool.query(
      insertCharacterRelationshipQuery,
      characterRelationshipValues
    );
    const characterRelationship = res.rows[0];
    return characterRelationship;
  } catch (error) {
    throw error;
  }
};

export const getCharacterRelationships = async () => {
  try {
    const query = `SELECT * FROM character_relationships`;
    const res = await pool.query(query);
    return res.rows;
  } catch (error) {
    throw error;
  }
};
