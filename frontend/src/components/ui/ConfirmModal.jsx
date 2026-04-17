export default function ConfirmModal({ 
  open, 
  onClose, 
  onConfirm, 
  title = "Are you sure?", 
  message = "This action cannot be undone.", 
  confirmText = "Delete", 
  cancelText = "Cancel",
  variant = "danger",
  loading = false
}) {
  if (!open) return null

  const getButtonClass = () => {
    switch (variant) {
      case 'danger': return 'bg-red-600 hover:bg-red-700 text-white disabled:opacity-50'
      case 'warning': return 'bg-amber-500 hover:bg-amber-600 text-white disabled:opacity-50'
      case 'success': return 'bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50'
      default: return 'bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50'
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-sm p-6 transition-colors">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 transition-colors">{title}</h2>
        <p className="text-sm text-gray-600 dark:text-slate-400 mb-6 transition-colors">{message}</p>
        
        <div className="flex justify-end gap-3">
          <button 
            type="button" 
            onClick={onClose} 
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-slate-300 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
          >
            {cancelText}
          </button>
          <button 
            type="button" 
            onClick={onConfirm} 
            disabled={loading}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${getButtonClass()}`}
          >
            {loading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
