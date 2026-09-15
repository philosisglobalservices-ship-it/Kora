import React from 'react';
import { Mail, X, MessageSquare } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  executiveMode: string;
  onSetExecutiveMode: (mode: string) => void;
  isWhatsAppActive: boolean;
  onToggleWhatsApp: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  executiveMode,
  onSetExecutiveMode,
  isWhatsAppActive,
  onToggleWhatsApp
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface-container-lowest rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-[#eaedff]">
        {/* Profile Card Header */}
        <div className="p-5 bg-gradient-to-r from-primary-container to-[#283044] text-white flex items-center gap-4 relative">
          <img
            alt="Alhaji Balogun"
            className="w-14 h-14 rounded-full object-cover ring-2 ring-secondary shadow-md"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDWkYE4UXvmSAGg0ZUW8c8nnmCS1sVCmC3wYaD_p2kcjv1NP0mnctRJy-4GOG-8nZTkrLBblrghmHZ2hY9xGkq1wcu8wZEm2rWi2gYmHSKAqnNToEgzVgsxx5a-kU4DJUtdbJdXSWWmnPUSVM6eNJNYVgSScewdLGccW_4CgW6XsKQOvtdN_zMqBHJ-zIF4TCm_zq-Oq69WAbwgtseRpqN84E7oYEghgHeVdgJMiQqozyLNJV6PQoP9yA"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-[17px] font-bold truncate">Alhaji Lateef Balogun</h3>
              <span className="px-1.5 py-0.5 rounded bg-secondary text-[10px] font-bold text-white uppercase">
                Owner
              </span>
            </div>
            <p className="text-[12px] text-surface-container-highest">Managing Director & Primary Shareholder</p>
            <p className="text-[11px] text-outline-variant mt-0.5">Balogun Mega Traders Ltd • RC 1049281</p>
            <p className="text-[11px] text-secondary mt-1 flex items-center gap-1 font-mono">
              <Mail className="w-3.5 h-3.5" />
              <span>philosisglobalservices@gmail.com</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Settings Content */}
        <div className="p-5 space-y-4">
          {/* Executive Mode Selector */}
          <div>
            <label className="text-[12px] font-semibold text-on-surface-variant block mb-1.5">
              Orchestrator Operational Mode
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'Executive Support', desc: 'Synthesized daily briefs & HITL approval gates' },
                { id: 'Autonomous Fast-Track', desc: 'Auto-approve routine restock POs < ₦1,000,000' }
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => onSetExecutiveMode(m.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    executiveMode === m.id
                      ? 'border-secondary bg-secondary-container/20 ring-1 ring-secondary'
                      : 'border-surface-container-high bg-surface-container-low hover:bg-surface-container'
                  }`}
                >
                  <p className="text-[13px] font-bold text-on-surface">{m.id}</p>
                  <p className="text-[11px] text-on-surface-variant mt-0.5 leading-tight">{m.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* WhatsApp Mirror Channel */}
          <div className="p-3.5 rounded-xl bg-surface-container-low border border-surface-container-high flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-secondary-container flex items-center justify-center text-on-secondary-container">
                <MessageSquare className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-on-surface">WhatsApp Voice & Text Mirror</p>
                <p className="text-[11px] text-on-surface-variant">+234 803 ••• ••92 (Verified Executive Phone)</p>
              </div>
            </div>
            <button
              onClick={onToggleWhatsApp}
              className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                isWhatsAppActive
                  ? 'bg-secondary text-on-secondary shadow-sm'
                  : 'bg-surface-container-highest text-on-surface-variant'
              }`}
            >
              {isWhatsAppActive ? 'CONNECTED' : 'DISCONNECTED'}
            </button>
          </div>

          {/* Connected Enterprise Tools */}
          <div className="space-y-2">
            <span className="text-[12px] font-semibold text-on-surface-variant">Connected Enterprise Subsystems</span>
            <div className="space-y-1.5 text-[12px]">
              <div className="flex justify-between items-center py-1 border-b border-surface-container-high">
                <span className="text-on-surface">Postgres Enterprise Ledger</span>
                <span className="text-secondary font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                  Latency 1.8ms
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-surface-container-high">
                <span className="text-on-surface">NIBSS Instant Settlement & Paystack POS</span>
                <span className="text-secondary font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                  Synced (91% instant)
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-on-surface">Multi-Agent Autonomy Policy</span>
                <span className="text-on-tertiary-container font-semibold">Strict HITL Enabled</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-surface-container-high bg-surface-container-low flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-primary text-on-primary text-label-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};
