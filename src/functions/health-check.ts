import { APIGatewayProxyHandler } from 'aws-lambda';
import { connectToDatabase } from '../db';
import { success, failure } from '../libs';

export const main: APIGatewayProxyHandler = async () => {
  console.log('Called function health-check');

  try {
    await connectToDatabase();

    console.log('Function healt-check finished');

    return success({ message: 'Connection successful.' });
  } catch (err) {
    console.log(err);
    return failure(err.statusCode, { error: 'Connection failed.' });
  }
};
