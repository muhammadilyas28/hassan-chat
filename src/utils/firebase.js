// src/utils/firebase.js

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from 'firebase/firestore';
import {
  getDatabase,
  ref as rtdbRef,
  push as rtdbPush,
  set as rtdbSet,
  onValue as rtdbOnValue,
} from 'firebase/database';

// ✅ Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAzq8RIVsh_CXlduDyGbqjvDuU3iomGxLM",
  authDomain: "sypchat-2eb4f.firebaseapp.com",
  projectId: "sypchat-2eb4f",
  storageBucket: "sypchat-2eb4f.firebasestorage.app",
  messagingSenderId: "681016324843",
  appId: "1:681016324843:web:dfcce1a01ae86a756ec4ae",
  measurementId: "G-7J9DER1LQN"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const realtimeDb = getDatabase(app);

// ========== 🔌 Realtime Chat Methods ========== //
export const sendChatMessage = async (from, to, message) => {
  const chatId = [from, to].sort().join('_');
  const msgRef = rtdbRef(realtimeDb, `chats/${chatId}`);
  const newMsgRef = rtdbPush(msgRef);
  await rtdbSet(newMsgRef, {
    from,
    to,
    text: message,
    timestamp: Date.now(),
  });
};

export const listenToChat = (chatId, callback) => {
  const chatRef = rtdbRef(realtimeDb, `chats/${chatId}`);
  rtdbOnValue(chatRef, snapshot => {
    const data = snapshot.val();
    callback(data);
  });
};

// ========== 🤝 Connection Features ========== //
export const sendRequest = async (toUserId) => {
  const fromUserId = auth.currentUser.uid;

  const q = query(
    collection(firestore, 'connections'),
    where('fromUser', '==', fromUserId),
    where('toUser', '==', toUserId)
  );

  const existing = await getDocs(q);
  if (!existing.empty) return;

  await addDoc(collection(firestore, 'connections'), {
    fromUser: fromUserId,
    toUser: toUserId,
    status: 'pending',
    createdAt: new Date(),
  });
};

export const acceptRequest = async (connectionId) => {
  const ref = doc(firestore, 'connections', connectionId);
  await updateDoc(ref, {
    status: 'accepted',
  });
};

export const getConnectionStatus = async (toUserId) => {
  const fromUserId = auth.currentUser.uid;

  const q = query(
    collection(firestore, 'connections'),
    where('fromUser', '==', fromUserId),
    where('toUser', '==', toUserId)
  );
  const sent = await getDocs(q);
  if (!sent.empty) {
    return {
      status: sent.docs[0].data().status,
      id: sent.docs[0].id,
      incoming: false,
    };
  }

  const q2 = query(
    collection(firestore, 'connections'),
    where('fromUser', '==', toUserId),
    where('toUser', '==', fromUserId)
  );
  const received = await getDocs(q2);
  if (!received.empty) {
    return {
      status: received.docs[0].data().status,
      id: received.docs[0].id,
      incoming: true,
    };
  }

  return { status: null };
};

export const getIncomingRequests = async () => {
  const currentUid = auth.currentUser?.uid;
  const q = query(
    collection(firestore, 'connections'),
    where('toUser', '==', currentUid),
    where('status', '==', 'pending')
  );

  const snap = await getDocs(q);
  const requests = [];
  for (const docSnap of snap.docs) {
    const data = docSnap.data();
    requests.push({
      id: docSnap.id,
      fromUser: data.fromUser,
    });
  }
  return requests;
};
