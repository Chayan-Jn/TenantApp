import { api } from './client.js'

export const getLedger = (params) => {
  const query = new URLSearchParams(params).toString()
  return api(`/ledger?${query}`)
}