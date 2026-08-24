import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  getDocFromServer,
  query, 
  orderBy, 
  limit, 
  onSnapshot 
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { LeaderboardEntry } from '../types';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// CRITICAL: Connect to specific database ID
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.warn('Firestore Operation Notice:', JSON.stringify(errInfo));
}

// Test Connection on Boot (Skill Requirement)
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore is running in offline/cached mode.');
    }
    return false;
  }
}

// Submit score directly to Firebase Firestore
export async function saveScoreToFirestore(entry: {
  playerName: string;
  avatarSeed?: string;
  score: number;
  totalQuestions: number;
  accuracyPercent: number;
  timeTakenSec: number;
  categoryMode: string;
  rankTitle: string;
}): Promise<LeaderboardEntry> {
  const path = 'leaderboard';
  const cleanId = 'entry_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
  
  const payload: LeaderboardEntry = {
    id: cleanId,
    playerName: entry.playerName.trim().slice(0, 25),
    avatarSeed: entry.avatarSeed || entry.playerName.trim(),
    score: entry.score,
    totalQuestions: entry.totalQuestions,
    accuracyPercent: entry.accuracyPercent,
    timeTakenSec: entry.timeTakenSec,
    categoryMode: entry.categoryMode,
    rankTitle: entry.rankTitle,
    timestamp: Date.now()
  };

  try {
    const docRef = doc(db, path, cleanId);
    await setDoc(docRef, payload);
    return payload;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${path}/${cleanId}`);
    return payload;
  }
}

// Subscribe to real-time Leaderboard updates
export function subscribeLeaderboard(
  onUpdate: (entries: LeaderboardEntry[]) => void
): () => void {
  const path = 'leaderboard';
  try {
    const q = query(collection(db, path), orderBy('score', 'desc'), limit(50));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const entries: LeaderboardEntry[] = [];
        snapshot.forEach((d) => {
          const data = d.data() as LeaderboardEntry;
          entries.push({
            ...data,
            id: d.id
          });
        });
        if (entries.length > 0) {
          onUpdate(entries);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );
    return unsubscribe;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return () => {};
  }
}

// Fetch all leaderboard entries
export async function getFirestoreLeaderboard(): Promise<LeaderboardEntry[]> {
  const path = 'leaderboard';
  try {
    const q = query(collection(db, path), orderBy('score', 'desc'), limit(50));
    const snap = await getDocs(q);
    const results: LeaderboardEntry[] = [];
    snap.forEach((d) => {
      results.push({ ...(d.data() as LeaderboardEntry), id: d.id });
    });
    return results;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}
