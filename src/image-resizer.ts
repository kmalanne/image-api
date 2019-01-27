import * as sharp from 'sharp';

export const resizeImage = (image: string, width: number, height: number): Promise<object> => {
  const imageBuffer = Buffer.from(image.split(';base64,').pop(), 'base64');

  return new Promise((res, rej) =>
    sharp(imageBuffer)
      .resize(width, height, { fit: 'inside' })
      .toBuffer()
      .then(data => {
        return res({
          data,
        });
      })
      .catch(err => rej(err))
  );
};
