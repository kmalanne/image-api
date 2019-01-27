import { APIGatewayProxyHandler } from 'aws-lambda';
import { connectToDatabase } from '../db';
import { success, failure } from '../libs';

export const main: APIGatewayProxyHandler = async () => {
  try {
    await connectToDatabase();
    return success({ message: 'Connection successful.' });
  } catch (err) {
    return failure(err.statusCode, { error: 'Connection failed.' });
  }
};
