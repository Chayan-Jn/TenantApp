import * as billsService from './bills.service.js'

export const createBill = async (req, res) => {
  try {
    const bill = await billsService.createBill({
      owner_id: req.owner.id,
      ...req.body
    })
    res.status(201).json({ success: true, data: bill })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
}

export const getBills = async (req, res) => {
  try {
    const { unit_id, property_id, month, year } = req.query
    const bills = await billsService.getBills({
      unit_id, property_id, month, year, owner_id: req.owner.id
    })
    res.status(200).json({ success: true, data: bills })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
}

export const getBillSplits = async (req, res) => {
  try {
    const splits = await billsService.getBillSplits(req.params.id, req.owner.id)
    res.status(200).json({ success: true, data: splits })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
}

export const deleteBill = async (req, res) => {
  try {
    const bill = await billsService.deleteBill(req.params.id, req.owner.id)
    res.status(200).json({ success: true, data: bill })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
}

export const updateBill = async (req, res) => {
  try {
    const bill = await billsService.updateBill(req.params.id, req.body, req.owner.id)
    res.status(200).json({ success: true, data: bill })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
}

export const updateBillStatus = async (req, res) => {
  try {
    const { status } = req.body
    if (!['paid', 'pending'].includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid status' })
    }
    const bill = await billsService.updateBillStatus(req.params.id, status, req.owner.id)
    res.status(200).json({ success: true, data: bill })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
}

export const updateSplitStatus = async (req, res) => {
  try {
    const { status } = req.body
    if (!['paid', 'pending'].includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid status' })
    }
    const split = await billsService.updateSplitStatus(req.params.id, status, req.owner.id)
    res.status(200).json({ success: true, data: split })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
}