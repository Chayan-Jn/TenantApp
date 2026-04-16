import { useState, useEffect } from 'react';
import { FiX, FiPlus, FiTrash2, FiMaximize2, FiChevronLeft, FiChevronRight, FiCamera } from 'react-icons/fi';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Button from '../ui/Button.jsx';
import Badge from '../ui/Badge.jsx';
import { getUnitPhotos, uploadUnitPhoto, deleteUnitPhoto } from '../../api/photo.api.js';
import ConfirmModal from '../ui/ConfirmModal.jsx';

export default function PhotoManagerModal({ isOpen, onClose, unitId, unitName }) {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('gallery'); // 'gallery' or 'upload'
  const [fullscreenPhoto, setFullscreenPhoto] = useState(null);
  
  // Upload State (separate from fetching)
  const [selectedFile, setSelectedFile] = useState(null);
  const [label, setLabel] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState('');
  const [photoToDelete, setPhotoToDelete] = useState(null);

  // 1. Query for fetching photos
  const { data: photos = [], isLoading, error: fetchError } = useQuery({
    queryKey: ['unitPhotos', unitId],
    queryFn: () => getUnitPhotos(unitId).then(res => res.data),
    enabled: !!unitId && isOpen,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  // 2. Mutation for Upload
  const uploadMutation = useMutation({
    mutationFn: ({ file, label }) => uploadUnitPhoto(unitId, file, label),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unitPhotos', unitId] });
      setSelectedFile(null);
      setPreviewUrl(null);
      setLabel('');
      setActiveTab('gallery');
    },
    onError: (err) => setError(err.message)
  });

  // 3. Mutation for Delete
  const deleteMutation = useMutation({
    mutationFn: (photoId) => deleteUnitPhoto(unitId, photoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unitPhotos', unitId] });
      if (fullscreenPhoto) setFullscreenPhoto(null);
    },
    onError: (err) => setError(err.message)
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!fullscreenPhoto) return;
      
      const currentIndex = photos.findIndex(p => p.id === fullscreenPhoto.id);
      
      if (e.key === 'ArrowRight') {
        const nextIndex = (currentIndex + 1) % photos.length;
        setFullscreenPhoto(photos[nextIndex]);
      } else if (e.key === 'ArrowLeft') {
        const prevIndex = (currentIndex - 1 + photos.length) % photos.length;
        setFullscreenPhoto(photos[prevIndex]);
      } else if (e.key === 'Escape') {
        setFullscreenPhoto(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [fullscreenPhoto, photos]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size exceeds 5MB limit');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;
    uploadMutation.mutate({ file: selectedFile, label });
  };

  const handleDeleteRequest = (photo) => {
    setPhotoToDelete(photo);
  };

  const handleConfirmDelete = async () => {
    if (!photoToDelete) return;
    deleteMutation.mutate(photoToDelete.id, {
      onSuccess: () => setPhotoToDelete(null)
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col h-[600px] max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Unit Condition Photos</h2>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{unitName}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-2 hover:bg-white rounded-full transition-all cursor-pointer">
            <FiX size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex px-6 border-b border-gray-100">
          <button 
            onClick={() => setActiveTab('gallery')}
            className={`px-6 py-3 text-sm font-bold transition-all border-b-2 ${activeTab === 'gallery' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
          >
            Gallery ({photos.length})
          </button>
          <button 
            onClick={() => setActiveTab('upload')}
            className={`px-6 py-3 text-sm font-bold transition-all border-b-2 ${activeTab === 'upload' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
            disabled={photos.length >= 10}
          >
            Upload New {photos.length >= 10 && <span className="text-xs text-red-500 ml-1">(Limit Reached)</span>}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {(error || fetchError) && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg flex items-center justify-between">
              <span>{error || fetchError.message}</span>
              <button onClick={() => setError('')} className="text-red-400 hover:text-red-600">&times;</button>
            </div>
          )}

          {activeTab === 'gallery' ? (
            isLoading ? (
              <div className="h-full flex flex-col items-center justify-center gap-3 animate-pulse">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <FiCamera size={24} className="text-gray-300" />
                </div>
                <p className="text-sm text-gray-400 font-medium">Fetching photos...</p>
              </div>
            ) : photos.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
                <FiCamera size={48} className="text-gray-300 mb-4" />
                <h3 className="text-lg font-bold text-gray-900">No photos yet</h3>
                <p className="text-sm text-gray-500 mt-1 max-w-[240px]">Document the room condition at move-in to avoid future disputes.</p>
                <Button variant="outline" className="mt-6" onClick={() => setActiveTab('upload')}>Upload First Photo</Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {photos.map((photo) => (
                  <div key={photo.id} className="group relative aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50 shadow-sm transition-all hover:shadow-md">
                    <img src={photo.url} alt={photo.label} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                      <div className="flex justify-end gap-2">
                         <button 
                          onClick={() => setFullscreenPhoto(photo)}
                          className="p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-lg text-white transition-all cursor-pointer"
                        >
                          <FiMaximize2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteRequest(photo)}
                          className="p-2 bg-red-500/80 hover:bg-red-500 rounded-lg text-white transition-all cursor-pointer"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                      {photo.label && (
                        <p className="text-[10px] font-bold text-white uppercase tracking-wider line-clamp-1 bg-black/20 backdrop-blur-[2px] px-1.5 py-0.5 rounded italic">
                          {photo.label}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <form onSubmit={handleUpload} className="space-y-6 h-full flex flex-col">
              <div className="flex-1 flex flex-col gap-6">
                <div 
                  className={`flex-1 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-4 transition-all ${selectedFile ? 'border-blue-200 bg-blue-50/30' : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50/20'}`}
                >
                  {previewUrl ? (
                    <div className="relative w-full h-full p-4 flex items-center justify-center">
                      <img src={previewUrl} className="max-w-full max-h-48 object-contain rounded-lg shadow-sm" alt="Preview" />
                      <button 
                        type="button"
                        onClick={() => { setSelectedFile(null); setPreviewUrl(null); if (previewUrl) URL.revokeObjectURL(previewUrl); }}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full shadow-lg hover:scale-110 transition-transform cursor-pointer"
                      >
                        <FiX size={14} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center">
                        <FiPlus size={32} />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold text-gray-900">Choose a photo</p>
                        <p className="text-xs text-gray-500 mt-1">JPEG, PNG, WebP (Max 5MB)</p>
                      </div>
                      <input 
                        type="file" 
                        id="photo-upload" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                      <label 
                        htmlFor="photo-upload"
                        className="mt-2 px-6 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 cursor-pointer shadow-sm transition-all active:scale-95"
                      >
                        Browse Files
                      </label>
                    </>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Photo Label (Optional)</label>
                    <span className={`text-[10px] font-bold ${label.length > 20 ? 'text-red-500' : 'text-gray-400'}`}>
                      {label.length}/20
                    </span>
                  </div>
                  <input 
                    type="text"
                    maxLength={20}
                    placeholder="e.g. Master Bedroom, Balcony Wall"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-medium"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 flex gap-3">
                <Button 
                  type="button" 
                  variant="ghost" 
                  className="flex-1 font-bold"
                  onClick={() => setActiveTab('gallery')}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 font-bold"
                  disabled={!selectedFile || uploadMutation.isPending}
                  loading={uploadMutation.isPending}
                >
                  {uploadMutation.isPending ? 'Uploading photo...' : 'Complete Upload'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal 
        isOpen={!!photoToDelete}
        onClose={() => setPhotoToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Unit Photo?"
        message="This photo will be permanently removed from our cloud storage and your records. This cannot be undone."
        isLoading={deleteMutation.isPending}
      />

      {/* Fullscreen Preview Overlay */}
      {fullscreenPhoto && (
        <div className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-4">
          <button 
            onClick={() => setFullscreenPhoto(null)} 
            className="absolute top-6 right-6 text-white/60 hover:text-white p-3 cursor-pointer z-[70] transition-all"
          >
            <FiX size={32} />
          </button>
          
          {/* Navigation Buttons */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              const idx = photos.findIndex(p => p.id === fullscreenPhoto.id);
              setFullscreenPhoto(photos[(idx - 1 + photos.length) % photos.length]);
            }}
            className="absolute left-6 top-1/2 -translate-y-1/2 p-4 text-white/40 hover:text-white hover:bg-white/10 rounded-full transition-all cursor-pointer z-[70]"
          >
            <FiChevronLeft size={32} />
          </button>

          <button 
            onClick={(e) => {
              e.stopPropagation();
              const idx = photos.findIndex(p => p.id === fullscreenPhoto.id);
              setFullscreenPhoto(photos[(idx + 1) % photos.length]);
            }}
            className="absolute right-6 top-1/2 -translate-y-1/2 p-4 text-white/40 hover:text-white hover:bg-white/10 rounded-full transition-all cursor-pointer z-[70]"
          >
            <FiChevronRight size={32} />
          </button>

          <img 
            src={fullscreenPhoto.url} 
            className="max-w-full max-h-full object-contain select-none animate-in fade-in zoom-in-95 duration-200" 
            alt="Fullscreen" 
          />
          
          <div className="absolute bottom-10 px-6 py-3 bg-white/10 backdrop-blur-md rounded-full text-white font-bold text-sm tracking-widest uppercase italic shadow-2xl">
            {fullscreenPhoto.label || 'Unit Photo'}
          </div>

          <div className="absolute bottom-24 text-white/40 text-xs font-bold uppercase tracking-widest">
            {photos.findIndex(p => p.id === fullscreenPhoto.id) + 1} / {photos.length}
          </div>
        </div>
      )}
    </div>
  );
}
