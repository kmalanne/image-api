import { APIGatewayProxyHandler, APIGatewayProxyEvent } from 'aws-lambda';
import { connectToDatabase } from '../db';
import { success, failure } from '../libs';

export const main: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
  console.log(`Called function get-album with params:`);
  console.log(JSON.stringify(event, null, 2));

  try {
    const code = event.queryStringParameters.code ? event.queryStringParameters.code : '';
    const uuid = event.queryStringParameters.uuid ? event.queryStringParameters.uuid : '';

    const connection = await connectToDatabase();
    const [rows] = await connection.execute(
      `SELECT id 
       FROM album 
       WHERE album.code = ? OR album.uuid = ?`,
      [code, uuid]
    );

    console.log(`Function get-album finished:`, rows);

    return success(rows);
  } catch (err) {
    return failure(err.statusCode, { error: 'Could not fetch the album.' });
  }
};
