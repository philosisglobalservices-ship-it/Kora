export type TabType = 'overview' | 'ai-ceo' | 'approvals' | 'workforce' | 'operations';

export interface SqlQueryItem {
  id: string;
  agent: string;
  query: string;
  executionTimeMs: number;
  rowsReturned: number;
  tablesTouched: string[];
  timestamp: string;
  status: 'success' | 'cached';
}

export interface SubAgentTelemetry {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'syncing' | 'idle' | 'warning';
  autonomy: 'Autonomous' | 'Semi-Autonomous' | 'Supervised';
  accuracy: number;
  actionsToday: number;
  tools: string[];
  lastAction: string;
  avatarIcon: string;
}

export interface ApprovalItem {
  id: string;
  refCode: string;
  title: string;
  supplierOrClient: string;
  amount: number;
  risk: 'Low' | 'Medium' | 'High';
  category: 'Purchase Order' | 'Credit Limit' | 'Disbursement' | 'Price Discount';
  agentSource: string;
  description: string;
  status: 'pending' | 'approved' | 'modified' | 'rejected';
  date: string;
  details: {
    items?: { name: string; qty: number; unitPrice: number; total: number }[];
    justification: string;
    impact: string;
  };
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  senderName: string;
  timestamp: string;
  content?: string;
  operationalVitality?: {
    healthScore: number;
    headline: string;
  };
  velocityMetric?: {
    label: string;
    changeText: string;
    bars: { time: string; heightPercent: number; isHighlight?: boolean }[];
  };
  telemetryReports?: {
    id: string;
    agentName: string;
    agentType: 'finance' | 'inventory' | 'sales' | 'logistics';
    badge: string;
    badgeVariant: 'success' | 'warning' | 'info';
    body: string;
    avatarUrl?: string;
    repName?: string;
    dealsCount?: string;
  }[];
  pendingAuthorization?: ApprovalItem;
  sqlCount?: number;
}

export interface Transaction {
  id: string;
  time: string;
  customer: string;
  method: 'Paystack POS' | 'NIBSS Instant Transfer' | 'Cash Deposit';
  branch: 'Victoria Island' | 'Ikeja Depot';
  amount: number;
  status: 'Settled' | 'Processing';
  reference: string;
}

export interface InventoryProduct {
  id: string;
  sku: string;
  name: string;
  category: string;
  stockLevel: number;
  unit: string;
  reorderPoint: number;
  leadTimeDays: number;
  burnRateHours: number;
  status: 'healthy' | 'warning' | 'critical';
  branch: string;
  supplier: string;
}
