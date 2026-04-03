import * as propertyService from './property.service.js'

export const createProperty = async (req, res) => {
  try {
    const property = await propertyService.createProperty({
      owner_id: req.owner.id,
      ...req.body
    })
    res.status(201).json({ success: true, data: property })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
}

export const getProperties = async (req, res) => {
  try {
    const properties = await propertyService.getPropertiesByOwner(req.owner.id)
    res.status(200).json({ success: true, data: properties })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

export const deleteProperty = async (req, res) => {
    try {
      const property = await propertyService.deleteProperty(req.params.id, req.owner.id)
      res.status(200).json({ success: true, data: property })
    } catch (err) {
      res.status(400).json({ success: false, message: err.message })
    }
  }