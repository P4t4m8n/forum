import pool from "../database/config";

export const getUsers = async (): Promise<IUser[]> => {
  try {
    const query = `SELECT 
                    id,
                    username,
                    img_url AS "imgUrl" 
                   FROM users`;
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    throw error;
  }
};
