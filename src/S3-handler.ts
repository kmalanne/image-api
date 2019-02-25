import * as AWS from 'aws-sdk';

const bucket = process.env.S3_BUCKET_NAME;
const bucketURL = `https://s3-${process.env.S3_BUCKET_REGION}.amazonaws.com/${bucket}`;

const s3 = new AWS.S3();

export const createAlbum = async (albumName: string): Promise<void> => {
  try {
    await s3.putObject({ Bucket: bucket, Key: albumName }).promise();
  } catch (err) {
    console.log(`Could not create album to S3: ${err.message}`);
    throw new Error(err);
  }
};

export const createImage = async (
  album: string,
  imageName: string,
  image: string
): Promise<string> => {
  try {
    const key = `${album}/${imageName}`;

    await s3
      .putObject({
        Bucket: bucket,
        Key: key,
        ACL: 'public-read',
        Body: Buffer.from(image.split(';base64,').pop(), 'base64'),
      })
      .promise();

    return `${bucketURL}/${key}`;
  } catch (err) {
    console.log(`Could not create image to S3: ${err.message}`);
    throw new Error(err);
  }
};
