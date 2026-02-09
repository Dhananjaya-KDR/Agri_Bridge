import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp, Send, Bell, MapPin, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FarmerPanel = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Feature states
  const [isDropdownOpen, setIsDropdownOpen] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0); 
  const [unreadSenders, setUnreadSenders] = useState([]);
  const [systemNotifications, setSystemNotifications] = useState([]);
  const [systemUnreadCount, setSystemUnreadCount] = useState(0);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false); 

  // Mock Current User (In a real app, get this from Auth Context/LocalStorage)
  const storedUser = JSON.parse(localStorage.getItem('user')) || {};
  const currentUserId = storedUser.id || 1; 

  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchBuyers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users/buyer');
        if (response.ok) {
            const data = await response.json();
            setBuyers(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch buyers", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBuyers();
  }, []);

  useEffect(() => {
      fetchUnread();
      const interval = setInterval(fetchUnread, 3000);
      return () => clearInterval(interval);
  }, [currentUserId]);

  const fetchUnread = async () => {
      try {
          const response = await fetch(`http://localhost:5000/api/messages/unread/${currentUserId}`);
          if (response.ok) {
              const data = await response.json();
              setUnreadCount(data.count);
          }
          const responseDetails = await fetch(`http://localhost:5000/api/messages/unread-senders/${currentUserId}`);
          if (responseDetails.ok) {
              const data = await responseDetails.json();
              setUnreadSenders(data.data);
          }
           const responseNotifCount = await fetch(`http://localhost:5000/api/notifications/unread-count/${currentUserId}`);
           if (responseNotifCount.ok) {
               const data = await responseNotifCount.json();
               setSystemUnreadCount(data.count);
           }
           const responseNotifs = await fetch(`http://localhost:5000/api/notifications/${currentUserId}`);
           if (responseNotifs.ok) {
               const data = await responseNotifs.json();
               setSystemNotifications(data.data);
           }
      } catch (error) {
          console.error("Error fetching notifications", error);
      }
  };

  const handleMarkNotifRead = async (id) => {
      try {
          await fetch('http://localhost:5000/api/notifications/mark-read', {
             method: 'POST', body: JSON.stringify({ id }), headers: { 'Content-Type': 'application/json' }
          });
          fetchUnread();
      } catch (error) { console.error("Error marking notification read", error); }
  };

  const sendTestNotification = async () => {
      try {
          await fetch('http://localhost:5000/api/notifications', {
              method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ user_id: currentUserId, message: `Test Notification at ${new Date().toLocaleTimeString()}`, type: 'alert' })
          });
          fetchUnread();
      } catch (error) { console.error("Error sending test notification", error); }
  };

  useEffect(() => {
    if (!selectedBuyer) return;
    const markRead = async () => {
        try {
            await fetch('http://localhost:5000/api/messages/mark-read', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: currentUserId, sender_id: selectedBuyer.id })
            });
            const response = await fetch(`http://localhost:5000/api/messages/unread/${currentUserId}`);
            if (response.ok) {
                const data = await response.json();
                setUnreadCount(data.count);
            }
        } catch (error) { console.error("Error marking read", error); }
    };
    markRead();

    const fetchMessages = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/messages/${currentUserId}/${selectedBuyer.id}`);
            if (response.ok) {
                const data = await response.json();
                setMessages(data.data);
            }
        } catch (error) { console.error("Error fetching messages", error); }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 3000); 
    scrollToBottom();
    return () => clearInterval(interval);
  }, [selectedBuyer]);

  useEffect(() => { scrollToBottom(); }, [messages]);

  const handleSendMessage = async () => {
      if (!message.trim() || !selectedBuyer) return;
      const currentMessage = message;
      setMessage('');
      try {
          const response = await fetch('http://localhost:5000/api/messages', {
              method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ sender_id: currentUserId, receiver_id: selectedBuyer.id, content: currentMessage })
          });
          if (response.ok) {
              const newItem = { sender_id: currentUserId, receiver_id: selectedBuyer.id, content: currentMessage, timestamp: new Date().toISOString() };
              setMessages([...messages, newItem]);
          }
      } catch (error) { console.error("Error sending message", error); }
  };

  const handleSendLocation = () => {
    if (!selectedBuyer) return;
    if (!navigator.geolocation) { alert("Geolocation not supported"); return; }
    navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const locationUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
        try {
            const response = await fetch('http://localhost:5000/api/messages', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sender_id: currentUserId, receiver_id: selectedBuyer.id, content: locationUrl, type: 'location' })
            });
            if (response.ok) {
                 const newItem = { sender_id: currentUserId, receiver_id: selectedBuyer.id, content: locationUrl, type: 'location', timestamp: new Date().toISOString() };
                setMessages([...messages, newItem]);
            }
        } catch (error) { console.error("Error sending location", error); }
    }, (error) => { console.error("Error getting location", error); alert("Unable to retrieve location"); });
  };

  const handleLogout = () => {
      localStorage.removeItem('user');
      navigate('/');
  };

  return (
    <div className="panel-container" style={{ display: 'flex', height: '100vh', background: '#f7fafc', overflow: 'hidden' }}>
      
      {/* Left Sidebar (Buyers List) - Moved to left/right based on preference, keeping right as per original logic but restyling */}
      {/* Actually, most chats have list on left. User asked to "align well". Standard is list left, chat right. 
          But original had list on Right. I will keep it on Right to respect original flow but improve styling. 
          Wait, user simply said "align well". Layout: Chat (Left/Center), List (Right). */}

      <div className="chat-area" style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', background: 'white' }}>
        
        {/* Header */}
        <div style={{ 
            padding: '20px 40px', 
            borderBottom: '1px solid #e2e8f0', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            background: 'white',
            zIndex: 10
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#2F855A', margin: 0 }}>
                    {selectedBuyer ? selectedBuyer.name : "Farmer Panel"}
                </h1>
                {selectedBuyer && <span style={{ fontSize: '0.9rem', color: '#718096', padding: '4px 10px', background: '#F0FFF4', borderRadius: '20px' }}>Buyer</span>}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                {/* Notification Bell */}
                <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setIsNotifDropdownOpen(!isNotifDropdownOpen)}>
                    <Bell size={24} color="#718096" />
                    {(unreadCount + systemUnreadCount) > 0 && (
                        <span style={{ position: 'absolute', top: -5, right: -5, height: 10, width: 10, background: '#E53E3E', borderRadius: '50%' }} />
                    )}
                     {isNotifDropdownOpen && (
                        <div style={{ position: 'absolute', top: '40px', right: '0', width: '300px', background: 'white', borderRadius: '12px', boxShadow: '0 10px 15px rgba(0,0,0,0.1)', zIndex: 50, border: '1px solid #e2e8f0', padding: '10px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <strong>Notifications</strong>
                                <button onClick={sendTestNotification} style={{ fontSize: '0.7rem' }}>Test</button>
                            </div>
                            {/* ... Notification List Logic (Simplified for layout focus) ... */}
                            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                {unreadSenders.map(s => <div key={s.sender_id} style={{ padding: '8px', borderBottom: '1px solid #f7fafc', cursor: 'pointer' }} onClick={() => { setSelectedBuyer(buyers.find(b => b.id === s.sender_id)); setIsNotifDropdownOpen(false); }}>New msg from {s.sender_name}</div>)}
                                {systemNotifications.map(n => <div key={n.id} style={{ padding: '8px', background: n.is_read ? 'white' : '#FFF5F5', fontSize: '0.85rem' }} onClick={() => handleMarkNotifRead(n.id)}>{n.message}</div>)}
                                {unreadSenders.length === 0 && systemNotifications.length === 0 && <div style={{ color: '#A0AEC0', textAlign: 'center' }}>No new notifications</div>}
                            </div>
                        </div>
                    )}
                </div>
                
                {/* Logout */}
                <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer' }} title="Logout">
                    <LogOut size={24} color="#718096" />
                </button>
            </div>
        </div>

        {/* Chat Messages */}
        <div style={{ flex: 1, padding: '2rem 40px', overflowY: 'auto', background: '#F7FAFC', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {!selectedBuyer ? (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: '#CBD5E0' }}>
                    <User size={64} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                    <p style={{ fontSize: '1.2rem' }}>Select a buyer to start chatting</p>
                </div>
            ) : (
                messages.map((msg, index) => {
                    const isMe = msg.sender_id === currentUserId;
                    return (
                        <div key={index} style={{ 
                            alignSelf: isMe ? 'flex-end' : 'flex-start',
                            maxWidth: '70%',
                            background: isMe ? '#2F855A' : 'white',
                            color: isMe ? 'white' : '#2D3748',
                            padding: '12px 20px',
                            borderRadius: '18px',
                            borderBottomRightRadius: isMe ? '4px' : '18px',
                            borderBottomLeftRadius: isMe ? '18px' : '4px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                            fontSize: '0.95rem',
                            lineHeight: '1.5'
                        }}>
                             {msg.type === 'location' ? (
                                <a href={msg.content} target="_blank" rel="noopener noreferrer" style={{ color: isMe ? 'white' : '#3182CE', display: 'flex', alignItems: 'center', gap: '5px', textDecoration: 'underline' }}>
                                    <MapPin size={16} /> View Location
                                </a>
                            ) : msg.content}
                            <div style={{ fontSize: '0.7rem', opacity: 0.7, marginTop: '4px', textAlign: 'right' }}>
                                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    );
                })
            )}
            <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        {selectedBuyer && (
            <div style={{ padding: '20px 40px', background: 'white', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '15px' }}>
                 <button onClick={handleSendLocation} style={{ padding: '12px', borderRadius: '50%', border: 'none', background: '#EDF2F7', cursor: 'pointer', transition: 'background 0.2s' }} title="Share Location">
                    <MapPin size={20} color="#4A5568" />
                 </button>
                <input 
                    type="text" 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your message..."
                    style={{ 
                        flex: 1, 
                        padding: '12px 20px', 
                        borderRadius: '50px', 
                        border: '1px solid #E2E8F0', 
                        outline: 'none',
                        fontSize: '1rem'
                    }}
                />
                <button onClick={handleSendMessage} style={{ 
                    padding: '12px 24px', 
                    borderRadius: '50px', 
                    border: 'none', 
                    background: '#2F855A', 
                    color: 'white', 
                    cursor: 'pointer', 
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    Send <Send size={18} />
                </button>
            </div>
        )}
      </div>

      {/* Right Sidebar (Buyers List) - Fixed Width */}
      <div style={{ width: '320px', background: 'white', borderLeft: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, color: '#2D3748' }}>Buyers List</h3>
            <div style={{ background: '#E6FFFA', color: '#2F855A', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                {buyers.length}
            </div>
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
            {loading ? <p style={{ textAlign: 'center', color: '#A0AEC0', marginTop: '20px' }}>Loading...</p> : (
                buyers.map(buyer => (
                    <div 
                        key={buyer.id}
                        onClick={() => setSelectedBuyer(buyer)} 
                        style={{ 
                            padding: '15px', 
                            borderRadius: '12px', 
                            marginBottom: '8px',
                            cursor: 'pointer',
                            background: selectedBuyer?.id === buyer.id ? '#F0FFF4' : 'transparent',
                            border: selectedBuyer?.id === buyer.id ? '1px solid #C6F6D5' : '1px solid transparent',
                            transition: 'all 0.2s'
                        }}
                    >
                        <div style={{ fontWeight: '600', color: '#2D3748' }}>{buyer.name}</div>
                        <div style={{ fontSize: '0.85rem', color: '#718096', marginTop: '2px' }}>{buyer.location || 'Unknown Location'}</div>
                    </div>
                ))
            )}
        </div>
      </div>

    </div>
  );
};

export default FarmerPanel;
