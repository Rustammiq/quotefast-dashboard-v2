"use client";
import { useTheme } from '../../../contexts/ThemeContext';
import { X, Download, Send, Edit, Eye, FileText, User, Calendar, Euro, CheckCircle, XCircle, Clock, Trash2 } from 'lucide-react';
import StatusBadge from './StatusBadge';

interface InvoiceDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: any;
  onEdit?: (invoice: any) => void;
  onSend?: (invoice: any) => void;
  onDownload?: (invoice: any) => void;
  onDelete?: () => void;
}

export default function InvoiceDetailsModal({
  isOpen,
  onClose,
  invoice,
  onEdit,
  onSend,
  onDownload,
  onDelete
}: InvoiceDetailsModalProps) {
  const { theme } = useTheme();
  
  if (!isOpen || !invoice) return null;

  const cardClass = theme === 'dark'
    ? 'bg-gray-800 border-gray-700 text-white'
    : 'bg-white border-gray-200 text-black';

  const statusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-500';
      case 'sent': return 'text-blue-500';
      case 'overdue': return 'text-red-500';
      case 'draft': return 'text-gray-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'sent': return <Send className="w-5 h-5 text-blue-500" />;
      case 'overdue': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'draft': return <Clock className="w-5 h-5 text-gray-500" />;
      default: return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const items = invoice.items ? (typeof invoice.items === 'string' ? JSON.parse(invoice.items) : invoice.items) : [];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className={`relative w-full max-w-4xl rounded-xl border ${cardClass} p-8 shadow-2xl max-h-[90vh] overflow-y-auto`}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors" aria-label="Sluiten">
          <X size={24} />
        </button>

        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
          <FileText className="w-7 h-7" />
          Factuur Details
        </h2>

        {/* Header Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <p className="text-gray-400 text-sm mb-1">Factuurnummer</p>
            <p className="text-xl font-semibold mb-4">{invoice.invoice_number || invoice.invoiceNumber}</p>

            <p className="text-gray-400 text-sm mb-1">Klant</p>
            <p className="text-lg flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-gray-500" /> 
              {invoice.customers?.name || invoice.client}
            </p>
            {invoice.customers?.email && (
              <p className="text-sm text-gray-500 ml-7">{invoice.customers.email}</p>
            )}

            <p className="text-gray-400 text-sm mb-1">Totaalbedrag</p>
            <p className="text-2xl font-bold flex items-center gap-2 text-green-600">
              <Euro className="w-6 h-6" /> 
              {new Intl.NumberFormat('nl-NL', { 
                style: 'currency', 
                currency: 'EUR' 
              }).format(invoice.total)}
            </p>
          </div>

          <div>
            <p className="text-gray-400 text-sm mb-1">Status</p>
            <div className="mb-4 flex items-center gap-2">
              {getStatusIcon(invoice.status)}
              <StatusBadge status={invoice.status} />
            </div>

            <p className="text-gray-400 text-sm mb-1">Aangemaakt op</p>
            <p className="text-lg flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-gray-500" /> 
              {new Date(invoice.created_at || invoice.createdDate).toLocaleDateString('nl-NL')}
            </p>

            {invoice.due_date && (
              <>
                <p className="text-gray-400 text-sm mb-1">Vervaldatum</p>
                <p className="text-lg flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-500" /> 
                  {new Date(invoice.due_date || invoice.dueDate).toLocaleDateString('nl-NL')}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Description */}
        {invoice.description && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3">Beschrijving</h3>
            <p className={`p-4 rounded-lg ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              {invoice.description}
            </p>
          </div>
        )}

        {/* Invoice Items */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Factuur Items</h3>
          {items && items.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`border-b ${
                    theme === 'dark' ? 'border-gray-600' : 'border-gray-200'
                  }`}>
                    <th className="text-left py-3 px-4 font-medium">Item</th>
                    <th className="text-center py-3 px-4 font-medium">Aantal</th>
                    <th className="text-right py-3 px-4 font-medium">Prijs</th>
                    <th className="text-right py-3 px-4 font-medium">Totaal</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item: any, index: number) => (
                    <tr key={index} className={`border-b ${
                      theme === 'dark' ? 'border-gray-700' : 'border-gray-100'
                    }`}>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          {item.description && (
                            <p className="text-sm text-gray-500">{item.description}</p>
                          )}
                        </div>
                      </td>
                      <td className="text-center py-3 px-4">{item.quantity}</td>
                      <td className="text-right py-3 px-4">
                        {new Intl.NumberFormat('nl-NL', { 
                          style: 'currency', 
                          currency: 'EUR' 
                        }).format(item.price)}
                      </td>
                      <td className="text-right py-3 px-4 font-medium">
                        {new Intl.NumberFormat('nl-NL', { 
                          style: 'currency', 
                          currency: 'EUR' 
                        }).format(item.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className={`border-t-2 ${
                    theme === 'dark' ? 'border-gray-600' : 'border-gray-300'
                  }`}>
                    <td colSpan={3} className="text-right py-3 px-4 font-semibold">
                      Totaal:
                    </td>
                    <td className="text-right py-3 px-4 font-bold text-lg">
                      {new Intl.NumberFormat('nl-NL', { 
                        style: 'currency', 
                        currency: 'EUR' 
                      }).format(invoice.total)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              Geen items toegevoegd aan deze factuur.
            </p>
          )}
        </div>

        {/* Payment Information */}
        {invoice.status === 'paid' && (
          <div className={`mb-8 p-4 rounded-lg ${
            theme === 'dark' ? 'bg-green-900/20 border border-green-800' : 'bg-green-50 border border-green-200'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
                Factuur Betaald
              </h3>
            </div>
            {invoice.paid_at && (
              <p className="text-green-700 dark:text-green-300">
                Betaald op: {new Date(invoice.paid_at).toLocaleDateString('nl-NL')}
              </p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
          {onEdit && (
            <button
              onClick={() => onEdit(invoice)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Edit className="w-4 h-4" />
              Bewerken
            </button>
          )}
          
          {onSend && invoice.status !== 'sent' && invoice.status !== 'paid' && (
            <button
              onClick={() => onSend(invoice)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors bg-green-600 hover:bg-green-700 text-white"
            >
              <Send className="w-4 h-4" />
              Verzenden
            </button>
          )}
          
          {onDownload && (
            <button
              onClick={() => onDownload(invoice)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Download className="w-4 h-4" />
              Downloaden
            </button>
          )}
          
          {onDelete && (
            <button
              onClick={onDelete}
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors bg-red-600 hover:bg-red-700 text-white"
            >
              <Trash2 className="w-4 h-4" />
              Verwijderen
            </button>
          )}
          
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors bg-gray-600 hover:bg-gray-700 text-white"
          >
            <X className="w-4 h-4" />
            Sluiten
          </button>
        </div>
      </div>
    </div>
  );
}

