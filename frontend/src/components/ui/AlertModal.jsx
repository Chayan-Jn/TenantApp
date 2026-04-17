export default function AlertModal({ open, onClose, message, title = "Notice" }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-sm p-6 transition-colors">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 transition-colors">{title}</h3>
            <p className="text-sm text-gray-600 dark:text-slate-400 transition-colors">{message}</p>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-800 dark:text-slate-200 text-sm font-medium rounded-lg transition-colors cursor-pointer"
          >
            Okay
          </button>
        </div>
      </div>
    </div>
  )
}
