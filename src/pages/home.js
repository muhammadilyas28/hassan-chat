import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { auth } from '../utils/firebase';
import {
  sendRequest,
  acceptRequest,
  getConnectionStatus,
  getIncomingRequests,
} from '../utils/firebase';

export default function Home() {
  const [users, setUsers] = useState([]);
  const [connectionMap, setConnectionMap] = useState({});
  const [requests, setRequests] = useState([]);
  const [userMap, setUserMap] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.get('/auth/users');
        const currentUid = auth.currentUser?.uid;
        const allUsers = response.data;

        setUsers(allUsers);

        // Create a UID -> User map for quick lookups
        const map = {};
        allUsers.forEach(user => {
          map[user.uid] = user;
        });
        setUserMap(map);

        const updatedMap = {};

        for (const user of allUsers) {
          if (user.uid === currentUid) continue;
          const conn = await getConnectionStatus(user.uid);
          updatedMap[user.uid] = conn;
        }

        setConnectionMap(updatedMap);

        // Load incoming requests
        const reqs = await getIncomingRequests();
        setRequests(reqs);
      } catch (err) {
        console.error('Error loading data:', err);
      }
    };

    fetchData();
  }, []);

  const handleSend = async (toUserId) => {
    const user = userMap[toUserId];
    console.log('Sending request to:', user);
    await sendRequest(toUserId);
    setConnectionMap(prev => ({
      ...prev,
      [toUserId]: { status: 'pending' }
    }));
  };

  const handleAccept = async (connId, fromUserId) => {
    await acceptRequest(connId);
    const updated = await getConnectionStatus(fromUserId);
    setConnectionMap(prev => ({
      ...prev,
      [fromUserId]: updated
    }));
    setRequests(prev => prev.filter(req => req.id !== connId));
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h2>All Registered Users</h2>

      {/* 🔔 Incoming Requests Section */}
      {requests.length > 0 && (
        <div style={{ marginBottom: '2rem', background: '#fff3cd', padding: '1rem', borderRadius: '8px' }}>
          <h3>🔔 You have connection requests</h3>
          {requests.map(req => (
            <div key={req.id} style={{
              border: '1px solid #ffeeba',
              backgroundColor: '#fffde7',
              padding: '0.75rem',
              marginBottom: '0.75rem',
              borderRadius: '6px'
            }}>
              <p><strong>{userMap[req.fromUser]?.displayName || req.fromUser}</strong> sent you a connection request</p>
              <button onClick={() => handleAccept(req.id, req.fromUser)}>Accept</button>
            </div>
          ))}
        </div>
      )}

      {/* 🧑 All User Cards */}
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          {users.map(user => {
            const conn = connectionMap[user.uid];
            const isSelf = user.uid === auth.currentUser?.uid;

            return (
              <div key={user.uid} style={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '1rem',
                width: '220px',
                background: '#f9f9f9'
              }}>
                <h4>{user.displayName || 'No name'}</h4>
                <p>{user.email}</p>
                <small style={{ color: '#666' }}>UID: {user.uid}</small>

                {!isSelf && (
                  <div style={{ marginTop: '1rem' }}>
                    {!conn?.status && (
                      <button onClick={() => handleSend(user.uid)}>Send Request</button>
                    )}
                    {conn?.status === 'pending' && !conn?.incoming && (
                      <button disabled>Pending...</button>
                    )}
                    {conn?.status === 'pending' && conn?.incoming && (
                      <button onClick={() => handleAccept(conn.id, user.uid)}>Accept</button>
                    )}
                   {conn?.status === 'accepted' && (
  <button onClick={() => router.push(`/chat/${user.uid}`)}>Chat</button>
)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
