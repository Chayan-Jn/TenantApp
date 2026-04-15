import Modal from './Modal.jsx'
import Button from './Button.jsx'

export default function ConfirmModal({ open, onClose, onConfirm, title, message, confirmText = 'Confirm', variant = 'danger' }) {
  if (!open) return null
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div className="mt-2 text-sm text-gray-600 mb-6">{message}</div>
      <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
        <Button variant="ghost" onClick={onClose} className="text-gray-600 border-none bg-transparent hover:bg-gray-100 cursor-pointer">
          Cancel
        </Button>
        <Button 
          className={`border-none cursor-pointer text-white shadow-sm ${variant === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`} 
          onClick={() => { onConfirm(); onClose(); }}
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  )
}
