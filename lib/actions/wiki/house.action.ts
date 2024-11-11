import pool from "@/lib/database/config";

export async function createHouse(houseDto: IHouseDto): Promise<IHouse> {
  try {
    const insertHouseQuery = `
        INSERT INTO houses (name, img_url, sigil, words, seat_id, founder_id)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `;
    const values = [
      houseDto?.name,
      houseDto?.imgUrl || null,
      houseDto?.sigil || null,
      houseDto?.words || null,
      houseDto?.seatId || null,
      houseDto?.founderId || null,
    ];

    const res = await pool.query(insertHouseQuery, values);

    return res.rows[0];
  } catch (error) {
    throw error;
  }
}

// export async function getHouseById(id: string): Promise<IHouse> {
//   const client = await pool.connect();
//   try {
//     const houseQuery = `
//       SELECT
//         h.id,
//         h.name,
//         h.img_url,
//         h.sigil,
//         h.words,
//         h.created_at,
//         h.updated_at,
//         -- Seat
//         p.id AS seat_id,
//         p.name AS seat_name,
//         -- Founder
//         c.id AS founder_id,
//         c.name AS founder_name,
//         c.img_url AS founder_img_url
//       FROM houses h
//       LEFT JOIN places p ON h.seat_id = p.id
//       LEFT JOIN characters c ON h.founder_id = c.id
//       WHERE h.id = $1
//     `;

//     const res = await client.query(houseQuery, [id]);

//     if (res.rows.length === 0) {
//       throw new Error("House not found");
//     }

//     const row = res.rows[0];

//     const house: IHouse = {
//       id: row.id,
//       name: row.name,
//       imgUrl: row.img_url,
//       sigil: row.sigil,
//       words: row.words,
//       seat: row.seat_id
//         ? {
//             id: row.seat_id,
//             name: row.seat_name,
//             imgUrl: null,
//           }
//         : undefined,
//       founder: row.founder_id
//         ? {
//             id: row.founder_id,
//             name: row.founder_name,
//             imgUrl: row.founder_img_url,
//           }
//         : undefined,
//     };

//     return house;
//   } catch (error) {
//     throw error;
//   } finally {
//     client.release();
//   }
// }

// export async function updateHouse(
//   id: string,
//   houseDto: Partial<IHouseDto>
// ): Promise<{ id: string }> {
//   const client = await pool.connect();
//   try {
//     await client.query("BEGIN");

//     const fields = [];
//     const values = [];
//     let idx = 1;

//     if (houseDto.name !== undefined) {
//       fields.push(`name = $${idx++}`);
//       values.push(houseDto.name);
//     }
//     if (houseDto.imgUrl !== undefined) {
//       fields.push(`img_url = $${idx++}`);
//       values.push(houseDto.imgUrl);
//     }
//     if (houseDto.sigil !== undefined) {
//       fields.push(`sigil = $${idx++}`);
//       values.push(houseDto.sigil);
//     }
//     if (houseDto.words !== undefined) {
//       fields.push(`words = $${idx++}`);
//       values.push(houseDto.words);
//     }
//     if (houseDto.seatId !== undefined) {
//       fields.push(`seat_id = $${idx++}`);
//       values.push(houseDto.seatId);
//     }
//     if (houseDto.founderId !== undefined) {
//       fields.push(`founder_id = $${idx++}`);
//       values.push(houseDto.founderId);
//     }

//     if (fields.length > 0) {
//       const updateQuery = `
//           UPDATE houses
//           SET ${fields.join(", ")}, updated_at = NOW()
//           WHERE id = $${idx}
//         `;
//       values.push(id);
//       await client.query(updateQuery, values);
//     }

//     await client.query("COMMIT");
//     return { id };
//   } catch (error) {
//     await client.query("ROLLBACK");
//     throw error;
//   } finally {
//     client.release();
//   }
// }

// export async function deleteHouse(id: string): Promise<{ message: string }> {
//   const client = await pool.connect();
//   try {
//     const deleteQuery = `DELETE FROM houses WHERE id = $1`;
//     const res = await client.query(deleteQuery, [id]);

//     if (res.rowCount === 0) {
//       throw new Error("House not found");
//     }

//     return { message: "House deleted successfully" };
//   } catch (error) {
//     throw error;
//   } finally {
//     client.release();
//   }
// }

export async function getHouses(): Promise<IHouseSmall[]> {
  try {
    const listQuery = `SELECT * FROM houses`;
    const res = await pool.query(listQuery);

    return res.rows;
  } catch (error) {
    throw error;
  }
}

export const createVassal = async (houseId: string, vassalId: string) => {
  try {
    const insertVassalQuery = `
        INSERT INTO house_vassals (house_id, vassal_house_id)
        VALUES ($1, $2) RETURNING *
      `;
    const res = await pool.query(insertVassalQuery, [houseId, vassalId]);
    return res.rows[0];
  } catch (error) {
    throw error;
  }
};

export const getVassals = async (houseId?: string): Promise<IHouseSmall[]> => {
  try {
    const query = `SELECT * FROM house_vassals `;
    const res = await pool.query(query);
    return res.rows;
  } catch (error) {
    throw error;
  }
};
