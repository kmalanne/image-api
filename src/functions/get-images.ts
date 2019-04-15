import { APIGatewayProxyHandler, APIGatewayProxyEvent } from 'aws-lambda';
import { connectToDatabase } from '../util/db';
import { success, failure } from '../util/response';

export const getImages: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
  const id = event.pathParameters.id;
  const cursor = event.queryStringParameters.cursor;
  const limit = event.queryStringParameters.limit;

  console.log(
    `Called function getImages with params id: ${id}, cursor: ${cursor}, limit: ${limit}`
  );

  try {
    const connection = await connectToDatabase();
    const [rows] = await connection.execute(
      `SELECT image.id AS id, thumbnail_url, preview_url
       FROM album
       LEFT JOIN image ON image.album = album.id
       WHERE album.id = ? AND image.id > ?
       ORDER BY image.id ASC
       LIMIT ?`,
      [id, cursor, limit]
    );

    console.log(`Function getImages finished:`, rows);

    return success(rows);
  } catch (err) {
    return failure(err.statusCode, { error: 'Could not fetch the images.' });
  }
};
