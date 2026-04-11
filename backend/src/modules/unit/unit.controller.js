import * as unitService from './unit.service.js'

export const createUnit = async (req, res) => {
  try {
    const unit = await unitService.createUnit({
      owner_id: req.owner.id,
      ...req.body
    })
    res.status(201).json({ success: true, data: unit })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
}

export const getUnits = async (req, res) => {
  try {
    const { property_id } = req.query
    if (!property_id) return res.status(400).json({ success: false, message: 'property_id is required' })
    const units = await unitService.getUnitsByProperty(property_id, req.owner.id)
    res.status(200).json({ success: true, data: units })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
}

export const deleteUnit = async (req, res) => {
  try {
    const unit = await unitService.deleteUnit(req.params.id, req.owner.id)
    res.status(200).json({ success: true, data: unit })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
}

export const updateUnit = async (req, res) => {
  try {
    const unit = await unitService.updateUnit(req.params.id, req.body, req.owner.id)
    res.status(200).json({ success: true, data: unit })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
}

export const getUnitById = async (req, res) => {
  try {
    const unit = await unitService.getUnitById(req.params.id, req.owner.id)
    res.status(200).json({ success: true, data: unit })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
}