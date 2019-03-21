import { APIGatewayProxyHandler, APIGatewayProxyEvent } from 'aws-lambda';
import { v1 } from 'uuid';
import { connectToDatabase } from '../db';
import { resizeImage } from '../image-resizer';
import { createImage } from '../S3-handler';
import { success, failure } from '../libs';

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

    console.log(`Function create-image finished: ${rows}`);

    return success(rows);
  } catch (err) {
    return failure(err.statusCode, { error: 'Could not create the image.' });
  }
};
