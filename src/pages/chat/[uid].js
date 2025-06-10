import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { auth, db } from '../../utils/firebase';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  where,
} from 'firebase/firestore';

export default function ChatPage() {
  const router = useRouter();
  const { uid: recipientUid } = router.query;

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const currentUid = auth.currentUser?.uid;

  useEffect(() => {
    if (!recipientUid || !currentUid) return;

    const msgsRef = collection(db, 'messages');
    const q = query(
      msgsRef,
      where('participants', 'array-contains', currentUid),
      orderBy('createdAt')
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const filtered = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter(
          (msg) =>
            (msg.from === currentUid && msg.to === recipientUid) ||
            (msg.from === recipientUid && msg.to === currentUid)
        );
      setMessages(filtered);
    });

    return () => unsub();
  }, [recipientUid, currentUid]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    await addDoc(collection(db, 'messages'), {
      from: currentUid,
      to: recipientUid,
      text: newMessage,
      createdAt: new Date(),
      participants: [currentUid, recipientUid],
    });

    setNewMessage('');
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h3>Chat with {recipientUid}</h3>
      <div style={{ marginBottom: '1rem', border: '1px solid #ccc', padding: '1rem', height: '300px', overflowY: 'auto' }}>
        {messages.map(msg => (
          <p key={msg.id}><strong>{msg.from === currentUid ? 'You' : 'Them'}:</strong> {msg.text}</p>
        ))}
      </div>

      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
}
