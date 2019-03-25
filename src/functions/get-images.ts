import { APIGatewayProxyHandler, APIGatewayProxyEvent } from 'aws-lambda';
import { connectToDatabase } from '../db';
import { success, failure } from '../libs';

export const main: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
  console.log(`Called function get-images with params:`);
  console.log(JSON.stringify(event, null, 2));

  try {
    const id = event.pathParameters.id;
    const cursor = event.queryStringParameters.cursor;
    const limit = event.queryStringParameters.limit;

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

    console.log(`Function get-images finished:`, rows);

    return success(rows);
  } catch (err) {
    return failure(err.statusCode, { error: 'Could not fetch the images.' });
  }
};
