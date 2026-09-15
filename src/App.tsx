import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { AiCeoScreen } from './components/screens/AiCeoScreen';
import { OverviewScreen } from './components/screens/OverviewScreen';
import { ApprovalsScreen } from './components/screens/ApprovalsScreen';
import { WorkforceScreen } from './components/screens/WorkforceScreen';
import { OperationsScreen } from './components/screens/OperationsScreen';
import { SqlQueriesModal } from './components/SqlQueriesModal';
import { BranchSwitcherModal } from './components/BranchSwitcherModal';
import { ProfileModal } from './components/ProfileModal';
import { BiometricAuthModal, BiometricAuthTarget } from './components/BiometricAuthModal';
import {
  INITIAL_AGENTS,
  INITIAL_APPROVALS,
  INITIAL_CHAT_MESSAGES,
  INITIAL_INVENTORY,
  INITIAL_SQL_QUERIES,
  INITIAL_TRANSACTIONS
} from './data/initialData';
import { ApprovalItem, ChatMessage, TabType, Transaction } from './types';
import {
  initializeDatabaseSeed,
  subscribeToApprovals,
  subscribeToInventory,
  subscribeToTransactions,
  subscribeToAgents,
  subscribeToMessages,
  subscribeToSqlQueries,
  dbSaveApproval,
  dbUpdateApprovalStatus,
  dbSaveTransaction,
  dbUpdateAgentAutonomy,
  dbUpdateAgentDiagnostic,
  dbSaveMessage,
  dbUpdateMessagePendingAuth
} from './services/dbService';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('ai-ceo');
  const [selectedLocation, setSelectedLocation] = useState<string>('Victoria Island');
  const [executiveMode, setExecutiveMode] = useState<string>('Executive Support');
  const [isWhatsAppActive, setIsWhatsAppActive] = useState<boolean>(true);
  const [dbStatus, setDbStatus] = useState<'connected' | 'syncing' | 'offline'>('syncing');

  // Modals state
  const [isLocationModalOpen, setIsLocationModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isSqlModalOpen, setIsSqlModalOpen] = useState<boolean>(false);
  const [isBiometricModalOpen, setIsBiometricModalOpen] = useState<boolean>(false);
  const [biometricTarget, setBiometricTarget] = useState<BiometricAuthTarget | null>(null);

  // Core Data state
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [approvals, setApprovals] = useState<ApprovalItem[]>(INITIAL_APPROVALS);
  const [agents, setAgents] = useState(INITIAL_AGENTS);
  const [inventory, setInventory] = useState(INITIAL_INVENTORY);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [sqlQueries, setSqlQueries] = useState(INITIAL_SQL_QUERIES);
  const [userEmail] = useState<string>('philosisglobalservices@gmail.com');

  // Initialize and connect Cloud Firestore Database
  useEffect(() => {
    let unsubApprovals: (() => void) | undefined;
    let unsubInventory: (() => void) | undefined;
    let unsubTransactions: (() => void) | undefined;
    let unsubAgents: (() => void) | undefined;
    let unsubMessages: (() => void) | undefined;
    let unsubSql: (() => void) | undefined;

    async function initDatabase() {
      try {
        setDbStatus('syncing');
        await initializeDatabaseSeed();
        setDbStatus('connected');
      } catch (err) {
        console.warn('Database seed note:', err);
        setDbStatus('connected');
      }

      unsubApprovals = subscribeToApprovals(
        (items) => {
          if (items.length > 0) setApprovals(items);
        },
        () => setDbStatus('offline')
      );

      unsubInventory = subscribeToInventory((items) => {
        if (items.length > 0) setInventory(items);
      });

      unsubTransactions = subscribeToTransactions((items) => {
        if (items.length > 0) setTransactions(items);
      });

      unsubAgents = subscribeToAgents((items) => {
        if (items.length > 0) setAgents(items);
      });

      unsubMessages = subscribeToMessages((items) => {
        if (items.length > 0) {
          // Keep chronological order if needed
          setMessages(items);
        }
      });

      unsubSql = subscribeToSqlQueries((items) => {
        if (items.length > 0) setSqlQueries(items);
      });
    }

    initDatabase();

    return () => {
      unsubApprovals?.();
      unsubInventory?.();
      unsubTransactions?.();
      unsubAgents?.();
      unsubMessages?.();
      unsubSql?.();
    };
  }, []);

  const pendingApprovalsCount = approvals.filter(a => a.status === 'pending').length;

  // Intercept sensitive PO approval with Biometric Auth Guard
  const handleApprovePO = (poId: string) => {
    const item = approvals.find(a => a.id === poId);
    if (item) {
      setBiometricTarget({
        id: item.id,
        refCode: item.refCode,
        title: item.title,
        recipient: item.supplierOrClient,
        amount: item.amount,
        description: item.description
      });
      setIsBiometricModalOpen(true);
    } else {
      executeApprovePO(poId);
    }
  };

  // Execution after successful biometric authentication
  const executeApprovePO = async (poId: string) => {
    setApprovals(prev =>
      prev.map(item =>
        item.id === poId ? { ...item, status: 'approved' } : item
      )
    );

    // Also update any message referencing this approval
    setMessages(prev =>
      prev.map(msg => {
        if (msg.pendingAuthorization && msg.pendingAuthorization.id === poId) {
          return {
            ...msg,
            pendingAuthorization: {
              ...msg.pendingAuthorization,
              status: 'approved'
            }
          };
        }
        return msg;
      })
    );

    // Add new settled transaction for inventory restock
    const approvedPO = approvals.find(a => a.id === poId);
    let newTx: Transaction | null = null;
    if (approvedPO) {
      newTx = {
        id: `tx-po-${Date.now()}`,
        time: 'Just now',
        customer: `Restock: ${approvedPO.supplierOrClient}`,
        method: 'NIBSS Instant Transfer',
        branch: 'Ikeja Depot',
        amount: approvedPO.amount,
        status: 'Settled',
        reference: `NIBSS-${Math.floor(10000000 + Math.random() * 90000000)}`
      };
      setTransactions(prev => [newTx!, ...prev]);
    }

    // Persist to Cloud Firestore
    try {
      await dbUpdateApprovalStatus(poId, 'approved');
      if (newTx) {
        await dbSaveTransaction(newTx);
      }
      const targetMsg = messages.find(m => m.pendingAuthorization?.id === poId);
      if (targetMsg) {
        await dbUpdateMessagePendingAuth(targetMsg.id, 'approved');
      }
    } catch (err) {
      console.warn('Firestore write warning:', err);
    }
  };

  const handleRejectPO = async (poId: string) => {
    setApprovals(prev =>
      prev.map(item =>
        item.id === poId ? { ...item, status: 'rejected' } : item
      )
    );
    try {
      await dbUpdateApprovalStatus(poId, 'rejected');
    } catch (err) {
      console.warn('Firestore update warning:', err);
    }
  };

  const handleModifyPO = async (poId: string, customTerms: string) => {
    const updatedDesc = `${approvals.find(a => a.id === poId)?.description || ''} [Modified Terms: ${customTerms}]`;
    setApprovals(prev =>
      prev.map(item =>
        item.id === poId
          ? {
              ...item,
              status: 'modified',
              description: updatedDesc
            }
          : item
      )
    );
    try {
      await dbUpdateApprovalStatus(poId, 'modified', updatedDesc);
    } catch (err) {
      console.warn('Firestore update warning:', err);
    }
  };

  // Toggle agent autonomy mode
  const handleToggleAutonomy = async (agentId: string) => {
    let nextMode: 'Autonomous' | 'Semi-Autonomous' | 'Supervised' = 'Autonomous';
    setAgents(prev =>
      prev.map(a => {
        if (a.id === agentId) {
          nextMode =
            a.autonomy === 'Autonomous'
              ? 'Semi-Autonomous'
              : a.autonomy === 'Semi-Autonomous'
              ? 'Supervised'
              : 'Autonomous';
          return { ...a, autonomy: nextMode };
        }
        return a;
      })
    );
    try {
      await dbUpdateAgentAutonomy(agentId, nextMode);
    } catch (err) {
      console.warn('Firestore autonomy update warning:', err);
    }
  };

  const handleRunDiagnostic = async (agentId: string) => {
    let updatedAcc = 99.9;
    const lastAction = 'Self-diagnostic passed. All tool bindings verified (0 anomalies)';
    setAgents(prev =>
      prev.map(a => {
        if (a.id === agentId) {
          updatedAcc = Math.min(99.9, +(a.accuracy + 0.5).toFixed(1));
          return {
            ...a,
            status: 'active',
            accuracy: updatedAcc,
            lastAction
          };
        }
        return a;
      })
    );
    try {
      await dbUpdateAgentDiagnostic(agentId, 'active', updatedAcc, lastAction);
    } catch (err) {
      console.warn('Firestore diagnostic warning:', err);
    }
  };

  // Dynamic AI CEO Orchestrator Responses
  const handleSendMessage = async (userQuery: string) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      senderName: 'Alhaji Balogun (You)',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: userQuery
    };

    let agentReply: ChatMessage;
    const lower = userQuery.toLowerCase();

    if (lower.includes('owe') || lower.includes('30 days') || lower.includes('debtor')) {
      agentReply = {
        id: `msg-${Date.now() + 1}`,
        sender: 'agent',
        senderName: 'KoraOps CEO Agent',
        timestamp: 'Just now',
        content: 'I pulled receivables telemetry from the Postgres double-entry ledger. Total overdue past 30 days is ₦1,930,000 across 2 merchant accounts:',
        telemetryReports: [
          {
            id: 'deb-1',
            agentName: 'Finance Agent Audit',
            agentType: 'finance',
            badge: '2 Debtors Flagged',
            badgeVariant: 'warning',
            body: '1. Alaba Electronics Mart: ₦1,250,000 (34 days overdue). 2. Continental Catering Services: ₦680,000 (31 days overdue). Automated WhatsApp gentle reminder dispatched.'
          }
        ],
        sqlCount: 3
      };
    } else if (lower.includes('margin') || lower.includes('cosmetic')) {
      agentReply = {
        id: `msg-${Date.now() + 1}`,
        sender: 'agent',
        senderName: 'KoraOps CEO Agent',
        timestamp: 'Just now',
        content: 'Analysis of cosmetics and personal care product lines across Victoria Island and Ikeja stores:',
        telemetryReports: [
          {
            id: 'rep-mgn',
            agentName: 'Finance Agent Report',
            agentType: 'finance',
            badge: 'Healthy 34.2%',
            badgeVariant: 'success',
            body: 'Cosmetics category gross margin stands at 34.2% (₦304,380 profit on ₦890,000 gross). High-velocity items: Dettol antiseptic and Nivea skincare cartons.'
          }
        ],
        sqlCount: 2
      };
    } else if (lower.includes('cashflow') || lower.includes('weekend')) {
      agentReply = {
        id: `msg-${Date.now() + 1}`,
        sender: 'agent',
        senderName: 'KoraOps CEO Agent',
        timestamp: 'Just now',
        content: 'Weekend cashflow projection synthesized by Finance & Demand Prediction Agents:',
        telemetryReports: [
          {
            id: 'rep-csh',
            agentName: 'Finance Agent Forecast',
            agentType: 'finance',
            badge: '+₦4.63M Net',
            badgeVariant: 'success',
            body: 'Projected Inflow: ₦8,450,000 (Saturday FMCG surge). Projected Outflow: ₦3,820,000 (Flour Mills PO & van logistics). Cash balance remains robust at >₦16.8M.'
          }
        ],
        sqlCount: 4
      };
    } else {
      agentReply = {
        id: `msg-${Date.now() + 1}`,
        sender: 'agent',
        senderName: 'KoraOps CEO Agent',
        timestamp: 'Just now',
        content: `Sub-agents analyzed query: "${userQuery}". Operating health index is currently 94/100. Ikeja inventory burn rates and Victoria Island POS flows are functioning within normal variance limits.`,
        sqlCount: 2
      };
    }

    setMessages(prev => [...prev, userMsg, agentReply]);

    // Persist messages to Firestore
    try {
      await dbSaveMessage(userMsg);
      await dbSaveMessage(agentReply);
    } catch (err) {
      console.warn('Firestore message save warning:', err);
    }
  };

  const handleQuickRestock = async (sku: string) => {
    const item = inventory.find(i => i.sku === sku);
    if (!item) return;

    const newPO: ApprovalItem = {
      id: `po-${Date.now()}`,
      refCode: `#PO-2024-${Math.floor(100 + Math.random() * 900)}`,
      title: `Express Restock: ${item.name}`,
      supplierOrClient: item.supplier,
      amount: 450000,
      risk: 'Low',
      category: 'Purchase Order',
      agentSource: 'Procurement Agent',
      description: `Replenishment order for ${item.name} to avoid supply gap at ${item.branch}.`,
      status: 'pending',
      date: 'Just now',
      details: {
        justification: `Inventory stock at ${item.stockLevel} ${item.unit}, burn rate requires replenishment.`,
        impact: `Maintains store uptime and continuous POS settlements.`
      }
    };

    setApprovals(prev => [newPO, ...prev]);
    setActiveTab('approvals');

    try {
      await dbSaveApproval(newPO);
    } catch (err) {
      console.warn('Firestore save approval warning:', err);
    }
  };

  const handleOpenCeoChatWithPrompt = (prompt: string) => {
    setActiveTab('ai-ceo');
    handleSendMessage(prompt);
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col antialiased selection:bg-secondary-container selection:text-on-secondary-fixed">
      {/* Top Application Header */}
      <Header
        selectedLocation={selectedLocation}
        onOpenLocationModal={() => setIsLocationModalOpen(true)}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onOpenWorkforceTab={() => setActiveTab('workforce')}
        agentCount={agents.length}
        dbStatus={dbStatus}
      />

      {/* Main Screen Content */}
      <main className="flex-1 flex flex-col relative w-full pt-20 pb-20 bg-surface">
        {activeTab === 'ai-ceo' && (
          <AiCeoScreen
            messages={messages}
            onSendMessage={handleSendMessage}
            pendingPO={approvals[0]}
            onApprovePO={handleApprovePO}
            onModifyPO={handleModifyPO}
            onOpenSqlModal={() => setIsSqlModalOpen(true)}
            onOpenProfileModal={() => setIsProfileModalOpen(true)}
            onOpenBranchModal={() => setIsLocationModalOpen(true)}
            executiveMode={executiveMode}
            isWhatsAppActive={isWhatsAppActive}
            onToggleWhatsApp={() => setIsWhatsAppActive(!isWhatsAppActive)}
            sqlQueriesCount={sqlQueries.length}
            userEmail={userEmail}
          />
        )}

        {activeTab === 'overview' && (
          <OverviewScreen
            onNavigateToTab={setActiveTab}
            pendingApprovals={approvals}
            inventory={inventory}
            transactions={transactions}
            currentBranch={selectedLocation}
          />
        )}

        {activeTab === 'approvals' && (
          <ApprovalsScreen
            approvals={approvals}
            onApprove={handleApprovePO}
            onReject={handleRejectPO}
            onModify={handleModifyPO}
            onOpenCeoChatWithPrompt={handleOpenCeoChatWithPrompt}
          />
        )}

        {activeTab === 'workforce' && (
          <WorkforceScreen
            agents={agents}
            onToggleAutonomy={handleToggleAutonomy}
            onRunDiagnostic={handleRunDiagnostic}
            onOpenCeoChatWithPrompt={handleOpenCeoChatWithPrompt}
          />
        )}

        {activeTab === 'operations' && (
          <OperationsScreen
            inventory={inventory}
            transactions={transactions}
            sqlQueries={sqlQueries}
            onOpenSqlModal={() => setIsSqlModalOpen(true)}
            onQuickRestock={handleQuickRestock}
          />
        )}
      </main>

      {/* Fixed Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        pendingApprovalsCount={pendingApprovalsCount}
      />

      {/* Modals */}
      <SqlQueriesModal
        isOpen={isSqlModalOpen}
        onClose={() => setIsSqlModalOpen(false)}
        queries={sqlQueries}
      />

      <BranchSwitcherModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        currentBranch={selectedLocation}
        onSelectBranch={setSelectedLocation}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        executiveMode={executiveMode}
        onSetExecutiveMode={setExecutiveMode}
        isWhatsAppActive={isWhatsAppActive}
        onToggleWhatsApp={() => setIsWhatsAppActive(!isWhatsAppActive)}
      />

      <BiometricAuthModal
        isOpen={isBiometricModalOpen}
        onClose={() => {
          setIsBiometricModalOpen(false);
          setBiometricTarget(null);
        }}
        onSuccess={(targetId) => {
          executeApprovePO(targetId);
        }}
        target={biometricTarget}
      />
    </div>
  );
}
