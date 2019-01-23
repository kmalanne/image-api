import { APIGatewayProxyHandler, APIGatewayProxyEvent } from 'aws-lambda';
import { connectToDatabase } from './db';
import { generateCode, generateUuid } from './utils';

export const poll: APIGatewayProxyHandler = async () => {
  await connectToDatabase();
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Connection successful.' }),
  };
};

export const createAlbum: APIGatewayProxyHandler = async () => {
  try {
    const code = generateCode();
    const uuid = generateUuid();

    const connection = await connectToDatabase();
    const [rows, fields] = await connection.execute(`INSERT INTO album(code, uuid) VALUES(?, ?)`, [
      code,
      uuid,
    ]);

    return {
      statusCode: 200,
      body: JSON.stringify(rows),
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Could not create the album.',
    };
  }
};

export const createImage: APIGatewayProxyHandler = async () => {
  console.log('TODO');
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'TODO' }),
  };
};

export const getImages: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
  try {
    const id = event.pathParameters.id;
    const cursor = event.queryStringParameters.cursor;
    const limit = event.queryStringParameters.limit;

    const connection = await connectToDatabase();
    const [rows, fields] = await connection.execute(
      `SELECT image.id AS id, thumbnail_url, preview_url 
       FROM album
       LEFT JOIN image ON image.album = album.id 
       WHERE album.id = ? AND image.id > ? 
       ORDER BY image.id ASC 
       LIMIT ?`,
      [id, cursor, limit]
    );

    return {
      statusCode: 200,
      body: JSON.stringify(rows),
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Could not fetch the images.',
    };
  }
};
