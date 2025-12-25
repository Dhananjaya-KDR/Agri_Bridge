import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp, Send, Bell } from 'lucide-react';

const BuyerPanel = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [farmers, setFarmers] = useState([]);
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [loading, setLoading] = useState(true);

  // Feature states
  const [isDropdownOpen, setIsDropdownOpen] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadSenders, setUnreadSenders] = useState([]);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);

  // Mock Current User (Buyer)
  const storedUser = JSON.parse(localStorage.getItem('user')) || {};
  const currentUserId = storedUser.id || 2; // Fallback to 2 if not found

  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // 1. Fetch Farmers
    const fetchFarmers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users/farmer');
        if (response.ok) {
            const data = await response.json();
            setFarmers(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch farmers", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFarmers();
  }, []);

  // 1.5 Global Poll for Notifications (Unread Count)
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
          // Also fetch details
          const responseDetails = await fetch(`http://localhost:5000/api/messages/unread-senders/${currentUserId}`);
          if (responseDetails.ok) {
              const data = await responseDetails.json();
              setUnreadSenders(data.data);
          }
      } catch (error) {
          console.error("Error fetching notifications", error);
      }
  };

  // 2. Poll for Messages
  useEffect(() => {
    if (!selectedFarmer) return;

    // Mark as read
    const markRead = async () => {
        try {
            await fetch('http://localhost:5000/api/messages/mark-read', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: currentUserId, sender_id: selectedFarmer.id })
            });
            // Re-fetch global unread
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
            const response = await fetch(`http://localhost:5000/api/messages/${currentUserId}/${selectedFarmer.id}`);
            if (response.ok) {
                const data = await response.json();
                setMessages(data.data);
                // Notification logic handled globally now
            }
        } catch (error) {
            console.error("Error fetching messages", error);
        }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 3000); // Poll every 3s
    scrollToBottom();

    return () => clearInterval(interval);
  }, [selectedFarmer]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
      if (!message.trim() || !selectedFarmer) return;

      const currentMessage = message;
      setMessage(''); // Optimistic clear

      try {
          const response = await fetch('http://localhost:5000/api/messages', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  sender_id: currentUserId,
                  receiver_id: selectedFarmer.id,
                  content: currentMessage
              })
          });

          if (response.ok) {
              const newItem = {
                  sender_id: currentUserId,
                  receiver_id: selectedFarmer.id, // Fixed typo from 'slectedBuyer' logic
                  content: currentMessage,
                  timestamp: new Date().toISOString()
              };
              setMessages([...messages, newItem]);
          } else {
              console.error("Message send failed");
          }
      } catch (error) {
          console.error("Error sending message", error);
      }
  };

  return (
    <div className="panel-container">
      {/* Left / Main Chat Area */}
      <div className="chat-area">
        <div className="chat-area-header" style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 2rem', boxSizing: 'border-box', position: 'absolute', top: '20px', left: 0 }}>
            <h1 className="title-text" style={{ margin: 0, textAlign: 'left', fontSize: '2.5rem' }}>
                {selectedFarmer ? `Chat with ${selectedFarmer.name}` : "Buyer Panel"}
            </h1>
            
            <div 
                style={{ position: 'relative', cursor: 'pointer', background: 'white', padding: '10px', borderRadius: '50%', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}
                 onClick={() => setIsNotifDropdownOpen(!isNotifDropdownOpen)}
            >
                <Bell size={28} color="black" />
                {unreadCount > 0 && (
                    <div style={{
                        position: 'absolute',
                        top: '0',
                        right: '0',
                        width: '12px',
                        height: '12px',
                        backgroundColor: 'red',
                        borderRadius: '50%',
                        border: '2px solid white'
                    }} />
                )}
                {/* Notification Dropdown */}
                {isNotifDropdownOpen && (
                    <div style={{
                        position: 'absolute',
                        top: '50px',
                        right: '0',
                        minWidth: '250px',
                        background: 'white',
                        borderRadius: '15px',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                        zIndex: 100,
                        padding: '10px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '5px'
                    }}>
                        <h4 style={{ margin: '5px 10px', fontSize: '1rem', color: '#333' }}>Notifications</h4>
                        {unreadSenders.length === 0 ? (
                            <div style={{ padding: '10px', color: '#888', fontSize: '0.9rem' }}>No new messages</div>
                        ) : (
                            unreadSenders.map((sender) => (
                                <div 
                                    key={sender.sender_id}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        // Find farmer object to select
                                        const farmer = farmers.find(f => f.id === sender.sender_id);
                                        if (farmer) {
                                            setSelectedFarmer(farmer);
                                            setIsNotifDropdownOpen(false);
                                        }
                                    }}
                                    style={{
                                        padding: '10px',
                                        background: '#f0fdf4',
                                        borderRadius: '10px',
                                        cursor: 'pointer',
                                        border: '1px solid #d1fae5'
                                    }}
                                >
                                    <div style={{ fontWeight: 'bold', fontSize: '0.9rem', color: '#000' }}>{sender.sender_name}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#059669' }}>{sender.count} new message(s)</div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>

        {/* Chat Content */}
        {!selectedFarmer ? (
            <div className="chat-bubble-container" style={{ marginTop: '60px', justifyContent: 'center' }}>
                <div className="chat-bubble" style={{ alignItems: 'center', justifyContent: 'center' }}>
                    Select a farmer to start chatting.
                </div>
            </div>
        ) : (
            <div className="chat-messages-scroll" style={{ 
                marginTop: '100px', 
                width: '100%', 
                height: 'calc(100vh - 250px)', 
                overflowY: 'auto', 
                padding: '0 2rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
            }}>
                {messages.length === 0 ? (
                    <div style={{ textAlign: 'center', opacity: 0.5, marginTop: '20px' }}>No messages yet. Ask about products!</div>
                ) : (
                    messages.map((msg, index) => {
                        const isMe = msg.sender_id === currentUserId;
                        return (
                            <div key={index} style={{ 
                                alignSelf: isMe ? 'flex-end' : 'flex-start',
                                background: isMe ? '#d1fae5' : 'white',
                                color: 'black',
                                padding: '15px 20px',
                                borderRadius: '20px',
                                maxWidth: '60%',
                                boxShadow: '0 2px 2px rgba(0,0,0,0.05)',
                                borderBottomRightRadius: isMe ? '0' : '20px',
                                borderBottomLeftRadius: isMe ? '20px' : '0'
                            }}>
                                <div style={{ fontWeight: 'bold', fontSize: '0.8rem', marginBottom: '4px', opacity: 0.7 }}>
                                    {isMe ? 'You' : selectedFarmer.name}
                                </div>
                                {msg.content}
                            </div>
                        );
                    })
                )}
                <div ref={chatEndRef} />
            </div>
        )}

        {/* Send Input Area */}
        {selectedFarmer && (
            <div className="send-btn-container" style={{ position: 'absolute', bottom: '2rem', width: '90%', display: 'flex', gap: '10px' }}>
                <input 
                    type="text" 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type a message..."
                    style={{ 
                        flex: 1, 
                        padding: '15px 25px', 
                        borderRadius: '50px', 
                        border: 'none', 
                        fontSize: '1rem',
                        color: 'black',
                        background: 'rgba(255,255,255,0.8)',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                    }}
                />
                <button className="send-pill" onClick={handleSendMessage} style={{ width: 'auto', padding: '15px 30px' }}>
                    Send <Send size={20} fill="black" />
                </button>
            </div>
        )}
      </div>

      {/* Right Sidebar */}
      <div className="sidebar-right">
        <div 
            className="dropdown-pill"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
            Farmers List
            {isDropdownOpen ? <ChevronUp size={28} color="black" /> : <ChevronDown size={28} color="black" />}
        </div>
        
        {isDropdownOpen && (
            <div style={{ marginTop: '1rem', width: '100%', display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '70vh', overflowY: 'auto' }}>
                {loading ? (
                    <p style={{ color: 'white' }}>Loading...</p>
                ) : farmers.length === 0 ? (
                    <p style={{ color: 'white' }}>No farmers found.</p>
                ) : (
                    farmers.map((farmer) => (
                        <div 
                            key={farmer.id} 
                            onClick={() => setSelectedFarmer(farmer)}
                            style={{ 
                                padding: '15px', 
                                background: selectedFarmer?.id === farmer.id ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.15)', 
                                borderRadius: '15px', 
                                cursor: 'pointer',
                                color: '#000',
                                fontWeight: '500', 
                                textAlign: 'left',
                                transition: 'all 0.2s',
                                backdropFilter: 'blur(5px)'
                            }}
                        >
                            <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{farmer.name}</div>
                            <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>{farmer.location || 'No location'}</div>
                        </div>
                    ))
                )}
            </div>
        )}
      </div>
    </div>
  );
};

export default BuyerPanel;
