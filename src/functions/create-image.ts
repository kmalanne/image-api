import { APIGatewayProxyHandler, APIGatewayProxyEvent } from 'aws-lambda';
import { v1 } from 'uuid';
import { connectToDatabase } from '../util/db';
import { resizeImage } from '../util/image-resizer';
import { uploadFile } from '../util/s3';
import { success, failure } from '../util/response';

export const createImage: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
  const albumId = event.pathParameters.id;
  const data = JSON.parse(event.body);
  const encodedImage = data.image;

  console.log(`Called function createImage with id: ${albumId}`);

  try {
    const connection = await connectToDatabase();
    const [row] = await connection.execute(
      `SELECT code
       FROM album
       WHERE album.id = ?`,
      [albumId]
    );
    const albumName = (row as any)[0].code;

    const thumbnailImage = await resizeImage(encodedImage, 500, 500);
    const thumbnalImageFilename = `${albumName}/${v1()}`;
    const thumbnailURL = await uploadFile(thumbnalImageFilename, thumbnailImage);

    const previewImage = await resizeImage(encodedImage, 1024, 768);
    const previewImageFilename = `${albumName}/${v1()}`;
    const previewURL = await uploadFile(previewImageFilename, previewImage);

    const [rows] = await connection.execute(
      `INSERT INTO image(album, thumbnail_url, preview_url) VALUES(?, ?, ?)`,
      [albumId, thumbnailURL, previewURL]
    );

    console.log(`Function createImage finished:`, rows);

    return success({
      id: (rows as any).insertId,
      thumbnailURL,
      previewURL,
    });
  } catch (err) {
    return failure(err.statusCode, { error: 'Could not create the image.' });
  }
};
