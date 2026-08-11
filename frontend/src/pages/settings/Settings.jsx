import { useState } from 'react'
import { useLoaderData, useNavigate } from 'react-router'
import { updateMe, updatePassword, deleteAccount } from '../../api/owner.api.js'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import Input from '../../components/ui/Input.jsx'
import ConfirmModal from '../../components/ui/ConfirmModal.jsx'
import SignatureModal, { getSavedSignature, clearSavedSignature } from '../../components/ui/SignatureModal.jsx'

export default function Settings() {
    const { data: owner } = useLoaderData()
    const navigate = useNavigate()
    const isDemoAccount = owner?.id === 99999

    const [nameForm, setNameForm] = useState({ name: owner?.name || '' })
    const [passForm, setPassForm] = useState({ current_password: '', new_password: '' })
    const [nameLoading, setNameLoading] = useState(false)
    const [passLoading, setPassLoading] = useState(false)
    const [nameSuccess, setNameSuccess] = useState('')
    const [passSuccess, setPassSuccess] = useState('')
    const [nameError, setNameError] = useState('')
    const [passError, setPassError] = useState('')
    const [fieldErrors, setFieldErrors] = useState({})
    
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [deleteError, setDeleteError] = useState('')

    const [sigModalOpen, setSigModalOpen] = useState(false)
    const [savedSig, setSavedSig] = useState(() => getSavedSignature())

    const handleNameChange = (e) => setNameForm({ ...nameForm, [e.target.name]: e.target.value })
    const handlePassChange = (e) => setPassForm({ ...passForm, [e.target.name]: e.target.value })

    const handleUpdateName = async (e) => {
        e.preventDefault()
        setNameLoading(true)
        setNameError('')
        setNameSuccess('')
        setFieldErrors({})
        try {
            await updateMe(nameForm)
            setNameSuccess('Name updated successfully')
        } catch (err) {
            if (err.fieldErrors && Object.keys(err.fieldErrors).length > 0) {
                setFieldErrors(err.fieldErrors)
            } else {
                setNameError(err.message)
            }
        } finally {
            setNameLoading(false)
        }
    }

    const handleUpdatePassword = async (e) => {
        e.preventDefault()
        setPassLoading(true)
        setPassError('')
        setPassSuccess('')
        setFieldErrors({})
        try {
            await updatePassword(passForm)
            setPassSuccess('Password updated successfully')
            setPassForm({ current_password: '', new_password: '' })
        } catch (err) {
            if (err.fieldErrors && Object.keys(err.fieldErrors).length > 0) {
                setFieldErrors(err.fieldErrors)
            } else {
                setPassError(err.message)
            }
        } finally {
            setPassLoading(false)
        }
    }

    const handleDeleteAccount = async () => {
        setDeleteLoading(true)
        setDeleteError('')
        try {
            await deleteAccount()
            // Clear local storage and navigate to login
            navigate('/login', { replace: true })
        } catch (err) {
            setDeleteError(err.message)
            setDeleteLoading(false)
        }
    }

    return (
        <div className="max-w-xl mx-auto flex flex-col gap-6">
            <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white transition-colors">Settings</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 transition-colors">Manage your account</p>
            </div>

            {/* Profile */}
            <Card className="border-gray-200 dark:border-slate-700 transition-colors">
                <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4 transition-colors">Profile</h2>
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-4 transition-colors">
                    Username: <span className="font-medium text-gray-700 dark:text-gray-200">@{owner?.username}</span>
                </div>
                <form onSubmit={handleUpdateName} className="flex flex-col gap-4">
                    <Input
                        label="Name"
                        name="name"
                        maxLength="50"
                        value={nameForm.name}
                        onChange={handleNameChange}
                        error={fieldErrors.name}
                        required
                    />
                    {nameError && <p className="text-sm text-red-500">{nameError}</p>}
                    {nameSuccess && <p className="text-sm text-green-500">{nameSuccess}</p>}
                    <Button type="submit" loading={nameLoading} className="self-start">
                        Update Name
                    </Button>
                </form>
            </Card>

            {/* Signature */}
            <Card className="border-gray-200 dark:border-slate-700 transition-colors">
                <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-1 transition-colors">Signature</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Appears on receipts you generate. Stored on this device only.</p>

                {savedSig ? (
                    <div className="mb-4">
                        <div className="rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 p-4 flex items-center justify-center" style={{ minHeight: 100 }}>
                            <img src={savedSig} alt="Your signature" className="max-h-16 object-contain" />
                        </div>
                        <p className="text-xs text-gray-400 dark:text-slate-500 mt-2">✓ Signature saved — will be included in receipts</p>
                    </div>
                ) : (
                    <div className="mb-4 rounded-xl border-2 border-dashed border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 flex items-center justify-center p-6" style={{ minHeight: 80 }}>
                        <p className="text-sm text-gray-400 dark:text-slate-500">No signature saved yet</p>
                    </div>
                )}

                <div className="flex gap-3">
                    <Button onClick={() => setSigModalOpen(true)} className="self-start">
                        {savedSig ? 'Update Signature' : 'Add Signature'}
                    </Button>
                    {savedSig && (
                        <button
                            onClick={() => { clearSavedSignature(); setSavedSig(null) }}
                            className="px-4 py-2 text-sm font-semibold text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer"
                        >
                            Remove
                        </button>
                    )}
                </div>
            </Card>

            {/* Password */}
            <Card className="border-gray-200 dark:border-slate-700 transition-colors">
                <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4 transition-colors">Change Password</h2>
                <form onSubmit={handleUpdatePassword} className="flex flex-col gap-4">
                    <Input
                        label="Current Password"
                        name="current_password"
                        type="password"
                        value={passForm.current_password}
                        onChange={handlePassChange}
                        error={fieldErrors.current_password}
                        required
                    />
                    <Input
                        label="New Password"
                        name="new_password"
                        type="password"
                        value={passForm.new_password}
                        onChange={handlePassChange}
                        error={fieldErrors.new_password}
                        required
                    />
                    {passError && <p className="text-sm text-red-500">{passError}</p>}
                    {passSuccess && <p className="text-sm text-green-500">{passSuccess}</p>}
                    <Button type="submit" loading={passLoading} className="self-start">
                        Update Password
                    </Button>
                </form>
            </Card>

            {/* Danger Zone */}
            <Card className="border-red-200 dark:border-red-900/30 transition-colors bg-red-50/50 dark:bg-red-900/10">
                <h2 className="text-base font-semibold text-red-600 dark:text-red-400 mb-2 transition-colors">Danger Zone</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                </p>
                {deleteError && <p className="text-sm text-red-500 mb-4">{deleteError}</p>}
                <Button variant="danger" disabled={isDemoAccount} onClick={() => setDeleteModalOpen(true)} className="self-start font-bold">
                    Delete Account
                </Button>
            </Card>

            <SignatureModal
                isOpen={sigModalOpen}
                onClose={() => setSigModalOpen(false)}
                onSave={(dataUrl) => setSavedSig(dataUrl)}
            />

            <ConfirmModal
                open={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleDeleteAccount}
                title="Delete Account?"
                message="Are you completely sure? This will permanently delete your account, all properties, units, tenants, and bills data. This action CANNOT be undone."
                confirmText="Yes, Delete My Account"
                variant="danger"
                loading={deleteLoading}
            />

            {/* Legal */}
            <Card className="border-gray-200 dark:border-slate-700 transition-colors">
                <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-3 transition-colors">Legal</h2>
                <div className="flex flex-col gap-2">
                    {[
                        ['Privacy Policy', '/privacy-policy'],
                        ['Terms of Service', '/terms'],
                        ['Refund & Cancellation Policy', '/refund-policy'],
                        ['Contact Us', '/contact'],
                    ].map(([label, to]) => (
                        <a
                            key={to}
                            href={to}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-[#0ea5e9] hover:underline font-medium"
                        >
                            {label}
                        </a>
                    ))}
                </div>
            </Card>
        </div>
    )
}