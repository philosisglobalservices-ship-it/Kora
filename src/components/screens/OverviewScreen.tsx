import React from 'react';
import { ApprovalItem, InventoryProduct, Transaction } from '../../types';
import { Bot, ArrowRight, AlertTriangle, Receipt } from 'lucide-react';

interface OverviewScreenProps {
  onNavigateToTab: (tab: any) => void;
  pendingApprovals: ApprovalItem[];
  inventory: InventoryProduct[];
  transactions: Transaction[];
  currentBranch: string;
}

export const OverviewScreen: React.FC<OverviewScreenProps> = ({
  onNavigateToTab,
  pendingApprovals,
  inventory,
  transactions,
  currentBranch
}) => {
  const criticalItems = inventory.filter(i => i.status === 'critical');
  const pendingCount = pendingApprovals.filter(p => p.status === 'pending').length;

  return (
    <div className="flex flex-col w-full pb-24 max-w-screen-md mx-auto px-4 pt-3 space-y-4">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#131a33] to-[#283044] text-white rounded-2xl p-4 shadow-md flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-secondary text-[10px] font-bold text-white uppercase">
              Consolidated Executive View
            </span>
            <span className="text-[11px] text-surface-container-highest">Lagos Trading Terminals</span>
          </div>
          <h2 className="text-[20px] font-bold mt-1 text-white">Daily Operational Overview</h2>
          <p className="text-[12px] text-outline-variant mt-0.5">
            Realtime data synced across 8 autonomous agents &amp; Postgres Tool Layer
          </p>
        </div>
        <button
          onClick={() => onNavigateToTab('ai-ceo')}
          className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[12px] font-semibold flex items-center gap-1.5 transition-colors flex-shrink-0"
        >
          <Bot className="w-4 h-4" />
          <span>Ask AI CEO</span>
        </button>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Metric 1 */}
        <div className="bg-surface-container-low rounded-xl p-3.5 border border-[#eaedff] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
              Today's Gross Inflow
            </span>
            <span className="px-1.5 py-0.5 rounded bg-secondary-container text-on-secondary-container text-[10px] font-bold">
              +18.4%
            </span>
          </div>
          <div className="mt-2">
            <p className="text-[22px] font-bold text-secondary">₦4,850,200</p>
            <p className="text-[11px] text-on-surface-variant mt-0.5">114 verified settlements</p>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-surface-container-low rounded-xl p-3.5 border border-[#eaedff] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
              Net Operating Margin
            </span>
            <span className="text-[10px] font-bold text-secondary">28.6%</span>
          </div>
          <div className="mt-2">
            <p className="text-[22px] font-bold text-on-surface">₦1,387,157</p>
            <p className="text-[11px] text-on-surface-variant mt-0.5">OpEx deducted: ₦320,000</p>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-surface-container-low rounded-xl p-3.5 border border-[#eaedff] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
              Liquid Cash & Bank
            </span>
            <span className="text-[10px] font-mono text-outline">NIBSS Realtime</span>
          </div>
          <div className="mt-2">
            <p className="text-[20px] font-bold text-on-surface">₦12,420,000</p>
            <p className="text-[11px] text-on-surface-variant mt-0.5">Zenith &amp; GTBank Corporate</p>
          </div>
        </div>

        {/* Metric 4: HITL Pending */}
        <div
          onClick={() => onNavigateToTab('approvals')}
          className="bg-surface-container-low hover:bg-surface-container rounded-xl p-3.5 border border-error/20 flex flex-col justify-between cursor-pointer transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-error uppercase tracking-wider flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-error animate-ping"></span>
              Pending HITL
            </span>
            <span className="px-1.5 py-0.5 rounded-full bg-error text-on-error text-[10px] font-bold">
              {pendingCount} Needs Review
            </span>
          </div>
          <div className="mt-2">
            <p className="text-[20px] font-bold text-error">₦2,640,000</p>
            <p className="text-[11px] text-on-surface-variant mt-0.5 flex items-center gap-1">
              <span>Review approvals</span>
              <ArrowRight className="w-3 h-3 text-on-surface-variant" />
            </p>
          </div>
        </div>
      </div>

      {/* Critical Stock Alert Banner */}
      {criticalItems.length > 0 && (
        <div className="bg-error-container rounded-xl p-3.5 border border-error/30 flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-full bg-on-error flex items-center justify-center text-error flex-shrink-0 mt-0.5">
              <AlertTriangle className="w-4 h-4 text-error" />
            </div>
            <div>
              <p className="text-[13px] font-bold text-on-error-container">
                Immediate Action: Stockout Hazard at Ikeja Depot
              </p>
              <p className="text-[12px] text-on-error-container/90 mt-0.5 leading-relaxed">
                Golden Penny Vegetable Oil 5L has only <strong>14 hours</strong> of inventory left. Procurement Agent drafted PO #PO-2024-918 for ₦820,000 awaiting your authorization.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateToTab('approvals')}
            className="px-3 py-1.5 rounded-lg bg-error text-on-error text-[12px] font-semibold flex-shrink-0 hover:bg-error/90 active:scale-95 transition-all"
          >
            Review PO
          </button>
        </div>
      )}

      {/* Settlement Velocity Breakdown */}
      <div className="bg-surface-container-low rounded-xl p-4 border border-[#eaedff]">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-[14px] font-bold text-on-surface">Hourly Settlement Velocity</h3>
            <p className="text-[11px] text-on-surface-variant">Inflow volume aggregated by 30-minute intervals</p>
          </div>
          <span className="text-[12px] font-bold text-secondary">+18.4% WoW Pace</span>
        </div>

        <div className="h-28 flex items-end gap-2 pt-4 pb-1">
          {[
            { label: '07:00', amount: '₦320k', pct: 35 },
            { label: '08:00', amount: '₦480k', pct: 45 },
            { label: '08:30', amount: '₦720k', pct: 60 },
            { label: '09:00', amount: '₦610k', pct: 50 },
            { label: '10:00', amount: '₦980k', pct: 80, isPeak: true },
            { label: 'Now', amount: '₦1.45M', pct: 100, isCurrent: true }
          ].map((bar, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
              <span className="text-[9px] text-outline font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                {bar.amount}
              </span>
              <div
                className={`w-full rounded-t transition-all ${
                  bar.isCurrent
                    ? 'bg-secondary'
                    : bar.isPeak
                    ? 'bg-secondary-fixed-dim'
                    : 'bg-surface-container-highest group-hover:bg-primary-container/30'
                }`}
                style={{ height: `${bar.pct}%` }}
              ></div>
              <span className="text-[10px] text-on-surface-variant font-medium">{bar.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Channel Mix & Branches */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Payment Channel Breakdown */}
        <div className="bg-surface-container-low rounded-xl p-3.5 border border-[#eaedff]">
          <h4 className="text-[13px] font-bold text-on-surface mb-2.5">Collection Channels</h4>
          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-on-surface font-medium">NIBSS Direct Bank Transfer</span>
                <span className="text-secondary font-bold">₦2,580,000 (53%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-surface-container-highest overflow-hidden">
                <div className="h-full bg-secondary rounded-full" style={{ width: '53%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-on-surface font-medium">Paystack Smart POS Terminals</span>
                <span className="text-secondary font-bold">₦1,840,200 (38%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-surface-container-highest overflow-hidden">
                <div className="h-full bg-secondary-fixed-dim rounded-full" style={{ width: '38%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-on-surface font-medium">Counter Cash Receipts</span>
                <span className="text-on-surface-variant font-bold">₦430,000 (9%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-surface-container-highest overflow-hidden">
                <div className="h-full bg-surface-variant rounded-full" style={{ width: '9%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Branch Performance Comparison */}
        <div className="bg-surface-container-low rounded-xl p-3.5 border border-[#eaedff]">
          <h4 className="text-[13px] font-bold text-on-surface mb-2.5">Trading Branch Performance</h4>
          <div className="space-y-2 text-[12px]">
            <div className="p-2 rounded-lg bg-surface-container flex items-center justify-between">
              <div>
                <p className="font-bold text-on-surface">Victoria Island HQ</p>
                <p className="text-[10px] text-on-surface-variant">Wholesale & Prime Accounts</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-secondary">₦2,930,200</p>
                <span className="px-1.5 py-0.2 rounded bg-secondary-container text-[9px] font-semibold text-on-secondary-container">
                  Health 98%
                </span>
              </div>
            </div>

            <div className="p-2 rounded-lg bg-surface-container flex items-center justify-between">
              <div>
                <p className="font-bold text-on-surface">Ikeja Central Depot</p>
                <p className="text-[10px] text-error font-medium">1 Stock Warning Alert</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-secondary">₦1,920,000</p>
                <span className="px-1.5 py-0.2 rounded bg-error-container text-[9px] font-semibold text-on-error-container">
                  Action Needed
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Live Settlements Ticker */}
      <div className="bg-surface-container-low rounded-xl p-3.5 border border-[#eaedff]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Receipt className="w-4 h-4 text-secondary" />
            <h4 className="text-[13px] font-bold text-on-surface">Live Verified Settlements</h4>
          </div>
          <button
            onClick={() => onNavigateToTab('operations')}
            className="text-[11px] font-semibold text-secondary hover:underline"
          >
            View All in Operations →
          </button>
        </div>

        <div className="space-y-1.5">
          {transactions.slice(0, 4).map((tx) => (
            <div
              key={tx.id}
              className="p-2 rounded-lg bg-surface-container-lowest flex items-center justify-between border border-surface-container text-[12px]"
            >
              <div>
                <p className="font-semibold text-on-surface">{tx.customer}</p>
                <p className="text-[10px] text-on-surface-variant">
                  {tx.time} • {tx.method} • {tx.branch}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-secondary font-mono">₦{tx.amount.toLocaleString()}</p>
                <span className="text-[9px] text-outline font-mono">{tx.reference}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
