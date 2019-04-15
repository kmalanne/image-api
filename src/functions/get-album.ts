import { APIGatewayProxyHandler, APIGatewayProxyEvent } from 'aws-lambda';
import { connectToDatabase } from '../util/db';
import { success, failure } from '../util/response';

export const getAlbum: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
  const code = event.queryStringParameters.code ? event.queryStringParameters.code : '';
  const uuid = event.queryStringParameters.uuid ? event.queryStringParameters.uuid : '';

  console.log(`Called function getAlbum with params code: ${code}, uuid: ${uuid}`);

  try {
    const connection = await connectToDatabase();
    const [rows] = await connection.execute(
      `SELECT id
       FROM album
       WHERE album.code = ? OR album.uuid = ?`,
      [code, uuid]
    );

    console.log(`Function getAlbum finished:`, rows);

    return success(rows);
  } catch (err) {
    return failure(err.statusCode, { error: 'Could not fetch the album.' });
  }
};
