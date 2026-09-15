import React, { useState } from 'react';
import { SubAgentTelemetry } from '../../types';
import {
  Users,
  Brain,
  CreditCard,
  Package,
  Award,
  Gavel,
  Truck,
  ShieldCheck,
  MessageSquare,
  Wrench,
  RefreshCw,
  Bot
} from 'lucide-react';

interface WorkforceScreenProps {
  agents: SubAgentTelemetry[];
  onToggleAutonomy: (agentId: string) => void;
  onRunDiagnostic: (agentId: string) => void;
  onOpenCeoChatWithPrompt: (prompt: string) => void;
}

const renderAgentIcon = (iconName: string, className = 'w-5 h-5') => {
  switch (iconName) {
    case 'neurology':
      return <Brain className={className} />;
    case 'payments':
      return <CreditCard className={className} />;
    case 'inventory_2':
      return <Package className={className} />;
    case 'military_tech':
      return <Award className={className} />;
    case 'gavel':
      return <Gavel className={className} />;
    case 'local_shipping':
      return <Truck className={className} />;
    case 'verified':
      return <ShieldCheck className={className} />;
    case 'chat':
      return <MessageSquare className={className} />;
    default:
      return <Bot className={className} />;
  }
};

export const WorkforceScreen: React.FC<WorkforceScreenProps> = ({
  agents,
  onToggleAutonomy,
  onRunDiagnostic,
  onOpenCeoChatWithPrompt
}) => {
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'warning'>('all');
  const [diagnosticRunning, setDiagnosticRunning] = useState<string | null>(null);

  const filteredAgents = agents.filter(a => {
    if (selectedStatus === 'all') return true;
    return a.status === selectedStatus;
  });

  const handleDiagnostic = (id: string) => {
    setDiagnosticRunning(id);
    setTimeout(() => {
      onRunDiagnostic(id);
      setDiagnosticRunning(null);
    }, 1200);
  };

  return (
    <div className="flex flex-col w-full pb-24 max-w-screen-md mx-auto px-4 pt-3 space-y-4">
      {/* Screen Header */}
      <div className="bg-surface-container-low rounded-2xl p-4 border border-[#eaedff] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center text-primary-fixed shadow-sm">
            <Users className="w-6 h-6 text-on-primary-container" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[17px] font-bold text-on-surface">Autonomous AI Workforce</h2>
              <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-bold">
                8 Agents Synced
              </span>
            </div>
            <p className="text-[12px] text-on-surface-variant">
              Coordinated multi-agent swarm powering Balogun Mega Traders Ltd
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {(['all', 'active', 'warning'] as const).map((st) => (
          <button
            key={st}
            onClick={() => setSelectedStatus(st)}
            className={`px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition-all capitalize ${
              selectedStatus === st
                ? 'bg-primary text-on-primary shadow-sm'
                : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
            }`}
          >
            {st === 'all' ? 'All Agents (8)' : st === 'active' ? 'Active (7)' : 'Warning (1)'}
          </button>
        ))}
      </div>

      {/* Agents Grid / Cards */}
      <div className="space-y-3">
        {filteredAgents.map((agent) => {
          const isWarning = agent.status === 'warning';
          const isDiagnosing = diagnosticRunning === agent.id;

          return (
            <div
              key={agent.id}
              className={`rounded-2xl p-4 border transition-all ${
                isWarning
                  ? 'bg-error-container/30 border-error/40'
                  : 'bg-surface-container-lowest border-[#eaedff] shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${
                    isWarning
                      ? 'bg-error text-on-error'
                      : 'bg-secondary-container text-on-secondary-container'
                  }`}>
                    {renderAgentIcon(agent.avatarIcon, 'w-5 h-5')}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-[15px] font-bold text-on-surface">{agent.name}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isWarning
                          ? 'bg-error text-on-error'
                          : 'bg-secondary text-on-secondary'
                      }`}>
                        {agent.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-[12px] text-on-surface-variant mt-0.5">{agent.role}</p>
                  </div>
                </div>

                {/* Autonomy Mode Switcher */}
                <button
                  onClick={() => onToggleAutonomy(agent.id)}
                  className="px-2.5 py-1 rounded-lg bg-surface-container-highest hover:bg-surface-container text-on-surface text-[11px] font-semibold border border-surface-container-high transition-colors flex-shrink-0"
                  title="Click to toggle autonomy level"
                >
                  Mode: <strong className="text-secondary">{agent.autonomy}</strong>
                </button>
              </div>

              {/* Performance Metrics & Tools */}
              <div className="mt-3 pt-3 border-t border-surface-container-high/60 grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                <div className="p-2 rounded-lg bg-surface-container-low">
                  <span className="text-outline block">Decision Accuracy</span>
                  <span className="text-[14px] font-bold text-secondary font-mono">{agent.accuracy}%</span>
                </div>
                <div className="p-2 rounded-lg bg-surface-container-low">
                  <span className="text-outline block">Actions Executed Today</span>
                  <span className="text-[14px] font-bold text-on-surface font-mono">{agent.actionsToday}</span>
                </div>
                <div className="p-2 rounded-lg bg-surface-container-low col-span-2 sm:col-span-1">
                  <span className="text-outline block">Active Tools</span>
                  <span className="text-[12px] font-semibold text-on-surface truncate block">
                    {agent.tools.length} integrated tools
                  </span>
                </div>
              </div>

              {/* Last Action Log */}
              <div className="mt-2 text-[12px] p-2.5 rounded-lg bg-surface-container-low/70 flex items-center justify-between gap-2">
                <span className="text-on-surface-variant truncate">
                  <strong className="text-on-surface font-semibold">Latest:</strong> {agent.lastAction}
                </span>
                <button
                  onClick={() => handleDiagnostic(agent.id)}
                  disabled={isDiagnosing}
                  className="text-[11px] font-semibold text-secondary flex items-center gap-1 hover:underline flex-shrink-0"
                >
                  {isDiagnosing ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Wrench className="w-3.5 h-3.5" />
                  )}
                  <span>{isDiagnosing ? 'Running...' : 'Diagnostic'}</span>
                </button>
              </div>

              {/* Active Tools Badges */}
              <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] text-outline font-semibold">Tools:</span>
                {agent.tools.map((t, idx) => (
                  <span key={idx} className="px-1.5 py-0.5 rounded bg-surface-container-highest text-[10px] text-on-surface-variant font-mono">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
