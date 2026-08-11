import * as ownerService from './owner.service.js'

export const getMe = async (req, res) => {
  try {
    const owner = await ownerService.getOwnerById(req.owner.id)
    res.status(200).json({ success: true, data: owner })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
}

export const updateMe = async (req, res) => {
  try {
    const owner = await ownerService.updateOwner(req.owner.id, req.body)
    res.status(200).json({ success: true, data: owner })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
}

export const updatePassword = async (req, res) => {
  try {
    await ownerService.updatePassword(req.owner.id, req.body)
    res.status(200).json({ success: true, message: 'Password updated' })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
}

export const deleteMe = async (req, res) => {
  try {
    if (req.owner.id === 99999) {
      return res.status(403).json({ success: false, message: 'Cannot delete the Demo Account.' })
    }
    
    await ownerService.deleteAccount(req.owner.id)
    // Clear the auth cookie manually as well to sign them out
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    })
    res.status(200).json({ success: true, message: 'Account deleted successfully' })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
}