"use client";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useTheme } from '../../../contexts/ThemeContext';
import { CreditCard, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

const data = [
  { name: 'Betaald', value: 3, color: '#10b981', amount: 6967.5 },
  { name: 'Verzonden', value: 2, color: '#3b82f6', amount: 15367 },
  { name: 'Vervallen', value: 1, color: '#ef4444', amount: 3872 },
  { name: 'Concept', value: 1, color: '#f59e0b', amount: 14520 },
  { name: 'Geannuleerd', value: 1, color: '#6b7280', amount: 2178 }
];

export default function PaymentStatusChart() {
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

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const item = data.payload;
      return (
        <div className={`p-3 rounded-lg shadow-lg border ${
          isDark 
            ? 'bg-gray-800 border-gray-600 text-white' 
            : 'bg-white border-gray-200 text-gray-900'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: data.payload.color }}
            ></div>
            <span className="font-semibold">{data.name}</span>
          </div>
          <p className="text-sm">
            Aantal: {data.value} ({((data.value / 8) * 100).toFixed(1)}%)
          </p>
          <p className="text-sm font-medium">
            Bedrag: {formatCurrency(item.amount)}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap gap-4 justify-center mt-4">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            ></div>
            <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const getTotalAmount = () => {
    return data.reduce((sum, item) => sum + item.amount, 0);
  };

  const getPaidAmount = () => {
    return data.find(item => item.name === 'Betaald')?.amount || 0;
  };

  const getPaidPercentage = () => {
    return Math.round((getPaidAmount() / getTotalAmount()) * 100);
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
            isDark ? 'bg-green-500/20' : 'bg-green-100'
          }`}>
            <CreditCard className={`w-5 h-5 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
          </div>
          <div>
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Betaling Status
            </h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Verdeling van factuur betalingen
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className={`w-4 h-4 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
          <span className={`text-2xl font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
            {getPaidPercentage()}%
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Footer */}
      <div className={`mt-4 pt-4 border-t ${
        isDark ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Betaald</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Verzonden</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Vervallen</span>
            </div>
          </div>
          <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
            Betaald: {formatCurrency(getPaidAmount())} / {formatCurrency(getTotalAmount())}
          </span>
        </div>
      </div>

      {/* Status Icons */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className={`p-3 rounded-lg border ${
          isDark ? 'bg-green-500/10 border-green-500/20' : 'bg-green-50 border-green-200'
        }`}>
          <div className="flex items-center gap-2">
            <CheckCircle className={`w-4 h-4 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
            <span className={`text-sm font-medium ${isDark ? 'text-green-400' : 'text-green-600'}`}>
              Betaald
            </span>
          </div>
          <p className={`text-xs mt-1 ${isDark ? 'text-green-300' : 'text-green-700'}`}>
            {formatCurrency(getPaidAmount())}
          </p>
        </div>
        <div className={`p-3 rounded-lg border ${
          isDark ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-center gap-2">
            <AlertTriangle className={`w-4 h-4 ${isDark ? 'text-red-400' : 'text-red-600'}`} />
            <span className={`text-sm font-medium ${isDark ? 'text-red-400' : 'text-red-600'}`}>
              Openstaand
            </span>
          </div>
          <p className={`text-xs mt-1 ${isDark ? 'text-red-300' : 'text-red-700'}`}>
            {formatCurrency(getTotalAmount() - getPaidAmount())}
          </p>
        </div>
      </div>
    </div>
  );
}

