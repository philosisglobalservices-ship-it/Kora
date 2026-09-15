import React, { useState } from 'react';
import { ApprovalItem } from '../../types';
import { Gavel, ShieldCheck, Fingerprint, MessageSquare, CheckCircle2 } from 'lucide-react';

interface ApprovalsScreenProps {
  approvals: ApprovalItem[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onModify: (id: string, terms: string) => void;
  onOpenCeoChatWithPrompt: (prompt: string) => void;
}

export const ApprovalsScreen: React.FC<ApprovalsScreenProps> = ({
  approvals,
  onApprove,
  onReject,
  onModify,
  onOpenCeoChatWithPrompt
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [expandedId, setExpandedId] = useState<string | null>(approvals[0]?.id || null);
  const [modifyingId, setModifyingId] = useState<string | null>(null);
  const [modifyNotes, setModifyNotes] = useState<string>('');

  const filtered = approvals.filter(item => {
    if (filter === 'all') return true;
    return item.status === filter;
  });

  const pendingCount = approvals.filter(a => a.status === 'pending').length;

  const handleStartModify = (item: ApprovalItem) => {
    setModifyingId(item.id);
    setModifyNotes(`Reduce quantity or extend settlement period for ${item.refCode}`);
  };

  const handleSaveModify = (id: string) => {
    onModify(id, modifyNotes);
    setModifyingId(null);
  };

  return (
    <div className="flex flex-col w-full pb-24 max-w-screen-md mx-auto px-4 pt-3 space-y-4">
      {/* Screen Header */}
      <div className="bg-surface-container-low rounded-2xl p-4 border border-[#eaedff] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed-variant shadow-sm">
            <Gavel className="w-5 h-5 text-on-tertiary-fixed-variant" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[17px] font-bold text-on-surface">Human-in-the-Loop Hub</h2>
              <span className="px-2 py-0.5 rounded-full bg-error text-on-error text-[11px] font-bold">
                {pendingCount} Pending
              </span>
            </div>
            <p className="text-[12px] text-on-surface-variant">
              Executive authorization gates for autonomous financial and procurement actions
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {(['pending', 'all', 'approved', 'rejected'] as const).map((tab) => {
          const count = tab === 'all' 
            ? approvals.length 
            : approvals.filter(a => a.status === tab).length;

          return (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition-all capitalize whitespace-nowrap ${
                filter === tab
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
              }`}
            >
              {tab} ({count})
            </button>
          );
        })}
      </div>

      {/* Approvals List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-8 text-center bg-surface-container-low rounded-2xl border border-dashed border-surface-container-highest">
            <ShieldCheck className="w-9 h-9 text-outline mx-auto" />
            <p className="text-[14px] font-semibold text-on-surface mt-2">No {filter} authorizations</p>
            <p className="text-[12px] text-on-surface-variant">All autonomous agent operations are in sync</p>
          </div>
        ) : (
          filtered.map((item) => {
            const isExpanded = expandedId === item.id;
            const isPending = item.status === 'pending';

            return (
              <div
                key={item.id}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  item.status === 'approved'
                    ? 'bg-secondary-container/20 border-secondary/40'
                    : item.status === 'rejected'
                    ? 'bg-surface-container-lowest border-outline/30 opacity-70'
                    : 'bg-surface-container-lowest border-[#eaedff] shadow-sm'
                }`}
              >
                {/* Item Summary Bar */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  className="p-4 flex items-center justify-between gap-3 cursor-pointer hover:bg-surface-container-low/50 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[12px] font-bold text-outline font-mono">{item.refCode}</span>
                      <span className="px-2 py-0.5 rounded bg-surface-container-highest text-[10px] font-semibold text-on-surface">
                        {item.category}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.risk === 'High'
                          ? 'bg-error text-on-error'
                          : item.risk === 'Medium'
                          ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant'
                          : 'bg-secondary-container text-on-secondary-container'
                      }`}>
                        Risk: {item.risk}
                      </span>
                    </div>

                    <h3 className="text-[16px] font-bold text-on-surface mt-1 truncate">
                      {item.supplierOrClient}
                    </h3>
                    <p className="text-[12px] text-on-surface-variant mt-0.5 truncate">
                      Source: {item.agentSource} • {item.date}
                    </p>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className="text-[18px] font-bold text-secondary font-mono">
                      ₦{item.amount.toLocaleString()}
                    </p>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-block mt-0.5 ${
                      item.status === 'approved'
                        ? 'bg-secondary text-on-secondary'
                        : item.status === 'rejected'
                        ? 'bg-error text-on-error'
                        : 'bg-surface-container-highest text-on-surface font-semibold'
                    }`}>
                      {item.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Expanded Details Drawer */}
                {isExpanded && (
                  <div className="p-4 pt-0 border-t border-surface-container-high/60 bg-surface-container-low/30 space-y-3">
                    <p className="text-[13px] text-on-surface leading-relaxed mt-3">
                      {item.description}
                    </p>

                    {/* Breakdown of items if available */}
                    {item.details.items && item.details.items.length > 0 && (
                      <div className="bg-surface-container-lowest rounded-xl p-3 border border-surface-container text-[12px]">
                        <span className="font-semibold text-outline text-[11px] block mb-2">Itemized Breakdown</span>
                        <div className="space-y-1.5">
                          {item.details.items.map((line, idx) => (
                            <div key={idx} className="flex justify-between items-center py-1 border-b border-surface-container-high last:border-b-0">
                              <span className="text-on-surface">{line.qty}x {line.name}</span>
                              <span className="font-bold text-on-surface font-mono">₦{line.total.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Strategic Justification & Impact */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[12px]">
                      <div className="p-2.5 rounded-xl bg-surface-container border border-[#eaedff]">
                        <span className="font-bold text-on-surface block text-[11px]">Sub-Agent Justification:</span>
                        <p className="text-on-surface-variant mt-1">{item.details.justification}</p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-surface-container border border-[#eaedff]">
                        <span className="font-bold text-secondary block text-[11px]">Projected Financial Impact:</span>
                        <p className="text-on-surface-variant mt-1">{item.details.impact}</p>
                      </div>
                    </div>

                    {/* Modifying terms dialog */}
                    {modifyingId === item.id ? (
                      <div className="p-3 bg-surface-container-lowest rounded-xl border border-secondary space-y-2">
                        <label className="text-[12px] font-semibold text-on-surface">Executive Modification Directive:</label>
                        <input
                          type="text"
                          value={modifyNotes}
                          onChange={(e) => setModifyNotes(e.target.value)}
                          className="w-full p-2 text-[13px] border rounded-lg bg-surface focus:outline-none focus:ring-1 focus:ring-secondary"
                          placeholder="e.g. Reduce order to 80 units or discount by 5%"
                        />
                        <div className="flex justify-end gap-2 pt-1">
                          <button
                            onClick={() => setModifyingId(null)}
                            className="px-3 py-1.5 text-[12px] rounded-lg bg-surface-container-highest"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveModify(item.id)}
                            className="px-3 py-1.5 text-[12px] rounded-lg bg-secondary text-on-secondary font-semibold"
                          >
                            Apply Modification
                          </button>
                        </div>
                      </div>
                    ) : null}

                    {/* Action Buttons for Pending item */}
                    {isPending && !modifyingId && (
                      <div className="flex items-center gap-2 pt-2">
                        <button
                          onClick={() => onApprove(item.id)}
                          className="flex-1 py-2.5 px-3 rounded-lg bg-secondary text-on-secondary text-[13px] font-semibold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 hover:bg-secondary/90 transition-all"
                        >
                          <Fingerprint className="w-4 h-4" />
                          <span>Authorize &amp; Dispatch</span>
                          <span className="hidden sm:inline-block px-1.5 py-0.2 rounded bg-black/20 text-[10px] font-mono">Biometric Guard</span>
                        </button>
                        <button
                          onClick={() => handleStartModify(item)}
                          className="py-2.5 px-3 rounded-lg bg-surface-container-highest text-on-surface text-[13px] font-medium active:scale-95 hover:bg-surface-container transition-all"
                        >
                          Modify Terms
                        </button>
                        <button
                          onClick={() => onReject(item.id)}
                          className="py-2.5 px-3 rounded-lg bg-error-container text-on-error-container text-[13px] font-medium active:scale-95 hover:bg-error/20 transition-all"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => onOpenCeoChatWithPrompt(`Analyze risk and supplier alternatives for ${item.refCode}`)}
                          className="p-2.5 rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-container transition-all"
                          title="Ask AI CEO about this"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    {/* Confirmed Banner */}
                    {item.status === 'approved' && (
                      <div className="p-2.5 rounded-lg bg-secondary-container text-on-secondary-container text-[12px] font-semibold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-secondary" />
                        <span>Authorized by Alhaji Balogun • Executed via NIBSS Settlement Core</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
