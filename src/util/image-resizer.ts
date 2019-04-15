import sharp from 'sharp';

export const resizeImage = async (
  image: string,
  width: number,
  height: number
): Promise<Buffer> => {
  console.log('Resizing image.');

  const imageBuffer = new Buffer(image.split(';base64,').pop(), 'base64');

  try {
    const resizedImage = await sharp(imageBuffer)
      .resize(width, height, { fit: 'inside' })
      .toBuffer();

    console.log('Image resize successful!');

    return resizedImage;
  } catch (err) {
    console.error(`Image resize failed: ${err}`);
    throw new Error(err);
  }
};
