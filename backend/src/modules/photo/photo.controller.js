import * as photoService from './photo.service.js';

export const uploadPhoto = async (req, res) => {
  try {
    const { unitId } = req.params;
    const { label } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No photo uploaded' });
    }
    
    // Validate Label
    if (label && label.length > 20) {
      return res.status(400).json({ success: false, message: 'Label cannot exceed 20 characters' });
    }
    
    // Check photo limit (max 10)
    const existing = await photoService.getPhotosByUnit(unitId, req.owner.id);
    if (existing.length >= 10) {
      return res.status(400).json({ success: false, message: 'Max 10 photos allowed per unit' });
    }

    const photo = await photoService.addPhoto(unitId, req.file, label, req.owner.id);
    res.status(201).json({ success: true, data: photo });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getPhotos = async (req, res) => {
  try {
    const { unitId } = req.params;
    const photos = await photoService.getPhotosByUnit(unitId, req.owner.id);
    res.status(200).json({ success: true, data: photos });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const deletePhoto = async (req, res) => {
  try {
    const { unitId, photoId } = req.params;
    await photoService.deletePhoto(photoId, unitId, req.owner.id);
    res.status(200).json({ success: true, message: 'Photo deleted successfully' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
