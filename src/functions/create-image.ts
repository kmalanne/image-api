import { APIGatewayProxyHandler, APIGatewayProxyEvent } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import { v1 } from 'uuid';
import { connectToDatabase } from '../db';
// import { resizeImage } from '../image-resizer';
import { atob } from '../utils';
import { success, failure } from '../libs';

const accessKeyId = atob(process.env.ACCESS_KEY_ID);
const secretAccessKey = atob(process.env.SECRET_ACCESS_KEY);

const bucket = process.env.S3_BUCKET_NAME;
const region = process.env.S3_BUCKET_REGION;

const bucketURL = `https://s3-${region}.amazonaws.com/${bucket}`;

const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  accessKeyId,
  secretAccessKey,
  region,
});

export const main: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
  const albumId = event.pathParameters.id;
  const data = JSON.parse(event.body);

  console.log(`Called function create-image with id: ${albumId}`);

  try {
    const connection = await connectToDatabase();
    const [row] = await connection.execute(
      `SELECT code 
       FROM album
       WHERE album.id = ?`,
      [albumId]
    );
    const albumName = row[0].code;

    const encodedImage = data.image;
    // const thumbnailImage = await resizeImage(encodedImage, 500, 500);
    // const previewImage = await resizeImage(encodedImage, 1024, 768);

    // const thumbnailURL = await createImage(albumName, v1(), thumbnailImage);
    // const previewURL = await createImage(albumName, v1(), previewImage);
    const image = new Buffer(encodedImage.split(';base64,').pop(), 'base64');
    const thumbnailURL = await createImage(albumName, v1(), image);
    const previewURL = await createImage(albumName, v1(), image);

    const [rows] = await connection.execute(
      `INSERT INTO image(album, thumbnail_url, preview_url) VALUES(?, ?, ?)`,
      [albumId, thumbnailURL, previewURL]
    );

    console.log(`Function create-image finished:`, rows);

    return success({
      id: (rows as any).insertId,
      thumbnailURL,
      previewURL,
    });
  } catch (err) {
    return failure(err.statusCode, { error: 'Could not create the image.' });
  }
};

const createImage = async (album: string, imageName: string, image: Buffer): Promise<string> => {
  const key = `${album}/${imageName}`;

  console.log(`Creating image ${key} to S3 (${bucket})`);

  try {
    const response = await s3
      .putObject({
        Bucket: bucket,
        Key: key,
        Body: image,
      })
      .promise();

    console.log(`Image created to S3`, response);

    return `${bucketURL}/${key}`;
  } catch (err) {
    console.error(`Could not create image to S3: ${err}`);
    throw new Error(err);
  }
};
