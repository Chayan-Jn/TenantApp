
import { api } from './client.js'

export const createBill = (body) => api('/bills', { method: 'POST', body })

export const getBills = (params) => {
  const query = new URLSearchParams(params).toString()
  return api(`/bills?${query}`)
}

export const getBillSplits = (id) => api(`/bills/${id}/splits`)

export const deleteBill = (id) => api(`/bills/${id}`, { method: 'DELETE' })

export const updateBill = (id, body) => api(`/bills/${id}`, { method: 'PATCH', body })

export const updateBillStatus = (id, status) => api(`/bills/${id}/status`, { 
  method: 'PATCH', 
  body: { status } 
})

export const updateSplitStatus = (splitId, status) => api(`/bills/splits/${splitId}/status`, { 
  method: 'PATCH', 
  body: { status } 
})