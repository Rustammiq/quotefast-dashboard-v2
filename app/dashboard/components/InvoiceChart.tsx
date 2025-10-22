"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../../../contexts/ThemeContext';
import { TrendingUp, DollarSign } from 'lucide-react';

const data = [
  { month: 'Jan', revenue: 12450, invoices: 8 },
  { month: 'Feb', revenue: 18900, invoices: 12 },
  { month: 'Mar', revenue: 15200, invoices: 10 },
  { month: 'Apr', revenue: 22100, invoices: 15 },
  { month: 'May', revenue: 18750, invoices: 11 },
  { month: 'Jun', revenue: 25600, invoices: 18 },
  { month: 'Jul', revenue: 28900, invoices: 20 },
  { month: 'Aug', revenue: 31200, invoices: 22 }
];

export default function InvoiceChart() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={`p-3 rounded-lg shadow-lg border ${
          isDark 
            ? 'bg-gray-800 border-gray-600 text-white' 
            : 'bg-white border-gray-200 text-gray-900'
        }`}>
          <p className="font-semibold mb-2">{label}</p>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm">Revenue: {formatCurrency(payload[0].value)}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm">Facturen: {payload[1].value}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const getTotalRevenue = () => {
    return data.reduce((sum, item) => sum + item.revenue, 0);
  };

  const getTotalInvoices = () => {
    return data.reduce((sum, item) => sum + item.invoices, 0);
  };

  return (
    <div className={`chart-container rounded-xl p-6 border transition-all duration-300 hover:shadow-lg ${
      isDark 
        ? 'bg-gray-800/50 border-gray-700/30 hover:border-gray-600/50' 
        : 'bg-white border-gray-200 hover:border-gray-300'
    }`}>
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${
            isDark ? 'bg-blue-500/20' : 'bg-blue-100'
          }`}>
            <DollarSign className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
          </div>
          <div>
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Revenue Over Tijd
            </h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Maandelijkse omzet en aantal facturen
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp className={`w-4 h-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
          <span className={`text-2xl font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
            {formatCurrency(getTotalRevenue())}
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={isDark ? '#374151' : '#e5e7eb'} 
            />
            <XAxis 
              dataKey="month" 
              stroke={isDark ? '#9ca3af' : '#6b7280'}
              fontSize={12}
            />
            <YAxis 
              yAxisId="left"
              stroke={isDark ? '#9ca3af' : '#6b7280'}
              fontSize={12}
              tickFormatter={(value) => `€${(value / 1000).toFixed(0)}k`}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              stroke={isDark ? '#9ca3af' : '#6b7280'}
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              yAxisId="left"
              dataKey="revenue" 
              fill="#3b82f6" 
              radius={[4, 4, 0, 0]}
              name="Revenue"
            />
            <Bar 
              yAxisId="right"
              dataKey="invoices" 
              fill="#10b981" 
              radius={[4, 4, 0, 0]}
              name="Facturen"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Footer */}
      <div className={`mt-4 pt-4 border-t ${
        isDark ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Revenue</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Facturen</span>
            </div>
          </div>
          <div className="text-right">
            <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
              Totaal: {formatCurrency(getTotalRevenue())} • {getTotalInvoices()} facturen
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

