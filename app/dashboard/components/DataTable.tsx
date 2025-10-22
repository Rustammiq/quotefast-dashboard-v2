"use client";
import { memo, useState, useCallback, useMemo } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { ChevronUp, ChevronDown, MoreHorizontal, CheckSquare, Square } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { motion, AnimatePresence } from 'framer-motion';

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
  width?: string;
}

interface DataTableProps {
  data: any[];
  columns: Column[];
  onRowClick?: (row: any) => void;
  onSort?: (column: string, direction: 'asc' | 'desc') => void;
  onBulkAction?: (action: string, selectedRows: any[]) => void;
  bulkActions?: Array<{
    label: string;
    action: string;
    icon?: React.ReactNode;
  }>;
  selectable?: boolean;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
}

function DataTable({
  data,
  columns,
  onRowClick,
  onSort,
  onBulkAction,
  bulkActions = [],
  selectable = false,
  loading = false,
  emptyMessage = "Geen data beschikbaar",
  className = ""
}: DataTableProps) {
  const { theme } = useTheme();
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  const isDark = theme === 'dark';

  const handleSort = useCallback((column: string) => {
    const newDirection = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortColumn(column);
    setSortDirection(newDirection);
    onSort?.(column, newDirection);
  }, [sortColumn, sortDirection, onSort]);

  const handleSelectAll = useCallback(() => {
    if (selectedRows.size === data.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(data.map((_, index) => index.toString())));
    }
  }, [selectedRows.size, data]);

  const handleSelectRow = useCallback((index: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedRows(newSelected);
  }, [selectedRows]);

  const handleBulkAction = useCallback((action: string) => {
    const selectedData = data.filter((_, index) => selectedRows.has(index.toString()));
    onBulkAction?.(action, selectedData);
  }, [data, selectedRows, onBulkAction]);

  const renderCell = useMemo(() => {
    const renderCellFunction = (column: Column, row: any, value: any) => {
    if (column.render) {
      return column.render(value, row);
    }
    
    // Check if column.key exists before using it
    if (!column.key) {
      return value;
    }
    
    // Special handling for common data types
    if (column.key.includes('status')) {
      return <StatusBadge status={value} size="sm" />;
    }
    
    if (column.key.includes('date') || column.key.includes('Date')) {
      return new Date(value).toLocaleDateString('nl-NL');
    }
    
    if (column.key.includes('amount') || column.key.includes('price') || column.key.includes('value')) {
      return new Intl.NumberFormat('nl-NL', {
        style: 'currency',
        currency: 'EUR'
      }).format(value);
    }
    
    return value;
    };
    return renderCellFunction;
  }, []);

  if (loading) {
    return (
      <div className={`rounded-lg border ${isDark ? 'bg-gray-800/50 border-gray-700/30' : 'bg-white border-gray-200'}`}>
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className={`mt-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Laden...</p>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`rounded-2xl border backdrop-blur-xl transition-all duration-300 ${
          isDark 
            ? 'bg-white/10 border-white/20' 
            : 'bg-gray-50/90 border-gray-400/60 shadow-lg'
        }`}
      >
        <div className="p-12 text-center">
          <motion.p 
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2 }}
            className={`text-lg font-medium ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            {emptyMessage}
          </motion.p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`rounded-2xl border backdrop-blur-xl transition-all duration-300 ${className} ${
        isDark 
          ? 'bg-white/10 border-white/20 hover:bg-white/15' 
          : 'bg-gray-50/90 border-gray-400/60 hover:bg-gray-100/90 shadow-lg'
      }`}
    >
      {/* Bulk Actions */}
      <AnimatePresence>
        {selectable && selectedRows.size > 0 && bulkActions.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`px-6 py-4 border-b backdrop-blur-xl transition-all duration-300 ${
              isDark 
                ? 'border-white/20 bg-white/5' 
                : 'border-gray-400/60 bg-gray-100/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-sm font-medium ${
                isDark ? 'text-gray-200' : 'text-gray-700'
              }`}>
                {selectedRows.size} item(s) geselecteerd
              </span>
              <div className="flex items-center gap-2">
                {bulkActions.map((action, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleBulkAction(action.action)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all duration-300 modern-glass-button ${
                      isDark
                        ? 'bg-blue-600/80 hover:bg-blue-600 text-white border-blue-500/30'
                        : 'bg-blue-600/90 hover:bg-blue-700 text-white shadow-lg'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {action.icon}
                    {action.label}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={`border-b backdrop-blur-xl ${
            isDark 
              ? 'border-white/20 bg-white/5' 
              : 'border-gray-400/60 bg-gray-100/50'
          }`}>
            <tr>
              {selectable && (
                <th className="px-4 py-4 text-left">
                  <motion.button
                    onClick={handleSelectAll}
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      isDark ? 'hover:bg-white/10' : 'hover:bg-gray-200/50'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {selectedRows.size === data.length ? (
                      <CheckSquare className="w-4 h-4 text-blue-500" />
                    ) : (
                      <Square className="w-4 h-4 text-gray-400" />
                    )}
                  </motion.button>
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-4 py-3 text-left font-medium ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}
                  {...(column.width && { style: { width: column.width } })}
                >
                  {column.sortable ? (
                    <button
                      onClick={() => handleSort(column.key)}
                      className={`flex items-center gap-1 hover:opacity-70 transition-opacity ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      {column.label}
                      {sortColumn === column.key && (
                        sortDirection === 'asc' ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )
                      )}
                    </button>
                  ) : (
                    column.label
                  )}
                </th>
              ))}
              <th className="px-4 py-3 text-right">
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Acties
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {data.map((row, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => onRowClick?.(row)}
                  className={`border-b transition-all duration-300 group ${
                    isDark 
                      ? 'border-white/10 hover:bg-white/5' 
                      : 'border-gray-400/30 hover:bg-gray-100/50'
                  } ${onRowClick ? 'cursor-pointer' : ''}`}
                  whileHover={{ x: 4 }}
                >
                  {selectable && (
                    <td className="px-4 py-4">
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectRow(index.toString());
                        }}
                        className={`p-2 rounded-lg transition-all duration-300 ${
                          isDark ? 'hover:bg-white/10' : 'hover:bg-gray-200/50'
                        }`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {selectedRows.has(index.toString()) ? (
                          <CheckSquare className="w-4 h-4 text-blue-500" />
                        ) : (
                          <Square className="w-4 h-4 text-gray-400" />
                        )}
                      </motion.button>
                    </td>
                  )}
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`px-4 py-4 text-sm transition-colors duration-300 ${
                        isDark ? 'text-gray-300 group-hover:text-white' : 'text-gray-700 group-hover:text-gray-900'
                      }`}
                    >
                      {renderCell(column, row, row[column.key])}
                    </td>
                  ))}
                  <td className="px-4 py-4 text-right">
                    <motion.button
                      onClick={(e) => e.stopPropagation()}
                      className={`p-2 rounded-lg transition-all duration-300 opacity-0 group-hover:opacity-100 ${
                        isDark ? 'hover:bg-white/10' : 'hover:bg-gray-200/50'
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      aria-label="Meer opties"
                      title="Meer opties"
                    >
                      <MoreHorizontal className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

export default memo(DataTable);
