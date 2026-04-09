import { api } from './client.js'

export const getPayments = ({ month, year, property_id }) => {
  const params = new URLSearchParams({ month, year })
  if (property_id && property_id !== 'all') params.append('property_id', property_id)
  return api(`/payments?${params.toString()}`)
}