import { APIGatewayProxyHandler, APIGatewayProxyEvent } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import { v1 } from 'uuid';
import { connectToDatabase } from '../db';
import { resizeImage } from '../image-resizer';
import { success, failure } from '../libs';

const bucket = process.env.S3_BUCKET_NAME;
const bucketURL = `https://s3-${process.env.S3_BUCKET_REGION}.amazonaws.com/${bucket}`;

const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
});

export const main: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
  const data = JSON.parse(event.body);

  console.log('Called function create-image with body:');
  console.log(data);

  try {
    const encodedImage = data.image;
    const albumId = data.albumId;

    const connection = await connectToDatabase();
    const [row] = await connection.execute(
      `SELECT code 
       FROM album
       WHERE album.id = ?`,
      [albumId]
    );
    const albumName = row[0];

    const thumbnailImage = await resizeImage(encodedImage, 500, 500);
    const previewImage = await resizeImage(encodedImage, 1024, 768);

    const thumbnailURL = await createImage(albumName, v1(), thumbnailImage);
    const previewURL = await createImage(albumName, v1(), previewImage);

    const [rows] = await connection.execute(
      `INSERT INTO image(album, thumbnail_url, previewUrl) VALUES(?, ?, ?)`,
      [albumId, thumbnailURL, previewURL]
    );

    console.log(`Function create-image finished:`, rows);

    return success(rows);
  } catch (err) {
    return failure(err.statusCode, { error: 'Could not create the image.' });
  }
};

const createImage = async (album: string, imageName: string, image: string): Promise<string> => {
  const key = `${album}/${imageName}`;

  console.log(`Creating image ${key} to S3`);

  try {
    const response = await s3
      .upload({
        Bucket: bucket,
        Key: key,
        ACL: 'public-read',
        Body: Buffer.from(image.split(';base64,').pop(), 'base64'),
      })
      .promise();

    console.log(`Image created to S3`, response);

    return `${bucketURL}/${key}`;
  } catch (err) {
    console.error(`Could not create image to S3: ${err.message}`);
    throw new Error(err);
  }
};
