import { APIGatewayProxyHandler, APIGatewayProxyEvent } from 'aws-lambda';
import { connectToDatabase } from '../db';
import { createImage } from '../S3-handler';
import { success, failure } from '../libs';

export const main: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
  try {
    const data = JSON.parse(event.body);

    const connection = await connectToDatabase();

    return success({ message: 'TODO' });
  } catch (err) {
    return failure(err.statusCode, { error: 'Could not create the image.' });
  }
};
