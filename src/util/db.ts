import { createConnection, Connection } from 'mysql2/promise';

let connection: Connection;

export const connectToDatabase = async (): Promise<Connection> => {
  console.log('Connecting to database...');

  if (!connection) {
    console.log('Connection not found, creating new.');

    connection = await createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: parseInt(process.env.DB_PORT, 10),
    });
  }

  console.log('Connection successful!');
  return connection;
};
