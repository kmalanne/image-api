import * as sharp from 'sharp';

export const resizeImage = async (
  image: string,
  width: number,
  height: number
): Promise<string> => {
  const imageBuffer = Buffer.from(image.split(';base64,').pop(), 'base64');

  try {
    const resizedImage = await sharp(imageBuffer)
      .resize(width, height, { fit: 'inside' })
      .toBuffer();

    return resizedImage;
  } catch (err) {
    console.log(`Image resize failed: ${err.message}`);
    throw new Error(err);
  }
};
