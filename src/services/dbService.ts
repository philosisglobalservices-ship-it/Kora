import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  setDoc,
  updateDoc,
  writeBatch
} from 'firebase/firestore';
import { db } from '../firebase';
import {
  ApprovalItem,
  ChatMessage,
  InventoryProduct,
  SqlQueryItem,
  SubAgentTelemetry,
  Transaction
} from '../types';
import {
  INITIAL_AGENTS,
  INITIAL_APPROVALS,
  INITIAL_CHAT_MESSAGES,
  INITIAL_INVENTORY,
  INITIAL_SQL_QUERIES,
  INITIAL_TRANSACTIONS
} from '../data/initialData';

// Collection references
export const COLLECTIONS = {
  APPROVALS: 'approvals',
  INVENTORY: 'inventory',
  TRANSACTIONS: 'transactions',
  AGENTS: 'agents',
  MESSAGES: 'messages',
  SQL_QUERIES: 'sqlQueries'
} as const;

/**
 * Seeds initial mock data into Firestore if collections are currently empty.
 * This ensures that on first connect, the user has the complete enterprise dataset ready.
 */
export async function initializeDatabaseSeed(): Promise<void> {
  try {
    // 1. Approvals
    const approvalsSnap = await getDocs(collection(db, COLLECTIONS.APPROVALS));
    if (approvalsSnap.empty) {
      const batch = writeBatch(db);
      INITIAL_APPROVALS.forEach((item) => {
        batch.set(doc(db, COLLECTIONS.APPROVALS, item.id), item);
      });
      await batch.commit();
      console.log('Seeded approvals collection');
    }

    // 2. Inventory
    const inventorySnap = await getDocs(collection(db, COLLECTIONS.INVENTORY));
    if (inventorySnap.empty) {
      const batch = writeBatch(db);
      INITIAL_INVENTORY.forEach((item) => {
        batch.set(doc(db, COLLECTIONS.INVENTORY, item.id), item);
      });
      await batch.commit();
      console.log('Seeded inventory collection');
    }

    // 3. Transactions
    const txSnap = await getDocs(collection(db, COLLECTIONS.TRANSACTIONS));
    if (txSnap.empty) {
      const batch = writeBatch(db);
      INITIAL_TRANSACTIONS.forEach((item) => {
        batch.set(doc(db, COLLECTIONS.TRANSACTIONS, item.id), item);
      });
      await batch.commit();
      console.log('Seeded transactions collection');
    }

    // 4. Agents
    const agentsSnap = await getDocs(collection(db, COLLECTIONS.AGENTS));
    if (agentsSnap.empty) {
      const batch = writeBatch(db);
      INITIAL_AGENTS.forEach((item) => {
        batch.set(doc(db, COLLECTIONS.AGENTS, item.id), item);
      });
      await batch.commit();
      console.log('Seeded agents collection');
    }

    // 5. Messages
    const messagesSnap = await getDocs(collection(db, COLLECTIONS.MESSAGES));
    if (messagesSnap.empty) {
      const batch = writeBatch(db);
      INITIAL_CHAT_MESSAGES.forEach((item) => {
        // Remove undefined fields if any to satisfy Firestore constraints
        const cleanMsg = JSON.parse(JSON.stringify(item));
        batch.set(doc(db, COLLECTIONS.MESSAGES, item.id), cleanMsg);
      });
      await batch.commit();
      console.log('Seeded messages collection');
    }

    // 6. SQL Queries
    const sqlSnap = await getDocs(collection(db, COLLECTIONS.SQL_QUERIES));
    if (sqlSnap.empty) {
      const batch = writeBatch(db);
      INITIAL_SQL_QUERIES.forEach((item) => {
        batch.set(doc(db, COLLECTIONS.SQL_QUERIES, item.id), item);
      });
      await batch.commit();
      console.log('Seeded sqlQueries collection');
    }
  } catch (error) {
    console.error('Error verifying or seeding Firestore data:', error);
  }
}

// ----------------------------------------------------
// Real-time Listeners
// ----------------------------------------------------

export function subscribeToApprovals(
  onUpdate: (items: ApprovalItem[]) => void,
  onError?: (err: Error) => void
) {
  return onSnapshot(
    collection(db, COLLECTIONS.APPROVALS),
    (snapshot) => {
      const items: ApprovalItem[] = [];
      snapshot.forEach((d) => items.push(d.data() as ApprovalItem));
      // Sort: pending first or by date
      onUpdate(items);
    },
    (err) => {
      console.error('Approvals snapshot error:', err);
      onError?.(err);
    }
  );
}

export function subscribeToInventory(
  onUpdate: (items: InventoryProduct[]) => void,
  onError?: (err: Error) => void
) {
  return onSnapshot(
    collection(db, COLLECTIONS.INVENTORY),
    (snapshot) => {
      const items: InventoryProduct[] = [];
      snapshot.forEach((d) => items.push(d.data() as InventoryProduct));
      onUpdate(items);
    },
    (err) => {
      console.error('Inventory snapshot error:', err);
      onError?.(err);
    }
  );
}

export function subscribeToTransactions(
  onUpdate: (items: Transaction[]) => void,
  onError?: (err: Error) => void
) {
  return onSnapshot(
    collection(db, COLLECTIONS.TRANSACTIONS),
    (snapshot) => {
      const items: Transaction[] = [];
      snapshot.forEach((d) => items.push(d.data() as Transaction));
      onUpdate(items);
    },
    (err) => {
      console.error('Transactions snapshot error:', err);
      onError?.(err);
    }
  );
}

export function subscribeToAgents(
  onUpdate: (items: SubAgentTelemetry[]) => void,
  onError?: (err: Error) => void
) {
  return onSnapshot(
    collection(db, COLLECTIONS.AGENTS),
    (snapshot) => {
      const items: SubAgentTelemetry[] = [];
      snapshot.forEach((d) => items.push(d.data() as SubAgentTelemetry));
      onUpdate(items);
    },
    (err) => {
      console.error('Agents snapshot error:', err);
      onError?.(err);
    }
  );
}

export function subscribeToMessages(
  onUpdate: (items: ChatMessage[]) => void,
  onError?: (err: Error) => void
) {
  return onSnapshot(
    collection(db, COLLECTIONS.MESSAGES),
    (snapshot) => {
      const items: ChatMessage[] = [];
      snapshot.forEach((d) => items.push(d.data() as ChatMessage));
      onUpdate(items);
    },
    (err) => {
      console.error('Messages snapshot error:', err);
      onError?.(err);
    }
  );
}

export function subscribeToSqlQueries(
  onUpdate: (items: SqlQueryItem[]) => void,
  onError?: (err: Error) => void
) {
  return onSnapshot(
    collection(db, COLLECTIONS.SQL_QUERIES),
    (snapshot) => {
      const items: SqlQueryItem[] = [];
      snapshot.forEach((d) => items.push(d.data() as SqlQueryItem));
      onUpdate(items);
    },
    (err) => {
      console.error('SqlQueries snapshot error:', err);
      onError?.(err);
    }
  );
}

// ----------------------------------------------------
// Mutation Helpers
// ----------------------------------------------------

export async function dbSaveApproval(item: ApprovalItem): Promise<void> {
  await setDoc(doc(db, COLLECTIONS.APPROVALS, item.id), item);
}

export async function dbUpdateApprovalStatus(
  id: string,
  status: ApprovalItem['status'],
  description?: string
): Promise<void> {
  const ref = doc(db, COLLECTIONS.APPROVALS, id);
  if (description) {
    await updateDoc(ref, { status, description });
  } else {
    await updateDoc(ref, { status });
  }
}

export async function dbSaveTransaction(item: Transaction): Promise<void> {
  await setDoc(doc(db, COLLECTIONS.TRANSACTIONS, item.id), item);
}

export async function dbSaveAgent(item: SubAgentTelemetry): Promise<void> {
  await setDoc(doc(db, COLLECTIONS.AGENTS, item.id), item);
}

export async function dbUpdateAgentAutonomy(
  id: string,
  autonomy: SubAgentTelemetry['autonomy']
): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.AGENTS, id), { autonomy });
}

export async function dbUpdateAgentDiagnostic(
  id: string,
  status: SubAgentTelemetry['status'],
  accuracy: number,
  lastAction: string
): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.AGENTS, id), {
    status,
    accuracy,
    lastAction
  });
}

export async function dbSaveMessage(item: ChatMessage): Promise<void> {
  const clean = JSON.parse(JSON.stringify(item));
  await setDoc(doc(db, COLLECTIONS.MESSAGES, item.id), clean);
}

export async function dbUpdateMessagePendingAuth(
  msgId: string,
  authStatus: 'approved' | 'rejected' | 'modified'
): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.MESSAGES, msgId), {
    'pendingAuthorization.status': authStatus
  });
}

export async function dbSaveInventoryItem(item: InventoryProduct): Promise<void> {
  await setDoc(doc(db, COLLECTIONS.INVENTORY, item.id), item);
}

export async function dbSaveSqlQuery(item: SqlQueryItem): Promise<void> {
  await setDoc(doc(db, COLLECTIONS.SQL_QUERIES, item.id), item);
}
