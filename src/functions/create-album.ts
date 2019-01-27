import { APIGatewayProxyHandler } from 'aws-lambda';
import * as crypto from 'crypto';
import * as uuidv1 from 'uuid/v1';
import { connectToDatabase } from '../db';
import { createAlbum } from '../S3-handler';
import { success, failure } from '../libs';

export const main: APIGatewayProxyHandler = async () => {
  try {
    const code = crypto.randomBytes(8).toString('hex');
    const uuid = uuidv1();

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
