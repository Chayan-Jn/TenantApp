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