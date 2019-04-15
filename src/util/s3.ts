import * as AWS from 'aws-sdk';
import { atob } from '../util/helpers';

const bucket = process.env.S3_BUCKET_NAME;

const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  accessKeyId: atob(process.env.ACCESS_KEY_ID),
  secretAccessKey: atob(process.env.SECRET_ACCESS_KEY),
  region: process.env.S3_BUCKET_REGION,
});

export const uploadFile = async (filename: string, data: Buffer): Promise<string> => {
  console.log(`Creating file ${filename} to S3 (${bucket})`);

  try {
    const response = await s3
      .upload({
        Bucket: bucket,
        Key: filename,
        Body: data,
      })
      .promise();

    console.log(`File created to S3`, response);

    return response.Location;
  } catch (err) {
    console.error(`Could not create file to S3: ${err}`);
    throw new Error(err);
  }
};
