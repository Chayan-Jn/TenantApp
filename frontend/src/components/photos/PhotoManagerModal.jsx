import { useState, useEffect } from 'react';
import { FiX, FiPlus, FiTrash2, FiMaximize2, FiChevronLeft, FiChevronRight, FiCamera, FiUploadCloud } from 'react-icons/fi';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Button from '../ui/Button.jsx';
import Modal from '../ui/Modal.jsx';
import ConfirmModal from '../ui/ConfirmModal.jsx';
import { getUnitPhotos, uploadUnitPhoto, deleteUnitPhoto } from '../../api/photo.api.js';

export default function PhotoManagerModal({ open, onClose, unitId, unitName }) {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('gallery'); // 'gallery' or 'upload'
  const [fullscreenPhoto, setFullscreenPhoto] = useState(null);
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [label, setLabel] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState('');
  const [photoToDelete, setPhotoToDelete] = useState(null);

  const { data: photos = [], isLoading, error: fetchError } = useQuery({
    queryKey: ['unitPhotos', unitId],
    queryFn: () => getUnitPhotos(unitId).then(res => res.data),
    enabled: !!unitId && open,
    staleTime: 1000 * 60 * 5,
  });

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

  const handleConfirmDelete = async () => {
    if (!photoToDelete) return;
    deleteMutation.mutate(photoToDelete.id, {
      onSuccess: () => setPhotoToDelete(null)
    });
  };

  return (
    <Modal open={open} onClose={onClose} title={`Unit Photos: ${unitName}`} maxWidth="max-w-2xl">
      <div className="flex flex-col h-[600px] max-h-[70vh]">
        {/* Tabs */}
        <div className="flex border-b border-slate-100 -mx-6 px-6">
          <button 
            onClick={() => setActiveTab('gallery')}
            className={`px-6 py-3 text-sm font-bold transition-all border-b-2 ${activeTab === 'gallery' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
          >
            Gallery ({photos.length})
          </button>
          <button 
            onClick={() => setActiveTab('upload')}
            className={`px-6 py-3 text-sm font-bold transition-all border-b-2 ${activeTab === 'upload' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
            disabled={photos.length >= 10}
          >
            Upload New {photos.length >= 10 && <span className="text-xs text-rose-500 ml-1">(Limit Reached)</span>}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto pt-6">
          {(error || fetchError) && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-100 text-rose-600 text-sm rounded-lg flex items-center justify-between font-medium">
              <span>{error || fetchError.message}</span>
              <button onClick={() => setError('')} className="text-rose-400 hover:text-rose-600">&times;</button>
            </div>
          )}

          {activeTab === 'gallery' ? (
            isLoading ? (
              <div className="h-full flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm text-slate-400 font-bold">Photos Loading...</p>
              </div>
            ) : photos.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mb-6">
                  <FiCamera size={48} />
                </div>
                <h3 className="text-lg font-bold text-slate-900">No photos yet</h3>
                <p className="text-sm text-slate-500 mt-2 max-w-[280px]">Document the room condition to avoid future disputes.</p>
                <Button variant="outline" className="mt-8 font-bold" onClick={() => setActiveTab('upload')}>Upload First Photo</Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pb-4">
                {photos.map((photo) => (
                  <div key={photo.id} className="group relative bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md hover:-translate-y-1 block">
                    <div className="aspect-square rounded-lg overflow-hidden relative border border-slate-100">
                      <img src={photo.url} alt={photo.label} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex justify-center items-center gap-3 duration-200">
                        <button 
                          onClick={() => setFullscreenPhoto(photo)}
                          className="p-2.5 bg-white text-slate-800 rounded-full hover:bg-slate-100 transition-all cursor-pointer shadow-sm hover:scale-110"
                        >
                          <FiMaximize2 size={18} />
                        </button>
                        <button 
                          onClick={() => setPhotoToDelete(photo)}
                          className="p-2.5 bg-white text-rose-600 rounded-full hover:bg-rose-50 transition-all cursor-pointer shadow-sm hover:scale-110"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </div>
                    {photo.label && (
                      <p className="mt-2.5 mb-1 text-center text-xs font-semibold text-slate-600 tracking-wide truncate px-2">
                        {photo.label}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )
          ) : (
            <form onSubmit={handleUpload} className="space-y-6 h-full flex flex-col">
              <div className="flex-1 flex flex-col gap-6">
                <div 
                  className={`flex-1 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center gap-4 transition-all ${selectedFile ? 'border-blue-200 bg-blue-50/20' : 'border-slate-200 hover:border-blue-400 hover:bg-blue-50/10'}`}
                >
                  {previewUrl ? (
                    <div className="relative w-full h-full p-6 flex items-center justify-center">
                      <img src={previewUrl} className="max-w-full max-h-60 object-contain rounded-2xl shadow-xl animate-in zoom-in-95 duration-200" alt="Preview" />
                      <button 
                        type="button"
                        onClick={() => { setSelectedFile(null); setPreviewUrl(null); if (previewUrl) URL.revokeObjectURL(previewUrl); }}
                        className="absolute top-4 right-4 p-2 bg-rose-500 text-white rounded-full shadow-lg hover:scale-110 transition-transform cursor-pointer"
                      >
                        <FiX size={16} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-2">
                        <FiPlus size={40} />
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-slate-800">Select Room Photo</p>
                        <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest">Max File Size: 5MB</p>
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
                        className="mt-4 px-8 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 hover:bg-slate-50 cursor-pointer shadow-sm transition-all active:scale-95"
                      >
                        Browse Gallery
                      </label>
                    </>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between px-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Description</label>
                    <span className={`text-[10px] font-bold ${label.length > 20 ? 'text-rose-500' : 'text-slate-300'}`}>
                      {label.length}/20
                    </span>
                  </div>
                  <input 
                    type="text"
                    maxLength={20}
                    placeholder="e.g. Master Bedroom, Balcony Wall"
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-bold text-slate-700"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex gap-4">
                <Button 
                  type="button" 
                  variant="ghost" 
                  className="flex-1 font-bold h-12"
                  onClick={() => setActiveTab('gallery')}
                >
                  Back
                </Button>
                <Button 
                  type="submit" 
                  className="flex-2 font-bold h-12"
                  disabled={!selectedFile || uploadMutation.isPending}
                  loading={uploadMutation.isPending}
                >
                  Upload to Cloud
                </Button>
              </div>
            </form>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        <ConfirmModal 
          open={!!photoToDelete}
          onClose={() => setPhotoToDelete(null)}
          onConfirm={handleConfirmDelete}
          title="Delete Photo?"
          message="This action is permanent and will remove the photo from our secure storage."
          loading={deleteMutation.isPending}
        />

        {/* Fullscreen Preview Overlay */}
        {fullscreenPhoto && (
          <div className="fixed inset-0 z-[200] bg-slate-900/95 flex items-center justify-center p-4 backdrop-blur-md">
            <button 
              onClick={() => setFullscreenPhoto(null)} 
              className="absolute top-6 right-6 text-white/60 hover:text-white p-3 cursor-pointer z-[210] transition-all"
            >
              <FiX size={32} />
            </button>
            
            <button 
              onClick={(e) => {
                e.stopPropagation();
                const idx = photos.findIndex(p => p.id === fullscreenPhoto.id);
                setFullscreenPhoto(photos[(idx - 1 + photos.length) % photos.length]);
              }}
              className="absolute left-6 top-1/2 -translate-y-1/2 p-4 text-white/40 hover:text-white hover:bg-white/10 rounded-full transition-all cursor-pointer z-[210]"
            >
              <FiChevronLeft size={32} />
            </button>

            <button 
              onClick={(e) => {
                e.stopPropagation();
                const idx = photos.findIndex(p => p.id === fullscreenPhoto.id);
                setFullscreenPhoto(photos[(idx + 1) % photos.length]);
              }}
              className="absolute right-6 top-1/2 -translate-y-1/2 p-4 text-white/40 hover:text-white hover:bg-white/10 rounded-full transition-all cursor-pointer z-[210]"
            >
              <FiChevronRight size={32} />
            </button>

            <img 
              src={fullscreenPhoto.url} 
              className="max-w-full max-h-full object-contain select-none shadow-2xl rounded-lg animate-in fade-in zoom-in-95 duration-200" 
              alt="Fullscreen" 
            />
            
            <div className="absolute bottom-10 px-8 py-3 bg-white/10 backdrop-blur-md rounded-full text-white font-bold text-xs tracking-widest uppercase italic shadow-2xl border border-white/10">
              {fullscreenPhoto.label || 'Unit Photo'}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
