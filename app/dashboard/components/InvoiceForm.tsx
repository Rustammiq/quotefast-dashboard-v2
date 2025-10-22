'use client'

import React, { useState, useEffect } from 'react'
import { X, Plus, Save, Loader, Euro, FileText, User, Calendar } from 'lucide-react'
import { useTheme } from '../../../contexts/ThemeContext'

interface InvoiceItem {
  name: string
  description: string
  quantity: number
  price: number
  total: number
}

interface InvoiceFormProps {
  isOpen: boolean
  onClose: () => void
  invoice?: any
  onSave: (invoiceData: any) => Promise<void>
}

const Modal = ({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: React.ReactNode }) => {
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {children}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          aria-label="Sluiten"
        >
          <X size={24} />
        </button>
      </div>
    </div>
  )
}

export default function InvoiceForm({ isOpen, onClose, invoice, onSave }: InvoiceFormProps) {
  const { theme } = useTheme()
  const [formData, setFormData] = useState({
    invoice_number: '',
    customer_id: '',
    title: '',
    description: '',
    total: 0,
    status: 'draft',
    due_date: '',
    items: [] as InvoiceItem[]
  })
  const [isLoading, setIsLoading] = useState(false)
  const [customers, setCustomers] = useState([])

  useEffect(() => {
    if (isOpen) {
      fetchCustomers()
    }
  }, [isOpen])

  useEffect(() => {
    if (invoice) {
      setFormData({
        invoice_number: invoice.invoice_number || '',
        customer_id: invoice.customer_id || '',
        title: invoice.title || '',
        description: invoice.description || '',
        total: invoice.total || 0,
        status: invoice.status || 'draft',
        due_date: invoice.due_date ? new Date(invoice.due_date).toISOString().split('T')[0] : '',
        items: invoice.items ? JSON.parse(invoice.items) : []
      })
    } else {
      // Reset for new invoice
      setFormData({
        invoice_number: '',
        customer_id: '',
        title: '',
        description: '',
        total: 0,
        status: 'draft',
        due_date: '',
        items: []
      })
    }
  }, [invoice, isOpen])

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/customers')
      if (response.ok) {
        const data = await response.json()
        setCustomers(data.customers || [])
      }
    } catch (error) {
      console.error('Error fetching customers:', error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { name: '', description: '', quantity: 1, price: 0, total: 0 }]
    }))
  }

  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    setFormData(prev => {
      const newItems = [...prev.items]
      newItems[index] = { ...newItems[index], [field]: value }
      
      // Calculate total for this item
      if (field === 'quantity' || field === 'price') {
        newItems[index].total = newItems[index].quantity * newItems[index].price
      }
      
      // Calculate total for entire invoice
      const total = newItems.reduce((sum, item) => sum + item.total, 0)
      
      return { ...prev, items: newItems, total }
    })
  }

  const removeItem = (index: number) => {
    setFormData(prev => {
      const newItems = prev.items.filter((_, i) => i !== index)
      const total = newItems.reduce((sum, item) => sum + item.total, 0)
      return { ...prev, items: newItems, total }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      await onSave(formData)
      onClose()
    } catch (error) {
      console.error('Failed to save invoice:', error)
      // You can add error state handling here
    } finally {
      setIsLoading(false)
    }
  }

  const cardClass = theme === 'dark' 
    ? 'bg-gray-800 border-gray-700 text-white' 
    : 'bg-white border-gray-200 text-black'

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={`rounded-xl border ${cardClass} p-8 shadow-2xl`}>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <FileText className="w-6 h-6" />
          {invoice ? 'Factuur Bewerken' : 'Nieuwe Factuur Aanmaken'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Factuurnummer *</label>
              <input
                type="text"
                name="invoice_number"
                value={formData.invoice_number}
                onChange={handleChange}
                className={`w-full p-3 rounded-lg border ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-gray-50 border-gray-300 text-black'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                required
                placeholder="INV-2024-001"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Klant *</label>
              <select
                name="customer_id"
                value={formData.customer_id}
                onChange={handleChange}
                className={`w-full p-3 rounded-lg border ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-gray-50 border-gray-300 text-black'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                required
                aria-label="Selecteer een klant"
              >
                <option value="">Selecteer een klant</option>
                {customers.map((customer: any) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} ({customer.email})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Titel *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full p-3 rounded-lg border ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-gray-50 border-gray-300 text-black'
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              required
              placeholder="Factuur voor website ontwikkeling"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Beschrijving</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className={`w-full p-3 rounded-lg border ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-gray-50 border-gray-300 text-black'
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder="Beschrijving van de geleverde diensten..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={`w-full p-3 rounded-lg border ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-gray-50 border-gray-300 text-black'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                aria-label="Status selecteren"
              >
                <option value="draft">Concept</option>
                <option value="sent">Verzonden</option>
                <option value="paid">Betaald</option>
                <option value="overdue">Achterstallig</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Vervaldatum</label>
              <input
                type="date"
                name="due_date"
                value={formData.due_date}
                onChange={handleChange}
                className={`w-full p-3 rounded-lg border ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-gray-50 border-gray-300 text-black'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Totaalbedrag</label>
              <div className="relative">
                <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  step="0.01"
                  value={formData.total}
                  readOnly
                  className={`w-full pl-10 pr-3 py-3 rounded-lg border ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-gray-50 border-gray-300 text-black'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
              </div>
            </div>
          </div>

          {/* Invoice Items */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Factuur Items</h3>
              <button
                type="button"
                onClick={addItem}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Item Toevoegen
              </button>
            </div>

            {formData.items.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Nog geen items toegevoegd</p>
            ) : (
              <div className="space-y-4">
                {formData.items.map((item, index) => (
                  <div key={index} className={`p-4 rounded-lg border ${
                    theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">Naam</label>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => updateItem(index, 'name', e.target.value)}
                          className={`w-full p-2 rounded border ${
                            theme === 'dark' 
                              ? 'bg-gray-600 border-gray-500 text-white' 
                              : 'bg-white border-gray-300 text-black'
                          }`}
                          placeholder="Item naam"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Aantal</label>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                          className={`w-full p-2 rounded border ${
                            theme === 'dark' 
                              ? 'bg-gray-600 border-gray-500 text-white' 
                              : 'bg-white border-gray-300 text-black'
                          }`}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Prijs</label>
                        <input
                          type="number"
                          step="0.01"
                          value={item.price}
                          onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value) || 0)}
                          className={`w-full p-2 rounded border ${
                            theme === 'dark' 
                              ? 'bg-gray-600 border-gray-500 text-white' 
                              : 'bg-white border-gray-300 text-black'
                          }`}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Totaal</label>
                        <div className="relative">
                          <Euro className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="number"
                            step="0.01"
                            value={item.total}
                            readOnly
                            className={`w-full pl-8 pr-2 py-2 rounded border ${
                              theme === 'dark' 
                                ? 'bg-gray-600 border-gray-500 text-white' 
                                : 'bg-white border-gray-300 text-black'
                            }`}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="w-full p-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                          aria-label={`Item ${index + 1} verwijderen`}
                        >
                          <X className="w-4 h-4 mx-auto" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Annuleren
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Opslaan...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {invoice ? 'Bijwerken' : 'Aanmaken'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  )
}

