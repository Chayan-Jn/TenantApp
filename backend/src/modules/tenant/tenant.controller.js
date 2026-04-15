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

/**
 * Fetches tenants based on query parameters.
 * Supports filtering by property_id (for building-wide lists) 
 * or unit_id (for specific room details).
 */
export const getTenants = async (req, res) => {
  try {
    const { property_id, unit_id } = req.query

    if (!property_id && !unit_id) {
      return res.status(400).json({
        success: false,
        message: 'Either property_id or unit_id is required'
      })
    }

    const status = req.query.status || 'active'
    let tenants

    if (unit_id) {
      tenants = await tenantService.getTenantsByUnitWithStatus(unit_id, req.owner.id, status)
    } else {
      tenants = await tenantService.getTenantsByProperty(property_id, req.owner.id, status)
    }

    res.status(200).json({ success: true, data: tenants })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
}

export const removeTenant = async (req, res) => {
  try {
    const { deposit_refunded, deposit_note } = req.body || {}
    const tenant = await tenantService.removeTenant(req.params.id, req.owner.id, { deposit_refunded, deposit_note })
    res.status(200).json({ success: true, data: tenant })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
}

export const getTenantById = async (req, res) => {
  try {
    const tenant = await tenantService.getTenantById(req.params.id, req.owner.id)
    res.status(200).json({ success: true, data: tenant })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
}
export const updateTenant = async (req, res) => {
  try {
    const tenant = await tenantService.updateTenant(req.params.id, req.body, req.owner.id)
    res.status(200).json({ success: true, data: tenant })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
}