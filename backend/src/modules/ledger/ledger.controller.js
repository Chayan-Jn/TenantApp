import * as ledgerService from './ledger.service.js'

export const getLedger = async (req, res) => {
  try {
    const { property_id, month, year } = req.body
    
    const data = await ledgerService.generateLedger(
      property_id, 
      month, 
      year, 
      req.owner.id
    )
    
    res.status(200).json({ success: true, data })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
}