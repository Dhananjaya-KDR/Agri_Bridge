import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp, Send, Bell, MapPin } from 'lucide-react';

const FarmerPanel = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Feature states
  const [isDropdownOpen, setIsDropdownOpen] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0); 
  const [unreadSenders, setUnreadSenders] = useState([]);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false); 

  // Mock Current User (In a real app, get this from Auth Context/LocalStorage)
  const storedUser = JSON.parse(localStorage.getItem('user')) || {};
  const currentUserId = storedUser.id || 1; // Fallback to 1 if not found (dev) 

  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // 1. Fetch Buyers
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

  // 2. Poll for Messages when a buyer is selected
  useEffect(() => {
    if (!selectedBuyer) return;

    // Mark as read immediately when selecting/polling
    const markRead = async () => {
        try {
            await fetch('http://localhost:5000/api/messages/mark-read', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: currentUserId, sender_id: selectedBuyer.id })
            });
            // Re-fetch global unread to update red dot immediately
            const response = await fetch(`http://localhost:5000/api/messages/unread/${currentUserId}`);
            if (response.ok) {
                const data = await response.json();
                setUnreadCount(data.count);
            }
        } catch (error) { console.error("Error marking read", error); }
    };
    markRead();

    // Fetch messages logic...
    const fetchMessages = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/messages/${currentUserId}/${selectedBuyer.id}`);
            if (response.ok) {
                const data = await response.json();
                setMessages(data.data);
                // No need to setHasNotification here, global poll handles it
            }
        } catch (error) {
            console.error("Error fetching messages", error);
        }
    };

    fetchMessages(); // Initial fetch
    const interval = setInterval(fetchMessages, 3000); // Poll every 3s
    scrollToBottom();

    return () => clearInterval(interval);
  }, [selectedBuyer]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  const handleSendMessage = async () => {
      if (!message.trim() || !selectedBuyer) return;

      const currentMessage = message;
      setMessage(''); // Optimistic clear

      try {
          const response = await fetch('http://localhost:5000/api/messages', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  sender_id: currentUserId,
                  receiver_id: selectedBuyer.id,
                  content: currentMessage
              })
          });

          if (response.ok) {
              // Optimistically update or wait for poll
              const newItem = {
                  sender_id: currentUserId,
                  receiver_id: selectedBuyer.id,
                  content: currentMessage,
                  timestamp: new Date().toISOString()
              };
              setMessages([...messages, newItem]);
          } else {
             // Optional: Handle error - maybe restore message? 
             // For now, we prioritize clearing as requested.
             console.error("Message send failed");
          }
      } catch (error) {
          console.error("Error sending message", error);
      }
  };

  const handleSendLocation = () => {
    if (!selectedBuyer) return;

    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser");
        return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const locationUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
        
        try {
            const response = await fetch('http://localhost:5000/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sender_id: currentUserId,
                    receiver_id: selectedBuyer.id,
                    content: locationUrl,
                    type: 'location'
                })
            });

            if (response.ok) {
                 const newItem = {
                    sender_id: currentUserId,
                    receiver_id: selectedBuyer.id,
                    content: locationUrl,
                    type: 'location',
                    timestamp: new Date().toISOString()
                };
                setMessages([...messages, newItem]);
            }
        } catch (error) {
            console.error("Error sending location", error);
        }
    }, (error) => {
        console.error("Error getting location", error);
        alert("Unable to retrieve your location");
    });
  };

  return (
    <div className="panel-container">
      {/* Left / Main Chat Area */}
      <div className="chat-area">
        <div className="chat-area-header" style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 2rem', boxSizing: 'border-box', position: 'absolute', top: '20px', left: 0 }}>
            <h1 className="title-text" style={{ margin: 0, textAlign: 'left', fontSize: '2.5rem' }}>
                {selectedBuyer ? `Chat with ${selectedBuyer.name}` : "Farmer Panel"}
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
                                        // Find buyer object to select
                                        const buyer = buyers.find(b => b.id === sender.sender_id);
                                        if (buyer) {
                                            setSelectedBuyer(buyer);
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
        {!selectedBuyer ? (
            <div className="chat-bubble-container" style={{ marginTop: '60px', justifyContent: 'center' }}>
                <div className="chat-bubble" style={{ alignItems: 'center', justifyContent: 'center' }}>
                    Select a buyer from the list to start chatting.
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
                    <div style={{ textAlign: 'center', opacity: 0.5, marginTop: '20px' }}>No messages yet. Say hi!</div>
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
                                    {isMe ? 'You' : selectedBuyer.name}
                                </div>
                                {msg.type === 'location' ? (
                                    <a 
                                        href={msg.content} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        style={{ 
                                            color: isMe ? '#065f46' : '#0ea5e9', 
                                            textDecoration: 'underline',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '5px'
                                        }}
                                    >
                                        <MapPin size={16} /> View Location
                                    </a>
                                ) : (
                                    msg.content
                                )}
                            </div>
                        );
                    })
                )}
                <div ref={chatEndRef} />
            </div>
        )}

        {/* Send Input Area */}
        {selectedBuyer && (
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
                <button className="send-pill" onClick={handleSendLocation} style={{ width: 'auto', padding: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Share Location">
                    <MapPin size={20} color="white" />
                </button>
                <button className="send-pill" onClick={handleSendMessage} style={{ width: 'auto', padding: '15px 30px' }}>
                    Send <Send size={20} fill="white" />
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
            Buyers List
            {isDropdownOpen ? <ChevronUp size={28} color="black" /> : <ChevronDown size={28} color="black" />}
        </div>
        
        {isDropdownOpen && (
            <div style={{ marginTop: '1rem', width: '100%', display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '70vh', overflowY: 'auto' }}>
                {loading ? (
                    <p style={{ color: 'white' }}>Loading...</p>
                ) : buyers.length === 0 ? (
                    <p style={{ color: 'white' }}>No buyers found.</p>
                ) : (
                    buyers.map((buyer) => (
                        <div 
                            key={buyer.id} 
                            onClick={() => setSelectedBuyer(buyer)}
                            style={{ 
                                padding: '15px', 
                                background: selectedBuyer?.id === buyer.id ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.15)', 
                                borderRadius: '15px', 
                                cursor: 'pointer',
                                color: '#000',
                                fontWeight: '500',
                                textAlign: 'left',
                                transition: 'all 0.2s',
                                backdropFilter: 'blur(5px)'
                            }}
                        >
                            <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{buyer.name}</div>
                            <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>{buyer.location || 'No location'}</div>
                        </div>
                    ))
                )}
            </div>
        )}
      </div>
    </div>
  );
};

export default FarmerPanel;
