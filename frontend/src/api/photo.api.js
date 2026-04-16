import { api } from './client.js';

export const getUnitPhotos = (unitId) => api(`/photos/${unitId}/photos`);

export const uploadUnitPhoto = (unitId, file, label) => {
  const formData = new FormData();
  formData.append('photo', file);
  if (label) formData.append('label', label);
  
  return fetch(`${import.meta.env.VITE_API_URL}/photos/${unitId}/photos`, {
    method: 'POST',
    body: formData,
    // Note: Do not set Content-Type header when using FormData, 
    // fetch will set it automatically with the boundary.
    credentials: 'include'
  }).then(async (res) => {
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to upload photo');
    return data;
  });
};

export const deleteUnitPhoto = (unitId, photoId) => api(`/photos/${unitId}/photos/${photoId}`, { method: 'DELETE' });
