import Modal from './Modal.jsx'
import Button from './Button.jsx'

export default function AlertModal({ open, onClose, title = 'Notification', message }) {
  if (!open) return null
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div className="mt-2 text-sm text-gray-600 mb-6">{message}</div>
      <div className="flex justify-end border-t border-gray-100 pt-4">
        <Button onClick={onClose} className="bg-blue-600 hover:bg-blue-700 text-white border-none cursor-pointer shadow-sm">
          Okay
        </Button>
      </div>
    </Modal>
  )
}
