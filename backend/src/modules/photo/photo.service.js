import pool from '../../config/db.js';
import * as s3Utils from '../../utils/s3.utils.js';

export const addPhoto = async (unit_id, file, label, owner_id) => {
  // 0. Verify Ownership
  const ownerCheck = await pool.query(
    `SELECT u.id FROM units u
     JOIN properties p ON u.property_id = p.id
     WHERE u.id = $1 AND p.owner_id = $2`,
    [unit_id, owner_id]
  );
  if (!ownerCheck.rows.length) throw new Error('Unauthorized');

  const fileKey = `unit_${unit_id}/${Date.now()}_${file.originalname}`;
  
  // 1. Upload to B2
  await s3Utils.uploadToB2(file.buffer, fileKey, file.mimetype);
  
  // 2. Save to DB
  const result = await pool.query(
    'INSERT INTO unit_photos (unit_id, file_key, label) VALUES ($1, $2, $3) RETURNING *',
    [unit_id, fileKey, label]
  );
  
  const photo = result.rows[0];
  // 3. Return with signed URL
  photo.url = await s3Utils.getB2SignedUrl(photo.file_key);
  return photo;
};

export const getPhotosByUnit = async (unit_id, owner_id) => {
  // 0. Verify Ownership
  const ownerCheck = await pool.query(
    `SELECT u.id FROM units u
     JOIN properties p ON u.property_id = p.id
     WHERE u.id = $1 AND p.owner_id = $2`,
    [unit_id, owner_id]
  );
  if (!ownerCheck.rows.length) throw new Error('Unauthorized');

  const result = await pool.query(
    'SELECT * FROM unit_photos WHERE unit_id = $1 ORDER BY uploaded_at DESC',
    [unit_id]
  );
  
  const photos = result.rows;
  
  // Generate signed URLs for all photos
  for (const photo of photos) {
    photo.url = await s3Utils.getB2SignedUrl(photo.file_key);
  }
  
  return photos;
};

export const deletePhoto = async (photo_id, unit_id, owner_id) => {
  // 1. Get file key and verify ownership in one go
  const result = await pool.query(
    `SELECT up.file_key FROM unit_photos up
     JOIN units u ON up.unit_id = u.id
     JOIN properties p ON u.property_id = p.id
     WHERE up.id = $1 AND up.unit_id = $2 AND p.owner_id = $3`,
    [photo_id, unit_id, owner_id]
  );
  
  if (result.rows.length === 0) throw new Error('Photo not found or unauthorized');
  
  const fileKey = result.rows[0].file_key;
  
  // 2. Delete from B2
  await s3Utils.deleteFromB2(fileKey);
  
  // 3. Delete from DB
  await pool.query('DELETE FROM unit_photos WHERE id = $1', [photo_id]);
};
