import React from 'react';
import { ChevronDown, Database } from 'lucide-react';

interface HeaderProps {
  selectedLocation: string;
  onOpenLocationModal: () => void;
  onOpenProfileModal: () => void;
  onOpenWorkforceTab: () => void;
  agentCount?: number;
  dbStatus?: 'connected' | 'syncing' | 'offline';
}

export const Header: React.FC<HeaderProps> = ({
  selectedLocation,
  onOpenLocationModal,
  onOpenProfileModal,
  onOpenWorkforceTab,
  agentCount = 8,
  dbStatus = 'connected'
}) => {
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-[#eaedff]/70">
      <div className="max-w-screen-md mx-auto h-20 px-4 flex items-center justify-between gap-3">
        {/* Left: Logo & Location Switcher */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <img
            alt="KoraOps AI Logo"
            className="h-8 w-auto object-contain flex-shrink-0"
            src="https://lh3.googleusercontent.com/aida/AEtjO1WBF35RSF4NF8QZ75phpg47sXpOjmMbvpZYi_gGCh8PkC8M9WwCyxeU1dDgbR8ORhSHNmrZlNm_W8cth9eG_cbKmFJI2OuQLyi7cNtoNQjvggeY_sG4HooAz6Ntuw2S81BpPQ5cuTxjrFFe7DtrDX0kAjLaWPmTHpJpwG97ocxYi4FIfQPU5DvBFLslkcwae1AysTifFsyHi5d9HfvusXVi8ThBN9PSTs9ADNFqgW3ZEyeggr_wvH_8fMsw"
          />
          <div className="flex flex-col min-w-0">
            <button
              onClick={onOpenLocationModal}
              className="flex items-center gap-1 text-left group transition-all"
              title="Click to switch trading branch"
            >
              <span className="font-semibold text-[14px] text-on-surface truncate group-hover:text-secondary transition-colors">
                Balogun Mega Traders Ltd • {selectedLocation}
              </span>
              <ChevronDown className="w-4 h-4 text-on-surface-variant group-hover:text-on-surface transition-colors flex-shrink-0" />
            </button>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={onOpenWorkforceTab}
                className="flex items-center gap-1.5 text-left group"
                title="Click to view active autonomous agents"
              >
                <span className="flex h-2 w-2 relative flex-shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
                </span>
                <span className="text-[11px] font-semibold text-secondary truncate group-hover:underline">
                  {agentCount} Agents Synced
                </span>
              </button>

              <span className="text-[10px] text-outline">•</span>

              <div
                className="flex items-center gap-1 text-[11px] font-medium"
                title={
                  dbStatus === 'connected'
                    ? 'Cloud Firestore Database Connected & Synced'
                    : dbStatus === 'syncing'
                    ? 'Synchronizing with Firestore Database...'
                    : 'Local Offline Mode'
                }
              >
                <Database
                  className={`w-3.5 h-3.5 ${
                    dbStatus === 'connected'
                      ? 'text-secondary'
                      : dbStatus === 'syncing'
                      ? 'text-primary animate-spin'
                      : 'text-outline'
                  }`}
                />
                <span
                  className={
                    dbStatus === 'connected'
                      ? 'text-secondary font-semibold'
                      : 'text-on-surface-variant'
                  }
                >
                  {dbStatus === 'connected'
                    ? 'DB Synced'
                    : dbStatus === 'syncing'
                    ? 'Connecting DB...'
                    : 'Offline'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: User Profile Avatar */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={onOpenProfileModal}
            aria-label="Account switcher and profile"
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-all ring-2 ring-transparent hover:ring-secondary/20"
          >
            <img
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover shadow-[0_1px_4px_rgba(0,0,0,0.08)]"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDWkYE4UXvmSAGg0ZUW8c8nnmCS1sVCmC3wYaD_p2kcjv1NP0mnctRJy-4GOG-8nZTkrLBblrghmHZ2hY9xGkq1wcu8wZEm2rWi2gYmHSKAqnNToEgzVgsxx5a-kU4DJUtdbJdXSWWmnPUSVM6eNJNYVgSScewdLGccW_4CgW6XsKQOvtdN_zMqBHJ-zIF4TCm_zq-Oq69WAbwgtseRpqN84E7oYEghgHeVdgJMiQqozyLNJV6PQoP9yA"
            />
          </button>
        </div>
      </div>
    </header>
  );
};
