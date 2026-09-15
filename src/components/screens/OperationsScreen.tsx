import React, { useState } from 'react';
import { InventoryProduct, SqlQueryItem, Transaction } from '../../types';
import {
  Database,
  Download,
  CheckCircle2,
  Search,
  CreditCard,
  Landmark,
  Banknote,
  ExternalLink
} from 'lucide-react';

interface OperationsScreenProps {
  inventory: InventoryProduct[];
  transactions: Transaction[];
  sqlQueries: SqlQueryItem[];
  onOpenSqlModal: () => void;
  onQuickRestock: (sku: string) => void;
}

export const OperationsScreen: React.FC<OperationsScreenProps> = ({
  inventory,
  transactions,
  sqlQueries,
  onOpenSqlModal,
  onQuickRestock
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'settlements' | 'inventory' | 'postgres'>('settlements');
  const [searchTerm, setSearchTerm] = useState('');
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const filteredInventory = inventory.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTx = transactions.filter(t =>
    t.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.reference.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper function to safely escape CSV cell content
  const escapeCsvCell = (val: string | number | boolean | null | undefined): string => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  // Helper to trigger browser CSV file download
  const triggerCsvDownload = (filename: string, csvContent: string) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Export transactions to CSV
  const handleExportTransactions = () => {
    const headers = ['Transaction ID', 'Timestamp', 'Customer / Entity', 'Settlement Gateway', 'Branch Depot', 'Amount (NGN)', 'Status', 'Reference Code'];
    const rows = filteredTx.map(t => [
      escapeCsvCell(t.id),
      escapeCsvCell(t.time),
      escapeCsvCell(t.customer),
      escapeCsvCell(t.method),
      escapeCsvCell(t.branch),
      escapeCsvCell(t.amount),
      escapeCsvCell(t.status),
      escapeCsvCell(t.reference)
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const timestamp = new Date().toISOString().slice(0, 10);
    const filename = `koraops-settlement-transactions-${timestamp}.csv`;
    triggerCsvDownload(filename, csvContent);

    setExportNotice(`Exported ${filteredTx.length} transaction logs to ${filename}`);
    setTimeout(() => setExportNotice(null), 3500);
  };

  // Export SQL Queries to CSV
  const handleExportSqlQueries = () => {
    const headers = ['Query ID', 'Sub-Agent Source', 'SQL Statement', 'Execution Latency (ms)', 'Rows Returned', 'Touched Database Tables', 'Execution Timestamp', 'Status'];
    const rows = sqlQueries.map(q => [
      escapeCsvCell(q.id),
      escapeCsvCell(q.agent),
      escapeCsvCell(q.query),
      escapeCsvCell(q.executionTimeMs),
      escapeCsvCell(q.rowsReturned),
      escapeCsvCell(q.tablesTouched.join('; ')),
      escapeCsvCell(q.timestamp),
      escapeCsvCell(q.status)
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const timestamp = new Date().toISOString().slice(0, 10);
    const filename = `koraops-subagent-sql-telemetry-${timestamp}.csv`;
    triggerCsvDownload(filename, csvContent);

    setExportNotice(`Exported ${sqlQueries.length} SQL queries to ${filename}`);
    setTimeout(() => setExportNotice(null), 3500);
  };

  // Contextual export according to current sub-tab
  const handleExportCurrentView = () => {
    if (activeSubTab === 'postgres') {
      handleExportSqlQueries();
    } else {
      handleExportTransactions();
    }
  };

  return (
    <div className="flex flex-col w-full pb-24 max-w-screen-md mx-auto px-4 pt-3 space-y-4">
      {/* Screen Header */}
      <div className="bg-surface-container-low rounded-2xl p-4 border border-[#eaedff] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-secondary-container flex items-center justify-center text-on-secondary-container shadow-sm">
            <Database className="w-6 h-6 text-on-secondary-container" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-[17px] font-bold text-on-surface">Operations &amp; Telemetry</h2>
              <span className="px-2 py-0.5 rounded-full bg-secondary text-on-secondary text-[10px] font-bold">
                Live Postgres Stream
              </span>
            </div>
            <p className="text-[12px] text-on-surface-variant">
              Settlement gateways, multi-depot inventory, and database queries
            </p>
          </div>
        </div>

        {/* Global Export Action Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={handleExportCurrentView}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-secondary text-on-secondary text-[12px] font-semibold hover:bg-secondary/90 shadow-sm active:scale-95 transition-all"
            title="Download CSV for current active view"
          >
            <Download className="w-4 h-4" />
            <span>Export {activeSubTab === 'postgres' ? 'SQL Logs (CSV)' : 'Transactions (CSV)'}</span>
          </button>
        </div>
      </div>

      {/* Export Confirmation Toast / Notice */}
      {exportNotice && (
        <div className="px-4 py-2 bg-secondary-container text-on-secondary-container rounded-xl text-[12px] font-medium flex items-center justify-between shadow-sm animate-fade-in border border-secondary/20">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-secondary" />
            <span>{exportNotice}</span>
          </div>
          <button onClick={() => setExportNotice(null)} className="text-[14px] font-bold px-1 hover:opacity-75">
            ×
          </button>
        </div>
      )}

      {/* Sub-tabs, Search & Granular Export */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 bg-surface-container-low p-1 rounded-xl border border-[#eaedff] overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('settlements')}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all whitespace-nowrap ${
              activeSubTab === 'settlements'
                ? 'bg-surface-container-lowest text-on-surface shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Settlements ({transactions.length})
          </button>
          <button
            onClick={() => setActiveSubTab('inventory')}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all whitespace-nowrap ${
              activeSubTab === 'inventory'
                ? 'bg-surface-container-lowest text-on-surface shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Inventory ({inventory.length})
          </button>
          <button
            onClick={() => setActiveSubTab('postgres')}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all whitespace-nowrap ${
              activeSubTab === 'postgres'
                ? 'bg-surface-container-lowest text-on-surface shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Postgres Logs
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-outline" />
            <input
              type="text"
              placeholder="Search records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-surface-container-low border border-surface-container text-[12px] text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-secondary"
            />
          </div>
        </div>
      </div>

      {/* View 1: Settlements Stream */}
      {activeSubTab === 'settlements' && (
        <div className="space-y-2">
          {filteredTx.map((tx) => (
            <div
              key={tx.id}
              className="p-3 rounded-xl bg-surface-container-lowest border border-[#eaedff] flex items-center justify-between gap-3 shadow-sm hover:bg-surface-container-low/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  tx.method.includes('POS')
                    ? 'bg-secondary-container text-on-secondary-container'
                    : tx.method.includes('NIBSS')
                    ? 'bg-surface-container-high text-on-surface'
                    : 'bg-tertiary-fixed text-on-tertiary-fixed-variant'
                }`}>
                  {tx.method.includes('POS') ? (
                    <CreditCard className="w-4 h-4" />
                  ) : tx.method.includes('NIBSS') ? (
                    <Landmark className="w-4 h-4" />
                  ) : (
                    <Banknote className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <p className="text-[13px] font-bold text-on-surface">{tx.customer}</p>
                  <p className="text-[11px] text-on-surface-variant">
                    {tx.time} • {tx.method} • <span className="font-semibold">{tx.branch}</span>
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-[15px] font-bold text-secondary font-mono">
                  ₦{tx.amount.toLocaleString()}
                </p>
                <span className="text-[10px] text-outline font-mono">{tx.reference}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View 2: Inventory Matrix */}
      {activeSubTab === 'inventory' && (
        <div className="space-y-2.5">
          {filteredInventory.map((item) => {
            const isCritical = item.status === 'critical';
            const isWarning = item.status === 'warning';

            return (
              <div
                key={item.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  isCritical
                    ? 'bg-error-container/30 border-error/40'
                    : isWarning
                    ? 'bg-tertiary-fixed/25 border-tertiary-fixed-dim/50'
                    : 'bg-surface-container-lowest border-[#eaedff] shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-mono text-outline">{item.sku}</span>
                      <span className="text-[11px] text-on-surface-variant">• {item.category}</span>
                      <span className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${
                        isCritical
                          ? 'bg-error text-on-error'
                          : isWarning
                          ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant'
                          : 'bg-secondary-container text-on-secondary-container'
                      }`}>
                        {item.status.toUpperCase()}
                      </span>
                    </div>
                    <h3 className="text-[14px] font-bold text-on-surface mt-0.5">{item.name}</h3>
                    <p className="text-[11px] text-on-surface-variant">
                      Branch: <strong className="text-on-surface">{item.branch}</strong> • Supplier: {item.supplier}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-[16px] font-bold text-on-surface font-mono">
                      {item.stockLevel} {item.unit}
                    </p>
                    <p className="text-[11px] text-on-surface-variant">
                      Burn rate: <strong className={isCritical ? 'text-error font-bold' : 'text-on-surface'}>{item.burnRateHours}h left</strong>
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-surface-container-high/60 flex items-center justify-between text-[11px]">
                  <span className="text-outline">
                    Reorder Threshold: {item.reorderPoint} {item.unit} • Lead time: {item.leadTimeDays}d
                  </span>
                  <button
                    onClick={() => onQuickRestock(item.sku)}
                    className="px-2.5 py-1 rounded bg-secondary text-on-secondary font-semibold hover:bg-secondary/90 transition-colors"
                  >
                    Draft Restock PO
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View 3: Postgres Queries & Telemetry */}
      {activeSubTab === 'postgres' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold text-on-surface-variant">
              Live Sub-Agent Query Execution Stream
            </span>
            <button
              onClick={onOpenSqlModal}
              className="text-[12px] font-semibold text-secondary hover:underline flex items-center gap-1"
            >
              <span>Inspect All Queries</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2">
            {sqlQueries.map((q) => (
              <div key={q.id} className="bg-surface-container-low rounded-xl p-3 border border-surface-container">
                <div className="flex justify-between items-center text-[11px] mb-1.5">
                  <span className="font-bold text-secondary">{q.agent}</span>
                  <span className="font-mono text-outline">{q.executionTimeMs}ms • {q.rowsReturned} rows</span>
                </div>
                <pre className="bg-[#131a33] text-[#bec5e5] p-2.5 rounded-lg text-[11px] font-mono overflow-x-auto whitespace-pre-wrap">
                  {q.query}
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
