import * as AWS from 'aws-sdk';

const s3 = new AWS.S3();

const bucket = process.env.S3_BUCKET_NAME;

export const createAlbum = async (name: string): Promise<void> => {
  try {
    await s3.putObject({ Bucket: bucket, Key: name }).promise();
  } catch (err) {
    throw new Error();
  }
};

export const createImage = async (album: string, imageKey: string): Promise<void> => {
  try {
    await s3.putObject({ Bucket: bucket, Key: `${album}/${imageKey}` }).promise();
  } catch (err) {
    throw new Error();
  }
};
