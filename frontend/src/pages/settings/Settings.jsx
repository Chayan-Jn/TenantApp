import { useState } from 'react'
import { useLoaderData } from 'react-router'
import { updateMe, updatePassword } from '../../api/owner.api.js'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import Input from '../../components/ui/Input.jsx'

export default function Settings() {
  const { data: owner } = useLoaderData()

  const [nameForm, setNameForm] = useState({ name: owner?.name || '' })
  const [passForm, setPassForm] = useState({ current_password: '', new_password: '' })
  const [nameLoading, setNameLoading] = useState(false)
  const [passLoading, setPassLoading] = useState(false)
  const [nameSuccess, setNameSuccess] = useState('')
  const [passSuccess, setPassSuccess] = useState('')
  const [nameError, setNameError] = useState('')
  const [passError, setPassError] = useState('')

  const handleNameChange = (e) => setNameForm({ ...nameForm, [e.target.name]: e.target.value })
  const handlePassChange = (e) => setPassForm({ ...passForm, [e.target.name]: e.target.value })

  const handleUpdateName = async (e) => {
    e.preventDefault()
    setNameLoading(true)
    setNameError('')
    setNameSuccess('')
    try {
      await updateMe(nameForm)
      setNameSuccess('Name updated successfully')
    } catch (err) {
      setNameError(err.message)
    } finally {
      setNameLoading(false)
    }
  }

  const handleUpdatePassword = async (e) => {
    e.preventDefault()
    setPassLoading(true)
    setPassError('')
    setPassSuccess('')
    try {
      await updatePassword(passForm)
      setPassSuccess('Password updated successfully')
      setPassForm({ current_password: '', new_password: '' })
    } catch (err) {
      setPassError(err.message)
    } finally {
      setPassLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your account</p>
      </div>

      {/* Profile */}
      <Card>
        <h2 className="text-base font-semibold text-gray-900 mb-4">Profile</h2>
        <div className="text-sm text-gray-500 mb-4">
          Username: <span className="font-medium text-gray-700">@{owner?.username}</span>
        </div>
        <form onSubmit={handleUpdateName} className="flex flex-col gap-4">
          <Input
            label="Name"
            name="name"
            value={nameForm.name}
            onChange={handleNameChange}
            required
          />
          {nameError && <p className="text-sm text-red-500">{nameError}</p>}
          {nameSuccess && <p className="text-sm text-green-500">{nameSuccess}</p>}
          <Button type="submit" loading={nameLoading} className="self-start">
            Update Name
          </Button>
        </form>
      </Card>

      {/* Password */}
      <Card>
        <h2 className="text-base font-semibold text-gray-900 mb-4">Change Password</h2>
        <form onSubmit={handleUpdatePassword} className="flex flex-col gap-4">
          <Input
            label="Current Password"
            name="current_password"
            type="password"
            value={passForm.current_password}
            onChange={handlePassChange}
            required
          />
          <Input
            label="New Password"
            name="new_password"
            type="password"
            value={passForm.new_password}
            onChange={handlePassChange}
            required
          />
          {passError && <p className="text-sm text-red-500">{passError}</p>}
          {passSuccess && <p className="text-sm text-green-500">{passSuccess}</p>}
          <Button type="submit" loading={passLoading} className="self-start">
            Update Password
          </Button>
        </form>
      </Card>
    </div>
  )
}