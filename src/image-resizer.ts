import * as sharp from 'sharp';

export const resizeImage = async (
  image: string,
  width: number,
  height: number
): Promise<string> => {
  console.log('Resizing image.');

  const imageBuffer = Buffer.from(image.split(';base64,').pop(), 'base64');

  try {
    const resizedImage = await sharp(imageBuffer)
      .resize(width, height, { fit: 'inside' })
      .toBuffer();

    console.log('Image resize successful!');

    return resizedImage;
  } catch (err) {
    console.error(`Image resize failed: ${err.message}`);
    throw new Error(err);
  }
};
