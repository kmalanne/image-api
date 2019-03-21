import { APIGatewayProxyHandler } from 'aws-lambda';
import * as crypto from 'crypto';
import { v1 } from 'uuid';
import { connectToDatabase } from '../db';
// import { createAlbum } from '../S3-handler';
import { success, failure } from '../libs';

export const main: APIGatewayProxyHandler = async () => {
  console.log('Called function create-album');

  try {
    const code = crypto.randomBytes(8).toString('hex');
    const uuid = v1();

    // await createAlbum(code);

    const connection = await connectToDatabase();
    const [rows] = await connection.execute(`INSERT INTO album(code, uuid) VALUES(?, ?)`, [
      code,
      uuid,
    ]);

    console.log(`Function create-album finished: ${rows}`);

    return success(rows);
  } catch (err) {
    return failure(err.statusCode, { error: 'Could not create the album.' });
  }
};
