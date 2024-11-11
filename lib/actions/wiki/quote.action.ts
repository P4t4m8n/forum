import pool from "@/lib/database/config";

export async function createQuote(quoteDto: IQuoteDto): Promise<IQuote> {
  try {
    const insertQuery = `
        INSERT INTO quotes (quote, from_character_id, to_character_id)
        VALUES ($1, $2, $3)
        RETURNING *
      `;
    const values = [
      quoteDto.quote,
      quoteDto.fromCharacterId,
      quoteDto.toCharacterId || null,
    ];

    const res = await pool.query(insertQuery, values);
    const quote = res.rows[0];

    return quote;
  } catch (error) {
    throw error;
  }
}

// export async function getQuoteById(id: string): Promise<IQuote> {
//   const client = await pool.connect();
//   try {
//     const query = `
//         SELECT
//           q.id,
//           q.content,
//           q.created_at,
//           q.updated_at,
//           -- From Character
//           fc.id AS from_character_id,
//           fc.name AS from_character_name,
//           fc.img_url AS from_character_img_url,
//           -- To Character
//           tc.id AS to_character_id,
//           tc.name AS to_character_name,
//           tc.img_url AS to_character_img_url
//         FROM quotes q
//         JOIN characters fc ON q.from_character_id = fc.id
//         LEFT JOIN characters tc ON q.to_character_id = tc.id
//         WHERE q.id = $1
//       `;
//     const res = await client.query(query, [id]);

//     if (res.rows.length === 0) {
//       throw new Error("Quote not found");
//     }

//     const row = res.rows[0];

//     const quote: IQuote = {
//       id: row.id,
//       content: row.content,
//       fromCharacter: {
//         id: row.from_character_id,
//         name: row.from_character_name,
//         imgUrl: row.from_character_img_url,
//       },
//       toCharacter: row.to_character_id
//         ? {
//             id: row.to_character_id,
//             name: row.to_character_name,
//             imgUrl: row.to_character_img_url,
//           }
//         : undefined,
//     };

//     return quote;
//   } catch (error) {
//     throw error;
//   } finally {
//     client.release();
//   }
// }

// export async function updateQuote(
//   id: string,
//   quoteDto: Partial<IQuoteDto>
// ): Promise<{ id: string }> {
//   const client = await pool.connect();
//   try {
//     const fields = [];
//     const values = [];
//     let idx = 1;

//     if (quoteDto.content !== undefined) {
//       fields.push(`content = $${idx++}`);
//       values.push(quoteDto.content);
//     }
//     if (quoteDto.fromCharacterId !== undefined) {
//       fields.push(`from_character_id = $${idx++}`);
//       values.push(quoteDto.fromCharacterId);
//     }
//     if (quoteDto.toCharacterId !== undefined) {
//       fields.push(`to_character_id = $${idx++}`);
//       values.push(quoteDto.toCharacterId || null);
//     }

//     if (fields.length > 0) {
//       const updateQuery = `
//           UPDATE quotes
//           SET ${fields.join(", ")}, updated_at = NOW()
//           WHERE id = $${idx}
//         `;
//       values.push(id);
//       await client.query(updateQuery, values);
//     }

//     return { id };
//   } catch (error) {
//     throw error;
//   } finally {
//     client.release();
//   }
// }

// export async function deleteQuote(id: string): Promise<{ message: string }> {
//   const client = await pool.connect();
//   try {
//     const deleteQuery = `DELETE FROM quotes WHERE id = $1`;
//     const res = await client.query(deleteQuery, [id]);

//     if (res.rowCount === 0) {
//       throw new Error("Quote not found");
//     }

//     return { message: "Quote deleted successfully" };
//   } catch (error) {
//     throw error;
//   } finally {
//     client.release();
//   }
// }

export async function getQuotes(): Promise<IQuoteSmall[]> {
  try {
    const query = `SELECT * FROM quotes`;
    const res = await pool.query(query);

    const quotes = res.rows;

    return quotes;
  } catch (error) {
    throw error;
  }
}
