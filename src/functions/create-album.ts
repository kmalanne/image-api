import { APIGatewayProxyHandler } from 'aws-lambda';
import crypto from 'crypto';
import { v1 } from 'uuid';
import { connectToDatabase } from '../util/db';
import { success, failure } from '../util/response';

export const createAlbum: APIGatewayProxyHandler = async () => {
  console.log('Called function createAlbum.');

  try {
    const code = crypto.randomBytes(8).toString('hex');
    const uuid = v1();

    const connection = await connectToDatabase();
    const [rows] = await connection.execute(`INSERT INTO album(code, uuid) VALUES(?, ?)`, [
      code,
      uuid,
    ]);

    console.log(`Function createAlbum finished:`, rows);

    return success({ id: (rows as any).insertId, code, uuid });
  } catch (err) {
    return failure(err.statusCode, { error: 'Could not create the album.' });
  }
};
