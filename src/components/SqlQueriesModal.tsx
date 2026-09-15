import React, { useState } from 'react';
import { SqlQueryItem } from '../types';
import { Database, X, Clock, Check, Copy, ShieldCheck, Download } from 'lucide-react';

interface SqlQueriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  queries: SqlQueryItem[];
}

export const SqlQueriesModal: React.FC<SqlQueriesModalProps> = ({
  isOpen,
  onClose,
  queries
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<string>('all');

  if (!isOpen) return null;

  const agents = ['all', ...Array.from(new Set(queries.map(q => q.agent)))];
  const filteredQueries = selectedAgent === 'all' 
    ? queries 
    : queries.filter(q => q.agent === selectedAgent);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface-container-lowest rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-[#eaedff]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-surface-container-high flex items-center justify-between bg-surface-container-low">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-secondary" />
            <div>
              <h3 className="font-semibold text-title-md text-on-surface">Postgres Tool Layer Telemetry</h3>
              <p className="text-body-sm text-on-surface-variant">
                {queries.length} SQL queries executed by AI sub-agents during this session
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-surface-container-highest flex items-center justify-center text-on-surface-variant transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="px-5 py-2.5 border-b border-surface-container flex items-center gap-2 overflow-x-auto bg-surface">
          <span className="text-label-sm font-semibold text-on-surface-variant flex-shrink-0">Filter Agent:</span>
          {agents.map(agent => (
            <button
              key={agent}
              onClick={() => setSelectedAgent(agent)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all whitespace-nowrap ${
                selectedAgent === agent
                  ? 'bg-secondary text-on-secondary shadow-sm'
                  : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
              }`}
            >
              {agent === 'all' ? 'All Queries' : agent}
            </button>
          ))}
        </div>

        {/* Query List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {filteredQueries.map((q) => (
            <div
              key={q.id}
              className="bg-surface-container-low rounded-xl p-3.5 border border-surface-container-high flex flex-col gap-2"
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-semibold text-[10px]">
                    {q.agent}
                  </span>
                  <span className="text-[11px] text-outline font-medium">{q.timestamp}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-on-surface-variant font-mono">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-secondary" />
                    {q.executionTimeMs}ms
                  </span>
                  <span>•</span>
                  <span>{q.rowsReturned} rows</span>
                </div>
              </div>

              {/* Code Box */}
              <div className="relative bg-[#131a33] text-[#bec5e5] rounded-lg p-3 font-mono text-[12px] leading-relaxed overflow-x-auto">
                <button
                  onClick={() => handleCopy(q.id, q.query)}
                  className="absolute top-2 right-2 px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-[10px] text-white flex items-center gap-1 transition-colors"
                >
                  {copiedId === q.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedId === q.id ? 'Copied' : 'Copy'}</span>
                </button>
                <pre className="whitespace-pre-wrap">{q.query}</pre>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[11px] text-on-surface-variant">
                <span className="font-semibold text-outline">Tables:</span>
                {q.tablesTouched.map(table => (
                  <span key={table} className="px-1.5 py-0.5 rounded bg-surface-container-highest font-mono text-[10px]">
                    {table}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-surface-container-high flex items-center justify-between bg-surface-container-low text-body-sm text-on-surface-variant flex-wrap gap-2">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-secondary" />
            Read-replica safe • Zero production locks
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const headers = ['Query ID', 'Sub-Agent Source', 'SQL Statement', 'Execution Latency (ms)', 'Rows Returned', 'Touched Database Tables', 'Timestamp', 'Status'];
                const rows = filteredQueries.map(q => [
                  `"${q.id}"`,
                  `"${q.agent}"`,
                  `"${q.query.replace(/"/g, '""')}"`,
                  `"${q.executionTimeMs}"`,
                  `"${q.rowsReturned}"`,
                  `"${q.tablesTouched.join('; ')}"`,
                  `"${q.timestamp}"`,
                  `"${q.status}"`
                ]);
                const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
                const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `koraops-queries-export-${new Date().toISOString().slice(0,10)}.csv`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
              }}
              className="px-3 py-1.5 rounded-lg border border-secondary text-secondary text-label-sm font-semibold hover:bg-secondary-container/40 transition-colors flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-primary text-on-primary text-label-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
