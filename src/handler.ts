import { APIGatewayProxyHandler } from 'aws-lambda';
import * as uuidv1 from 'uuid/v1';
import { connectToDatabase } from './db';
import { generateRandomCode } from './utils';

export const poll = async (): Promise<any> => {
  await connectToDatabase();
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Connection successful.' }),
  };
};

export const createAlbum = async () => {
  try {
    const code = generateRandomCode();
    const uuid = uuidv1();
    const connection = await connectToDatabase();

    const [rows] = await connection.execute('INSERT INTO album(code, uuid) VALUES(?, ?)', [
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

export const getImages: APIGatewayProxyHandler = async () => {
  console.log('TODO');
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'TODO' }),
  };
};
