import * as tenantService from './tenant.service.js'

export const createTenant = async (req, res) => {
  try {
    const tenant = await tenantService.createTenant({
      owner_id: req.owner.id,
      ...req.body
    })
    res.status(201).json({ success: true, data: tenant })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
}

export const getTenants = async (req, res) => {
  try {
    const { property_id } = req.query
    if (!property_id) return res.status(400).json({ success: false, message: 'property_id is required' })
    const tenants = await tenantService.getTenantsByProperty(property_id, req.owner.id)
    res.status(200).json({ success: true, data: tenants })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
}

export const removeTenant = async (req, res) => {
  try {
    const tenant = await tenantService.removeTenant(req.params.id, req.owner.id)
    res.status(200).json({ success: true, data: tenant })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
}