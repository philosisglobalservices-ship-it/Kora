import React from 'react';
import { Store, X, CheckCircle2 } from 'lucide-react';

interface BranchSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBranch: string;
  onSelectBranch: (branch: string) => void;
}

export const BranchSwitcherModal: React.FC<BranchSwitcherModalProps> = ({
  isOpen,
  onClose,
  currentBranch,
  onSelectBranch
}) => {
  if (!isOpen) return null;

  const branches = [
    {
      name: 'Victoria Island',
      subtitle: 'Corporate Wholesale & Prime FMCG Accounts',
      code: 'VI-HQ',
      status: 'Online',
      salesToday: '₦2,930,200',
      stockHealth: '98%',
      agentsActive: '8/8 Agents'
    },
    {
      name: 'Ikeja Depot',
      subtitle: 'Industrial Central Distribution & Fleet Dispatch',
      code: 'IKJ-HUB',
      status: 'Alert: Stockout Risk',
      salesToday: '₦1,920,000',
      stockHealth: '84%',
      agentsActive: '8/8 Agents'
    },
    {
      name: 'Alaba Trade Mart',
      subtitle: 'Bulk Commodity Clearing & Merchant POS Terminal',
      code: 'ALB-MKT',
      status: 'Online',
      salesToday: '₦1,140,500',
      stockHealth: '92%',
      agentsActive: '8/8 Agents'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface-container-lowest rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-[#eaedff]">
        <div className="px-5 py-4 border-b border-surface-container-high flex items-center justify-between bg-surface-container-low">
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-secondary" />
            <div>
              <h3 className="font-semibold text-title-md text-on-surface">Switch Trading Branch</h3>
              <p className="text-body-sm text-on-surface-variant">Balogun Mega Traders Ltd Network</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-surface-container-highest flex items-center justify-center text-on-surface-variant transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-3">
          {branches.map((b) => {
            const isSelected = currentBranch === b.name;
            return (
              <div
                key={b.name}
                onClick={() => {
                  onSelectBranch(b.name);
                  onClose();
                }}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-secondary bg-secondary-container/25 ring-1 ring-secondary'
                    : 'border-surface-container-high bg-surface-container-low hover:border-outline-variant hover:bg-surface-container'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[15px] text-on-surface">{b.name}</span>
                      <span className="px-1.5 py-0.5 rounded bg-surface-container-highest text-[10px] font-mono text-on-surface-variant">
                        {b.code}
                      </span>
                    </div>
                    <p className="text-[12px] text-on-surface-variant mt-0.5">{b.subtitle}</p>
                  </div>
                  {isSelected && (
                    <CheckCircle2 className="w-5 h-5 text-secondary" />
                  )}
                </div>

                <div className="mt-3 pt-2.5 border-t border-surface-container-highest/60 flex items-center justify-between text-[11px]">
                  <span className="text-on-surface-variant">
                    Today: <strong className="text-on-surface font-semibold">{b.salesToday}</strong>
                  </span>
                  <span className={`px-2 py-0.5 rounded-full font-semibold ${
                    b.status.includes('Alert') 
                      ? 'bg-error-container text-on-error-container' 
                      : 'bg-secondary-container text-on-secondary-container'
                  }`}>
                    {b.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="px-4 py-3 border-t border-surface-container-high bg-surface-container-low flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-surface-container-highest text-on-surface text-label-sm font-semibold hover:bg-surface-container transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
