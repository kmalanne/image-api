import { createConnection, Connection } from 'mysql2/promise';

let connection: Connection = undefined;

export const connectToDatabase = async (): Promise<Connection> => {
  if (connection === undefined) {
    connection = await createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
  }

  return connection;
};
