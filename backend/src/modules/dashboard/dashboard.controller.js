import * as dashboardService from './dashboard.service.js'

export const getDashboardStats = async (req, res) => {
  try {
    const stats = await dashboardService.getDashboardStats(req.owner.id)
    res.status(200).json({ success: true, data: stats })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}