import React from 'react';
import { TabType } from '../types';
import { LayoutDashboard, Bot, ShieldCheck, Users, Database } from 'lucide-react';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  pendingApprovalsCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  pendingApprovalsCount
}) => {
  const tabs = [
    { id: 'overview' as TabType, label: 'Overview', icon: LayoutDashboard },
    { id: 'ai-ceo' as TabType, label: 'AI CEO', icon: Bot, hasLiveIndicator: true },
    { id: 'approvals' as TabType, label: 'Approvals', icon: ShieldCheck, badge: pendingApprovalsCount },
    { id: 'workforce' as TabType, label: 'Workforce', icon: Users },
    { id: 'operations' as TabType, label: 'Operations', icon: Database }
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-surface-container-lowest/95 backdrop-blur-xl shadow-[0_-2px_12px_rgba(19,27,46,0.04)] border-t border-[#eaedff]/70 pb-safe">
      <div className="max-w-screen-md mx-auto flex justify-around items-center h-16 px-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center min-w-[58px] h-12 gap-0.5 transition-all relative ${
                isActive ? 'text-primary font-bold scale-105' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <IconComponent className={`w-6 h-6 transition-colors ${isActive ? 'text-primary' : 'text-on-surface-variant'}`} />

                {/* AI CEO pulse indicator */}
                {tab.hasLiveIndicator && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
                  </span>
                )}

                {/* Approvals notification badge */}
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="absolute -top-1 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-error text-on-error text-[10px] leading-none flex items-center justify-center font-bold shadow-sm">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[11px] font-medium tracking-tight ${isActive ? 'font-bold text-primary' : ''}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
