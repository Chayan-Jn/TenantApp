import * as paymentsService from './payments.service.js'

export const getPayments = async (req, res) => {
  try {
    const { month, year, property_id } = req.query
    if (!month || !year) return res.status(400).json({ success: false, message: 'month and year are required' })

    const data = await paymentsService.getPayments({
      owner_id: req.owner.id,
      month,
      year,
      property_id
    })
    res.status(200).json({ success: true, data })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
}