import pool from "@/lib/database/config";
import xss from "xss";

type TLookupTableName =
  | "genders"
  | "titles"
  | "place_types"
  | "character_statuses"
  | "relationship_types";
/**
 * Creates a new entry in the specified lookup table.
 *
 * @param {TLookupTableName} type - The type of the lookup table to insert into.
 * @param {string} name - The name to insert into the lookup table.
 * @returns {Promise<ILookupTable>} A promise that resolves to the created lookup table entry.
 * @throws Will throw an error if the name is invalid or if the lookup table type is invalid.
 */
export async function createLookupTable(
  type: TLookupTableName,
  name: string
): Promise<ILookupTable> {
  try {
    const checkedName = xss(name);
    if (!checkedName || checkedName.length < 1) {
      throw new Error("Invalid name");
    }
    const tableMapping = {
      genders: "genders (gender_name)",
      titles: "titles (title)",
      place_types: "place_types (place_type_name)",
      character_statuses: "character_statuses (character_status_name)",
      relationship_types: "relationship_types (relationship_name)",
    };

    const insert = `INSERT INTO ${tableMapping[type]}`;
    if (!insert) {
      throw new Error("Invalid lookup table type");
    }

    const query = `
       ${insert}
        VALUES ($1)
        RETURNING id
      `;

    const res = await pool.query(query, [checkedName]);
    return { id: res.rows[0].id, name: checkedName };
  } catch (error) {
    console.error("Error creating lookup table:", error);
    throw error;
  }
}

export const getLookupTable = async (
  type: TLookupTableName
): Promise<ILookupTable[]> => {
  try {
    const checkedType = xss(type);

    const query = `SELECT * FROM ${checkedType}`;
    const res = await pool.query(query);

    const lookUpTable = res.rows.map((row) => {
      let name = "";
      switch (type) {
        case "character_statuses":
          name = row.character_status_name;
          break;
        case "genders":
          name = row.gender_name;
          break;
        case "place_types":
          name = row.place_type_name;
          break;
        case "titles":
          name = row.title;
          break;
        case "relationship_types":
          name = row.relationship_name;
          break;
        default:
          throw new Error("Invalid lookup");
      }
      return { id: row.id, name };
    });
    return lookUpTable;
  } catch (error) {
    console.error(`Error getting lookup table ${type}:`, error);
    throw error;
  }
};
