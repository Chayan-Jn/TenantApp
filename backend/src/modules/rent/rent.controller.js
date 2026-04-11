import * as rentService from './rent.service.js'

export const createRentRecord = async (req, res) => {
  try {
    const rent = await rentService.createRentRecord({
      owner_id: req.owner.id,
      ...req.body
    })
    res.status(201).json({ success: true, data: rent })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
}

export const getRentByTenant = async (req, res) => {
    
  try {
    const { tenant_id } = req.query
    if (!tenant_id) return res.status(400).json({ success: false, message: 'tenant_id is required' })
    const rents = await rentService.getRentByTenant(tenant_id, req.owner.id)
    res.status(200).json({ success: true, data: rents })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
}

export const markRentPaid = async (req, res) => {
  try {
    const rent = await rentService.markRentPaid(req.params.id, req.owner.id)
    res.status(200).json({ success: true, data: rent })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
}

export const getOverdueRents = async (req, res) => {
  try {
    const { property_id } = req.query
    if (!property_id) return res.status(400).json({ success: false, message: 'property_id is required' })
    const rents = await rentService.getOverdueRents(property_id, req.owner.id)
    res.status(200).json({ success: true, data: rents })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
}

export const markRentUnpaid = async (req, res) => {
  try {
    const rent = await rentService.markRentUnpaid(req.params.id, req.owner.id)
    res.status(200).json({ success: true, data: rent })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
}

export const generateMonthlyRent = async (req, res) => {
  try {
    const { property_id, month, year } = req.body
    if (!property_id || !month || !year) {
      return res.status(400).json({ success: false, message: 'property_id, month and year are required' })
    }
    const result = await rentService.generateMonthlyRent({
      property_id,
      month,
      year,
      owner_id: req.owner.id
    })
    res.status(201).json({ success: true, data: result })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
}