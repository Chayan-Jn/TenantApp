import { useState, useEffect } from 'react'
import { useLoaderData } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getLedger } from '../../api/ledger.api.js'
import { markRentPaid, markRentUnpaid, generateMonthlyRent } from '../../api/rent.api.js'
import { updateBillStatus, updateSplitStatus } from '../../api/bills.api.js'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import Badge from '../../components/ui/Badge.jsx'

const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN') : '-'
const formatCurrency = (n) => `₹${Number(n).toLocaleString('en-IN')}`

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const statusVariant = { paid: 'green', pending: 'yellow', overdue: 'red' }

// Default strict, professional template with no empty lines
const DEFAULT_TEMPLATE = `Hello {{tenant_name}},
This is a summary of pending dues for *{{monthName}} {{year}}* (Unit: {{unit_label}}).
*Due Details:*
{{dues_list}}
*Total Pending: ₹{{total_pending}}*`

// Injects the tenant's actual data into the template
const parseTemplate = (template, tenant, monthName, year) => {
  if (!tenant.phone || tenant.total_pending <= 0) return ''
  
  // UPDATE: Ensure we don't text the roommate asking them to pay the shared reference bill
  const pendingDues = tenant.dues.filter(d => d.status !== 'paid' && !d.is_shared_reference)
  let duesListStr = ''
  
  pendingDues.forEach(due => { 
    const dateStr = due.due_date ? ` (Due: ${formatDate(due.due_date)})` : ''
    duesListStr += `• ${due.title}: ₹${due.amount}${dateStr}\n` 
  })
  
  // Remove the very last newline so we don't accidentally create an empty line
  duesListStr = duesListStr.trimEnd()

  return template
    .replace(/{{tenant_name}}/g, tenant.tenant_name)
    .replace(/{{monthName}}/g, monthName)
    .replace(/{{year}}/g, year)
    .replace(/{{unit_label}}/g, tenant.unit_label)
    .replace(/{{dues_list}}/g, duesListStr)
    .replace(/{{total_pending}}/g, tenant.total_pending)
}

export default function Payments() {
  const { properties } = useLoaderData()
  const queryClient = useQueryClient()
  const now = new Date()

  const [month, setMonth] = useState(() => {
    const saved = sessionStorage.getItem('payments_month')
    return saved ? (saved === 'all' ? 'all' : Number(saved)) : now.getMonth() + 1
  })
  const [year, setYear] = useState(() => {
    const saved = sessionStorage.getItem('payments_year')
    return saved ? Number(saved) : now.getFullYear()
  })
  const [propertyId, setPropertyId] = useState(() => sessionStorage.getItem('payments_property') || 'all')

  // NEW: Template State & Session Storage
  const [messageTemplate, setMessageTemplate] = useState(() => sessionStorage.getItem('wa_template') || DEFAULT_TEMPLATE)
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false)

  useEffect(() => {
    sessionStorage.setItem('payments_month', month)
    sessionStorage.setItem('payments_year', year)
    sessionStorage.setItem('payments_property', propertyId)
    sessionStorage.setItem('wa_template', messageTemplate) // Keep template alive across reloads
  }, [month, year, propertyId, messageTemplate])

  const ledgerQueryKey = ['ledger', month, year, propertyId]

  const { data: ledgerRes, isFetching } = useQuery({
    queryKey: ledgerQueryKey,
    queryFn: () => getLedger({ month, year, property_id: propertyId }),
    staleTime: 1000 * 60 * 5
  })

  const data = ledgerRes?.data || null

  const actionMutation = useMutation({
    mutationFn: async (item) => {
      if (item.item_type === 'rent') return item.status === 'paid' ? await markRentUnpaid(item.id) : await markRentPaid(item.id)
      if (item.item_type === 'split') return await updateSplitStatus(item.id, item.status === 'paid' ? 'pending' : 'paid')
      if (item.item_type === 'unit_bill') return await updateBillStatus(item.id, item.status === 'paid' ? 'pending' : 'paid')
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ledgerQueryKey }),
    onError: (err) => alert(err.response?.data?.message || err.message)
  })

  const generateMutation = useMutation({
    mutationFn: (payload) => generateMonthlyRent(payload),
    onSuccess: (res) => {
      alert(`Generated: ${res.data.generated} records, Skipped: ${res.data.skipped} already existing`)
      queryClient.invalidateQueries({ queryKey: ledgerQueryKey })
    },
    onError: (err) => alert(err.response?.data?.message || err.message)
  })

  const handleGenerate = () => {
    if (month === 'all') return
    const isAll = propertyId === 'all'
    const promptMsg = isAll 
      ? `Generate rent for ALL active tenants across ALL properties for ${MONTHS[month - 1]} ${year}?`
      : `Generate rent for this specific property for ${MONTHS[month - 1]} ${year}?`

    if (!window.confirm(promptMsg)) return
    generateMutation.mutate({ property_id: isAll ? 'all' : Number(propertyId), month, year })
  }

  // NEW: 1-Click direct send function
  const handleDirectWhatsAppSend = (tenant, monthName) => {
    if (!tenant.phone) return
    const finalMessage = parseTemplate(messageTemplate, tenant, monthName, year)
    
    let cleanPhone = tenant.phone.replace(/\D/g, '')
    if (cleanPhone.length === 10) cleanPhone = `91${cleanPhone}`
    
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(finalMessage)}`
    window.open(url, 'whatsapp_messaging_tab', 'noopener,noreferrer')
  }

  const years = Array.from({ length: 5 }, (_, i) => now.getFullYear() - i)

  const groupedData = {} 
  if (data?.tenants) {
    data.tenants.forEach(tenant => {
      const duesByMonth = {}
      tenant.dues.forEach(due => {
        if (!duesByMonth[due.month]) duesByMonth[due.month] = []
        duesByMonth[due.month].push(due)
      })
      if (tenant.dues.length === 0 && month !== 'all') duesByMonth[month] = [] 

      Object.keys(duesByMonth).forEach(m => {
        const mInt = Number(m)
        if (!groupedData[mInt]) groupedData[mInt] = {}
        if (!groupedData[mInt][tenant.property_name]) groupedData[mInt][tenant.property_name] = []
        
        const monthDues = duesByMonth[m]
        groupedData[mInt][tenant.property_name].push({
          ...tenant,
          dues: monthDues,
          // UPDATE: Ensure total pending doesn't include shared references on the frontend either
          total_pending: monthDues.filter(d => d.status !== 'paid' && !d.is_shared_reference).reduce((sum, d) => sum + d.amount, 0)
        })
      })
    })
  }

  const sortedMonths = Object.keys(groupedData).map(Number).sort((a, b) => a - b)

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8 pb-16 relative">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Payments & Ledger</h1>
        <p className="text-sm text-slate-500 mt-1">Manage monthly rent and utility collections</p>
      </div>

      <Card className="p-5! border-slate-200 shadow-sm">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Month</label>
            <select
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-400 bg-white min-w-35 cursor-pointer"
              value={month}
              onChange={(e) => setMonth(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            >
              <option value="all">All Months</option>
              {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Year</label>
            <select
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-400 bg-white cursor-pointer"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
            >
              {years.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5 flex-1 min-w-50">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Property</label>
            <select
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-400 bg-white w-full cursor-pointer"
              value={propertyId}
              onChange={(e) => setPropertyId(e.target.value)}
            >
              <option value="all">All Properties</option>
              {properties.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
            <Button
              variant="outline"
              onClick={handleGenerate}
              loading={generateMutation.isPending}
              disabled={month === 'all' || generateMutation.isPending}
              className={`flex-1 sm:flex-none border-slate-300 ${month === 'all' ? 'text-slate-400 bg-slate-50 cursor-not-allowed' : 'text-slate-700 hover:bg-slate-50 cursor-pointer'}`}
            >
              {month === 'all' ? 'Select Month to Generate' : 'Generate Rent'}
            </Button>
          </div>
        </div>
      </Card>

      {isFetching && (
        <div className="flex justify-center py-4">
          <div className="animate-pulse flex items-center gap-2 text-slate-600 font-medium">
             Fetching ledger...
          </div>
        </div>
      )}

      {data && (
        <div className={`flex flex-col gap-12 transition-opacity duration-200 ${isFetching ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-700/70 mb-1">Total Collected</p>
              <p className="text-2xl font-black text-emerald-700">{formatCurrency(data.collected)}</p>
            </div>
            <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-amber-700/70 mb-1">Total Pending</p>
              <p className="text-2xl font-black text-amber-700">{formatCurrency(data.pending)}</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Total Billed</p>
              <p className="text-2xl font-black text-slate-700">{formatCurrency(data.collected + data.pending)}</p>
            </div>
          </div>

          {sortedMonths.length === 0 ? (
            <Card className="py-12 border-slate-200 shadow-sm">
              <p className="text-sm text-slate-500 text-center">No tenants or dues found for this period.</p>
            </Card>
          ) : (
            sortedMonths.map(mInt => {
              const propertiesForMonth = groupedData[mInt]
              const sortedProps = Object.keys(propertiesForMonth).sort()

              return (
                <div key={mInt} className="flex flex-col gap-6">
                  <div className="border-b-2 border-slate-800 pb-2 flex justify-between items-end">
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                      {MONTHS[mInt - 1]} {year}
                    </h2>
                  </div>

                  {sortedProps.map(propertyName => {
                    const tenants = propertiesForMonth[propertyName].sort((a, b) => 
                      a.unit_label.localeCompare(b.unit_label, undefined, { numeric: true, sensitivity: 'base' })
                    )

                    return (
                      <div key={`${mInt}-${propertyName}`} className="flex flex-col gap-4 ml-2">
                        <h3 className="text-lg font-bold text-slate-600 border-b border-slate-200 pb-1 mt-2">
                          {propertyName}
                        </h3>

                        <div className="flex flex-col gap-5">
                          {tenants.map((tenant) => (
                            <Card key={tenant.tenant_id} className="p-0! overflow-hidden border-slate-200 shadow-sm">
                              
                              <div className="bg-slate-50 px-5 py-4 border-b border-slate-100 flex justify-between items-center">
                                <div>
                                  <h4 className="text-base font-bold text-slate-800">
                                    Unit {tenant.unit_label} <span className="text-slate-400 font-normal mx-1">|</span> {tenant.tenant_name}
                                  </h4>
                                  
                                  {/* UPDATE: Directly sends message using the saved template */}
                                  {tenant.total_pending > 0 && tenant.phone && (
                                    <button 
                                      onClick={() => handleDirectWhatsAppSend(tenant, MONTHS[mInt - 1])}
                                      className="mt-1 inline-flex items-center gap-1.5 text-xs font-semibold text-green-700 hover:text-green-800 bg-green-100 hover:bg-green-200 px-2.5 py-1 rounded transition-colors cursor-pointer border-none"
                                    >
                                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.347-.272.297-1.04 1.016-1.04 2.479 0 1.463 1.065 2.876 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                                      Send Message
                                    </button>
                                  )}
                                </div>
                                <div className="text-right">
                                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Pending (This Month)</p>
                                  <p className={`text-lg font-black ${tenant.total_pending > 0 ? 'text-slate-700' : 'text-slate-400'}`}>
                                    {formatCurrency(tenant.total_pending)}
                                  </p>
                                </div>
                              </div>

                              <div className="divide-y divide-slate-100">
                                {tenant.dues.length === 0 ? (
                                  <div className="px-5 py-4 text-center text-sm text-slate-400">No dues generated for this month.</div>
                                ) : (
                                  tenant.dues.map((due) => (
                                    <div key={`${due.item_type}-${due.id}`} className={`px-5 py-3.5 flex justify-between items-center transition-colors ${due.is_shared_reference ? 'bg-slate-50/30' : 'hover:bg-slate-50/50'}`}>
                                      
                                      <div className="flex flex-col gap-1">
                                        <span className={`text-sm font-semibold ${due.is_shared_reference ? 'text-slate-500' : 'text-slate-700'}`}>{due.title}</span>
                                        {due.due_date && (
                                          <span className="text-xs text-slate-400 font-medium">Due: {formatDate(due.due_date)}</span>
                                        )}
                                      </div>

                                      <div className="flex items-center gap-4">
                                        <span className={`text-sm font-bold w-20 text-right ${due.is_shared_reference ? 'text-slate-400' : 'text-slate-700'}`}>
                                          {formatCurrency(due.amount)}
                                        </span>
                                        
                                        <div className="w-20 flex justify-center">
                                          <Badge variant={statusVariant[due.status] || 'yellow'}>{due.status}</Badge>
                                        </div>
                                        
                                        {/* UPDATE: Hide button for shared reference, show text instead */}
                                        <div className="w-28 flex justify-end">
                                          {due.is_shared_reference ? (
                                            <span className="text-[11px] text-slate-400 italic text-right leading-tight">
                                              Shared with<br/><span className="font-medium text-slate-500">{due.shared_with}</span>
                                            </span>
                                          ) : (
                                            <Button 
                                              type="button"
                                              size="sm" 
                                              variant={due.status === 'paid' ? 'ghost' : 'default'}
                                              disabled={actionMutation.isPending}
                                              className={
                                                due.status === 'paid' 
                                                  ? 'text-slate-500 hover:text-slate-800 hover:bg-slate-100 cursor-pointer disabled:opacity-50' 
                                                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm border-none cursor-pointer disabled:opacity-50'
                                              }
                                              onClick={() => actionMutation.mutate(due)}
                                            >
                                              {due.status === 'paid' ? 'Undo' : 'Mark Paid'}
                                            </Button>
                                          )}
                                        </div>
                                      </div>

                                    </div>
                                  ))
                                )}
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )
            })
          )}
        </div>
      )}

      {/* Floating Action Button to edit the template */}
      <button 
        onClick={() => setIsTemplateModalOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 bg-slate-800 hover:bg-slate-900 text-white rounded-full shadow-lg flex items-center justify-center cursor-pointer transition-transform hover:scale-105 z-40 border-none"
        title="Edit WhatsApp Template"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
        </svg>
      </button>

      {/* Global Template Editor Modal */}
      {isTemplateModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800">Edit Message Template</h3>
              <button 
                onClick={() => setIsTemplateModalOpen(false)} 
                className="text-slate-400 hover:text-slate-600 cursor-pointer border-none bg-transparent"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <div className="p-5 flex flex-col gap-4">
              <div className="bg-blue-50 text-blue-800 text-xs p-3 rounded border border-blue-100">
                <p className="font-semibold mb-1">Available Placeholders:</p>
                <ul className="list-disc pl-4 space-y-0.5">
                  <li><code>{'{{tenant_name}}'}</code> - Replaced with tenant's name</li>
                  <li><code>{'{{monthName}}'}</code> - E.g., April</li>
                  <li><code>{'{{year}}'}</code> - E.g., 2026</li>
                  <li><code>{'{{unit_label}}'}</code> - E.g., 101</li>
                  <li><code>{'{{dues_list}}'}</code> - The bulleted list of pending items</li>
                  <li><code>{'{{total_pending}}'}</code> - The final amount</li>
                </ul>
              </div>

              <textarea 
                className="w-full h-48 p-3 border border-slate-300 rounded-lg text-sm text-slate-700 outline-none focus:ring-2 focus:ring-slate-400 resize-none font-mono"
                value={messageTemplate}
                onChange={(e) => setMessageTemplate(e.target.value)}
              />
            </div>
            
            <div className="px-5 py-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center gap-3">
              <Button 
                variant="ghost" 
                onClick={() => setMessageTemplate(DEFAULT_TEMPLATE)} 
                className="text-slate-500 cursor-pointer text-xs"
              >
                Reset to Default
              </Button>
              <Button 
                onClick={() => setIsTemplateModalOpen(false)} 
                className="bg-slate-800 hover:bg-slate-900 text-white border-none cursor-pointer"
              >
                Save & Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}