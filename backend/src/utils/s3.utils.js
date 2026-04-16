import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from 'dotenv';

dotenv.config();

const { 
  BACKBLAZE_KEYID, 
  BACKBLAZE_APPLICATION_KEY, 
  BACKBLAZE_ENDPOINT, 
  BACKBLAZE_UNIT_NAME 
} = process.env;

const s3 = new S3Client({
  endpoint: `https://${BACKBLAZE_ENDPOINT}`,
  region: BACKBLAZE_ENDPOINT.split('.')[1], // e.g. us-east-005
  credentials: {
    accessKeyId: BACKBLAZE_KEYID,
    secretAccessKey: BACKBLAZE_APPLICATION_KEY,
  },
  forcePathStyle: true,
});

export const uploadToB2 = async (fileBuffer, fileName, mimeType) => {
  const params = {
    Bucket: BACKBLAZE_UNIT_NAME,
    Key: fileName,
    Body: fileBuffer,
    ContentType: mimeType,
  };
  
  await s3.send(new PutObjectCommand(params));
  return fileName;
};

export const deleteFromB2 = async (fileKey) => {
  const params = {
    Bucket: BACKBLAZE_UNIT_NAME,
    Key: fileKey,
  };
  
  await s3.send(new DeleteObjectCommand(params));
};

export const getB2SignedUrl = async (fileKey) => {
  const command = new GetObjectCommand({
    Bucket: BACKBLAZE_UNIT_NAME,
    Key: fileKey,
  });
  
  // Signed URL expires in 1 hour (3600 seconds)
  return await getSignedUrl(s3, command, { expiresIn: 3600 });
};
