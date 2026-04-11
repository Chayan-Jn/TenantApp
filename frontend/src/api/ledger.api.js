import { api } from './client.js'

export const getLedger = (data) => api('/ledger', {
  method: 'POST',
  body: data 
})