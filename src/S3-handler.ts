import * as AWS from 'aws-sdk';

const bucket = process.env.S3_BUCKET_NAME;
const bucketURL = `https://s3-${process.env.S3_BUCKET_REGION}.amazonaws.com/${bucket}`;

const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
});

// export const createAlbum = async (albumName: string): Promise<void> => {
//   console.log(`Creating album ${albumName} to S3`);

//   try {
//     const response = await s3
//       .upload({
//         Bucket: bucket,
//         Key: `${albumName}/`,
//         Body: '',
//       })
//       .promise();
//     console.log('Album created to S3', response);
//   } catch (err) {
//     console.error(`Could not create album to S3: ${err.message}`);
//     throw new Error(err);
//   }
// };

export const createImage = async (
  album: string,
  imageName: string,
  image: string
): Promise<string> => {
  const key = `${album}/${imageName}`;

  console.log(`Creating image ${key} to S3`);

  try {
    await s3
      .putObject({
        Bucket: bucket,
        Key: key,
        ACL: 'public-read',
        Body: Buffer.from(image.split(';base64,').pop(), 'base64'),
      })
      .promise();

    console.log(`Image created to S3`);

    return `${bucketURL}/${key}`;
  } catch (err) {
    console.error(`Could not create image to S3: ${err.message}`);
    throw new Error(err);
  }
};
