import { APIGatewayProxyHandler } from 'aws-lambda';
import { connectToDatabase } from '../db';
import { createAlbum } from '../S3-handler';
import { success, failure } from '../libs';
import { generateCode, generateUuid } from '../utils';

export const main: APIGatewayProxyHandler = async () => {
  try {
    const code = generateCode();
    const uuid = generateUuid();

    await createAlbum(code);

    const connection = await connectToDatabase();
    const [rows] = await connection.execute(`INSERT INTO album(code, uuid) VALUES(?, ?)`, [
      code,
      uuid,
    ]);

    return success(rows);
  } catch (err) {
    return failure(err.statusCode, { error: 'Could not create the album.' });
  }
};
