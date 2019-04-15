import { APIGatewayProxyHandler } from 'aws-lambda';
import { connectToDatabase } from '../util/db';
import { success, failure } from '../util/response';

export const healthCheck: APIGatewayProxyHandler = async () => {
  console.log('Called function healthCheck.');

  try {
    await connectToDatabase();

    console.log('Function healthCheck finished.');

    return success({ message: 'Health check OK!' });
  } catch (err) {
    console.log(err);
    return failure(err.statusCode, { error: 'Health check FAILED.' });
  }
};
