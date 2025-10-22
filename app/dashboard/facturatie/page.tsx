"use client";
import { useState, useEffect, lazy, Suspense } from 'react';
import { useTheme } from "../../../contexts/ThemeContext";
import DashboardCard from "../components/DashboardCard";
import PageHeader from "../components/PageHeader";
import { logger } from '../../../utils/helpers/logger';
import { mockInvoices, getInvoicesStats } from "../../../lib/mockData/invoicesData";
import { FileText, Euro, CheckCircle, Clock, AlertTriangle, Send } from 'lucide-react';
import { useAuth } from '../../../app/providers';
import { Invoice } from '../../../types/ui/dashboard';

// Lazy load heavy components
const DataTable = lazy(() => import("../components/DataTable"));
const InvoiceChart = lazy(() => import("../components/InvoiceChart"));
const PaymentStatusChart = lazy(() => import("../components/PaymentStatusChart"));
const InvoiceForm = lazy(() => import('../components/InvoiceForm'));
const InvoiceDetailsModal = lazy(() => import('../components/InvoiceDetailsModal'));

// Force dynamic rendering for pages that use auth context
export const dynamic = 'force-dynamic';

export default function FacturatiePage() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const stats = getInvoicesStats();

  useEffect(() => {
    const fetchInvoices = async () => {
      if (!user) return;
      try {
        const response = await fetch('/api/invoices');
        if (!response.ok) {
          throw new Error('Failed to fetch invoices');
        }
        const data = await response.json();
        setInvoices(data.invoices);
      } catch (error) {
        console.error(error);
        // Fallback to mock data if API fails
        setInvoices(mockInvoices);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoices();
  }, [user]);

  const refreshInvoices = async () => {
    if (!user) return;
    try {
      const response = await fetch('/api/invoices');
      if (!response.ok) throw new Error('Failed to fetch invoices');
      const data = await response.json();
      setInvoices(data.invoices);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveInvoice = async (invoiceData: any) => {
    const method = editingInvoice ? 'PUT' : 'POST';
    const url = editingInvoice ? `/api/invoices/${editingInvoice.id}` : '/api/invoices';

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invoiceData),
    });

    if (!response.ok) throw new Error('Failed to save invoice');
    refreshInvoices();
  };

  const handleDeleteInvoice = async (invoiceId: string) => {
    if (!confirm('Weet je zeker dat je deze factuur wilt verwijderen?')) return;

    const response = await fetch(`/api/invoices/${invoiceId}`, { method: 'DELETE' });

    if (!response.ok) throw new Error('Failed to delete invoice');
    refreshInvoices();
    setIsDetailsModalOpen(false);
  };

  const filteredInvoices = invoices.filter(invoice =>
    (invoice.invoiceNumber && invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (invoice.client && invoice.client.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (invoice.description && invoice.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const columns = [
    {
      key: 'invoice_number',
      label: 'Factuur #',
      sortable: true,
      width: '120px'
    },
    {
      key: 'customers',
      label: 'Klant',
      sortable: true,
      render: (value: any, row: any) => (
        <div>
          <p className="font-medium">{value?.name || row.client}</p>
          <p className="text-sm text-gray-500">{value?.email || row.clientEmail}</p>
        </div>
      )
    },
    {
      key: 'total',
      label: 'Bedrag',
      sortable: true,
      render: (value: number) => new Intl.NumberFormat('nl-NL', {
        style: 'currency',
        currency: 'EUR'
      }).format(value)
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true
    },
    {
      key: 'created_at',
      label: 'Aangemaakt',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString('nl-NL')
    },
    {
      key: 'due_date',
      label: 'Vervaldatum',
      sortable: true,
      render: (value: string) => value ? new Date(value).toLocaleDateString('nl-NL') : '-'
    }
  ];

  const bulkActions = [
    { label: 'Exporteer geselecteerde', action: 'export', icon: <FileText className="w-4 h-4" /> },
    { label: 'Verstuur herinnering', action: 'remind', icon: <Send className="w-4 h-4" /> },
    { label: 'Markeer als betaald', action: 'markPaid', icon: <CheckCircle className="w-4 h-4" /> }
  ];

  const handleRowClick = (invoice: any) => {
    setSelectedInvoice(invoice);
    setIsDetailsModalOpen(true);
  };

  const handleBulkAction = (action: string, selectedRows: any[]) => {
    console.log(`Bulk action: ${action}`, { selectedRows });
    // Implement bulk actions
  };

  const handleCreateInvoice = () => {
    setEditingInvoice(null);
    setIsFormModalOpen(true);
  };

  const handleEditInvoice = (invoice: any) => {
    setEditingInvoice(invoice);
    setIsDetailsModalOpen(false); // Close details
    setIsFormModalOpen(true);   // Open form
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse">
              <div className="h-32 bg-gray-300 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <PageHeader
        title="Facturatie"
        description="Beheer je facturen en betalingen"
        showCreateButton={true}
        createButtonText="Nieuwe Factuur"
        onCreateClick={handleCreateInvoice}
        showSearch={true}
        searchPlaceholder="Zoek facturen..."
        onSearchChange={setSearchTerm}
        showFilters={true}
        onFilterClick={() => logger.info('Filter clicked', 'facturatie')}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <DashboardCard
          title="Totaal Facturen"
          value={stats.total}
          growth="18%"
          icon={<FileText className="h-5 w-5" />}
          progress={75}
          delay={0}
        />
        <DashboardCard
          title="Betaald"
          value={stats.paid}
          growth="25%"
          icon={<CheckCircle className="h-5 w-5" />}
          progress={Math.round((stats.paid / stats.total) * 100)}
          delay={100}
        />
        <DashboardCard
          title="Openstaand"
          value={stats.pending + stats.overdue}
          growth="-5%"
          trend="down"
          icon={<Clock className="h-5 w-5" />}
          progress={Math.round(((stats.pending + stats.overdue) / stats.total) * 100)}
          delay={200}
        />
        <DashboardCard
          title="Vervallen"
          value={stats.overdue}
          growth="0%"
          icon={<AlertTriangle className="h-5 w-5" />}
          progress={Math.round((stats.overdue / stats.total) * 100)}
          delay={300}
        />
        <DashboardCard
          title="Totaal Bedrag"
          value={`€${(stats.totalRevenue / 1000).toFixed(0)}k`}
          growth="22%"
          icon={<Euro className="h-5 w-5" />}
          progress={85}
          delay={400}
        />
        <DashboardCard
          title="Betaald Bedrag"
          value={`€${(stats.totalRevenue / 1000).toFixed(0)}k`}
          growth="28%"
          icon={<CheckCircle className="h-5 w-5" />}
          progress={Math.round((stats.paid / stats.total) * 100)}
          delay={500}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Suspense fallback={<div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />}>
          <InvoiceChart />
        </Suspense>
        <Suspense fallback={<div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />}>
          <PaymentStatusChart />
        </Suspense>
      </div>

      {/* Invoices Table */}
      <Suspense fallback={<div className="h-96 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />}>
        <DataTable
          data={filteredInvoices}
          columns={columns}
          onRowClick={handleRowClick}
          onBulkAction={handleBulkAction}
          bulkActions={bulkActions}
          selectable={true}
          emptyMessage="Geen facturen gevonden"
        />
      </Suspense>

      {/* Invoice Details Modal */}
      <Suspense fallback={null}>
        <InvoiceDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedInvoice(null);
          }}
          invoice={selectedInvoice}
          onEdit={handleEditInvoice}
          onSend={(invoice) => logger.info('Send invoice', 'facturatie', { invoice })}
          onDownload={(invoice) => logger.info('Download invoice', 'facturatie', { invoice })}
          onDelete={() => selectedInvoice && handleDeleteInvoice(selectedInvoice.id)}
        />
      </Suspense>

      {/* Invoice Form Modal */}
      <Suspense fallback={null}>
        <InvoiceForm
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
          invoice={editingInvoice}
          onSave={handleSaveInvoice}
        />
      </Suspense>
    </div>
  );
}
