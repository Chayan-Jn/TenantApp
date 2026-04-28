import { useState, useRef, useEffect, useCallback } from 'react'
import { MdClose, MdDraw, MdUpload, MdBookmark, MdCheck, MdDelete, MdRefresh } from 'react-icons/md'

const STORAGE_KEY = 'mytenant_signature'

export function getSavedSignature() {
    return localStorage.getItem(STORAGE_KEY) || null
}

export function clearSavedSignature() {
    localStorage.removeItem(STORAGE_KEY)
}

export function saveSignature(dataUrl) {
    localStorage.setItem(STORAGE_KEY, dataUrl)
}

export default function SignatureModal({ isOpen, onClose, onSave }) {
    const [tab, setTab] = useState('draw')
    const [uploadPreview, setUploadPreview] = useState(null)
    const [savedSig, setSavedSig] = useState(() => getSavedSignature())
    const [isEmpty, setIsEmpty] = useState(true)

    const canvasRef = useRef(null)
    const isDrawing = useRef(false)
    const lastPos = useRef(null)

    // Reset canvas when modal opens or tab changes to draw
    useEffect(() => {
        if (isOpen && tab === 'draw') {
            setTimeout(() => {
                const canvas = canvasRef.current
                if (!canvas) return
                const ctx = canvas.getContext('2d')
                ctx.clearRect(0, 0, canvas.width, canvas.height)
                setIsEmpty(true)
            }, 50)
        }
    }, [isOpen, tab])

    // ─── Canvas drawing helpers ───
    const getPos = (e, canvas) => {
        const rect = canvas.getBoundingClientRect()
        const scaleX = canvas.width / rect.width
        const scaleY = canvas.height / rect.height
        if (e.touches) {
            return {
                x: (e.touches[0].clientX - rect.left) * scaleX,
                y: (e.touches[0].clientY - rect.top) * scaleY
            }
        }
        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        }
    }

    const startDraw = useCallback((e) => {
        e.preventDefault()
        isDrawing.current = true
        const canvas = canvasRef.current
        lastPos.current = getPos(e, canvas)
    }, [])

    const draw = useCallback((e) => {
        e.preventDefault()
        if (!isDrawing.current) return
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        const pos = getPos(e, canvas)
        ctx.beginPath()
        ctx.moveTo(lastPos.current.x, lastPos.current.y)
        ctx.lineTo(pos.x, pos.y)
        ctx.strokeStyle = '#1a1a1a'
        ctx.lineWidth = 2.5
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.stroke()
        lastPos.current = pos
        setIsEmpty(false)
    }, [])

    const stopDraw = useCallback((e) => {
        e?.preventDefault()
        isDrawing.current = false
        lastPos.current = null
    }, [])

    const clearCanvas = () => {
        const canvas = canvasRef.current
        if (!canvas) return
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
        setIsEmpty(true)
    }

    // ─── Upload handler ───
    const handleUpload = (e) => {
        const file = e.target.files[0]
        if (!file) return
        const reader = new FileReader()
        reader.onload = (ev) => setUploadPreview(ev.target.result)
        reader.readAsDataURL(file)
    }

    // ─── Save ───
    const handleSave = () => {
        let dataUrl = null
        if (tab === 'draw') {
            if (isEmpty) return
            dataUrl = canvasRef.current.toDataURL('image/png')
        } else if (tab === 'upload') {
            if (!uploadPreview) return
            dataUrl = uploadPreview
        } else if (tab === 'saved') {
            if (!savedSig) return
            dataUrl = savedSig
        }
        if (!dataUrl) return
        saveSignature(dataUrl)
        setSavedSig(dataUrl)
        onSave?.(dataUrl)
        onClose()
    }

    const handleClearSaved = () => {
        clearSavedSignature()
        setSavedSig(null)
    }

    if (!isOpen) return null

    const TABS = [
        { id: 'draw', label: 'Draw', Icon: MdDraw },
        { id: 'upload', label: 'Upload', Icon: MdUpload },
        { id: 'saved', label: 'Saved', Icon: MdBookmark },
    ]

    const canSave =
        (tab === 'draw' && !isEmpty) ||
        (tab === 'upload' && !!uploadPreview) ||
        (tab === 'saved' && !!savedSig)

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
                    <div>
                        <h2 className="text-base font-bold text-slate-900 dark:text-white">Signature</h2>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Will appear on receipts you generate</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                        <MdClose size={20} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-100 dark:border-slate-800">
                    {TABS.map(({ id, label, Icon }) => (
                        <button
                            key={id}
                            onClick={() => setTab(id)}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-semibold transition-colors cursor-pointer border-b-2 ${
                                tab === id
                                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                    : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                            }`}
                        >
                            <Icon size={16} />
                            {label}
                            {id === 'saved' && savedSig && (
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 ml-0.5" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="p-5">

                    {/* ── DRAW TAB ── */}
                    {tab === 'draw' && (
                        <div>
                            <div className="relative rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 overflow-hidden"
                                style={{ touchAction: 'none' }}>
                                <canvas
                                    ref={canvasRef}
                                    width={480}
                                    height={180}
                                    className="w-full cursor-crosshair block"
                                    onMouseDown={startDraw}
                                    onMouseMove={draw}
                                    onMouseUp={stopDraw}
                                    onMouseLeave={stopDraw}
                                    onTouchStart={startDraw}
                                    onTouchMove={draw}
                                    onTouchEnd={stopDraw}
                                />
                                {isEmpty && (
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <p className="text-slate-300 dark:text-slate-600 text-sm font-medium select-none">
                                            Sign here with mouse or finger
                                        </p>
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={clearCanvas}
                                className="mt-2 flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                            >
                                <MdRefresh size={14} /> Clear
                            </button>
                        </div>
                    )}

                    {/* ── UPLOAD TAB ── */}
                    {tab === 'upload' && (
                        <div>
                            <label className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition-colors p-6"
                                style={{ minHeight: 160 }}>
                                {uploadPreview ? (
                                    <img
                                        src={uploadPreview}
                                        alt="Uploaded signature"
                                        className="max-h-24 object-contain"
                                    />
                                ) : (
                                    <>
                                        <MdUpload size={32} className="text-slate-300 dark:text-slate-600" />
                                        <div className="text-center">
                                            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Click to upload</p>
                                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">PNG, JPG, or SVG — transparent bg recommended</p>
                                        </div>
                                    </>
                                )}
                                <input
                                    type="file"
                                    accept="image/png,image/jpeg,image/svg+xml,image/webp"
                                    className="hidden"
                                    onChange={handleUpload}
                                />
                            </label>
                            {uploadPreview && (
                                <button
                                    onClick={() => setUploadPreview(null)}
                                    className="mt-2 flex items-center gap-1 text-xs text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                                >
                                    <MdDelete size={14} /> Remove
                                </button>
                            )}
                        </div>
                    )}

                    {/* ── SAVED TAB ── */}
                    {tab === 'saved' && (
                        <div>
                            {savedSig ? (
                                <>
                                    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 flex items-center justify-center" style={{ minHeight: 140 }}>
                                        <img
                                            src={savedSig}
                                            alt="Saved signature"
                                            className="max-h-24 object-contain"
                                        />
                                    </div>
                                    <button
                                        onClick={handleClearSaved}
                                        className="mt-2 flex items-center gap-1 text-xs text-red-400 hover:text-red-600 transition-colors cursor-pointer"
                                    >
                                        <MdDelete size={14} /> Remove saved signature
                                    </button>
                                </>
                            ) : (
                                <div className="rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex flex-col items-center justify-center gap-2 p-8" style={{ minHeight: 160 }}>
                                    <MdBookmark size={32} className="text-slate-300 dark:text-slate-600" />
                                    <p className="text-sm text-slate-400 dark:text-slate-500 text-center">No saved signature yet.<br/>Draw or upload one first.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-slate-100 dark:border-slate-800">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!canSave}
                        className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-sm"
                    >
                        <MdCheck size={16} />
                        {tab === 'saved' ? 'Use This Signature' : 'Save & Use'}
                    </button>
                </div>
            </div>
        </div>
    )
}
