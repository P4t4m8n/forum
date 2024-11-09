import pool from "@/lib/database/config";

export async function createRelationshipType(
  relationshipType: IRelationshipType
): Promise<{ id: string }> {
  const client = await pool.connect();
  try {
    const query = `
      INSERT INTO relationship_types (relationship_name)
      VALUES ($1)
      RETURNING id
    `;
    const values = [relationshipType.relationshipName];

    const res = await client.query(query, values);
    return { id: res.rows[0].id };
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
}

export async function getRelationshipTypeById(
  id: string
): Promise<IRelationshipType> {
  const client = await pool.connect();
  try {
    const query = `
      SELECT id, relationship_name
      FROM relationship_types
      WHERE id = $1
    `;
    const res = await client.query(query, [id]);

    if (res.rows.length === 0) {
      throw new Error("Relationship type not found");
    }

    const row = res.rows[0];
    return {
      id: row.id,
      relationshipName: row.relationship_name,
    };
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
}

export async function updateRelationshipType(
  id: string,
  relationshipType: Partial<IRelationshipType>
): Promise<{ id: string }> {
  const client = await pool.connect();
  try {
    const fields = [];
    const values = [];
    let idx = 1;

    if (relationshipType.relationshipName !== undefined) {
      fields.push(`relationship_name = $${idx++}`);
      values.push(relationshipType.relationshipName);
    }

    if (fields.length === 0) {
      throw new Error("No fields to update");
    }

    const query = `
      UPDATE relationship_types
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

export async function deleteRelationshipType(
  id: string
): Promise<{ message: string }> {
  const client = await pool.connect();
  try {
    const query = `DELETE FROM relationship_types WHERE id = $1`;
    const res = await client.query(query, [id]);

    if (res.rowCount === 0) {
      throw new Error("Relationship type not found");
    }

    return { message: "Relationship type deleted successfully" };
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
}

export async function listRelationshipTypes(): Promise<IRelationshipType[]> {
  const client = await pool.connect();
  try {
    const query = `SELECT id, relationship_name FROM relationship_types ORDER BY relationship_name ASC`;
    const res = await client.query(query);

    return res.rows.map((row) => ({
      id: row.id,
      relationshipName: row.relationship_name,
    }));
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
}

export async function addCharacterRelationship(
  relationship: ICharacterRelationshipDto
): Promise<{ message: string }> {
  const client = await pool.connect();
  try {
    const query = `
        INSERT INTO character_relationships (character_id, related_character_id, relationship_type_id)
        VALUES ($1, $2, $3)
      `;
    const values = [
      relationship.characterId,
      relationship.relatedCharacterId,
      relationship.relationTypeId,
    ];

    await client.query(query, values);
    return { message: "Character relationship added successfully" };
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
}

export async function deleteCharacterRelationship(
  relationship: ICharacterRelationshipDto
): Promise<{ message: string }> {
  const client = await pool.connect();
  try {
    const query = `
        DELETE FROM character_relationships
        WHERE character_id = $1 AND related_character_id = $2 AND relationship_type_id = $3
      `;
    const values = [
      relationship.characterId,
      relationship.relatedCharacterId,
      relationship.relationTypeId,
    ];

    const res = await client.query(query, values);
    if (res.rowCount === 0) {
      throw new Error("Character relationship not found");
    }

    return { message: "Character relationship deleted successfully" };
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
}
