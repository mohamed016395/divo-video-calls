'use client';

import { useEffect, useRef, useState } from 'react';

const conversations = [
  { name: 'Maya Chen', initials: 'MC', message: 'The launch looks amazing!', time: '2m', online: true, accent: '#e8a995' },
  { name: 'Jordan Lee', initials: 'JL', message: 'Sent a photo', time: '18m', online: true, accent: '#82abc4' },
  { name: 'Design Team', initials: 'DT', message: 'Aisha: I added the notes', time: '1h', online: false, accent: '#b1a1c9' },
  { name: 'Noah Williams', initials: 'NW', message: 'See you then!', time: '3h', online: false, accent: '#c9aa7d' },
  { name: 'Aisha Khan', initials: 'AK', message: 'You: Thanks for the update', time: '1d', online: true, accent: '#86b09a' },
];

const starterMessages = [
  { mine: false, text: 'Hey! Are we still on for the walkthrough today?', time: '10:32 AM' },
  { mine: true, text: 'Absolutely — I just finished the latest changes.', time: '10:33 AM' },
  { mine: true, text: 'Want me to share my screen and give you a quick tour?', time: '10:33 AM' },
  { mine: false, text: 'That would be perfect. Let’s do a call!', time: '10:35 AM' },
];

export default function Home() {
  const [active, setActive] = useState(0);
  const [messages, setMessages] = useState(starterMessages);
  const [draft, setDraft] = useState('');
  const [mobileMenu, setMobileMenu] = useState(false);
  const [callOpen, setCallOpen] = useState(false);
  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!callOpen) return;

    let stream: MediaStream | undefined;
    navigator.mediaDevices?.getUserMedia({ video: true, audio: true })
      .then((mediaStream) => {
        stream = mediaStream;
        if (videoRef.current) videoRef.current.srcObject = mediaStream;
      })
      .catch(() => undefined);

    return () => stream?.getTracks().forEach((track) => track.stop());
  }, [callOpen]);

  function sendMessage() {
    const text = draft.trim();
    if (!text) return;
    setMessages((current) => [...current, { mine: true, text, time: 'Now' }]);
    setDraft('');
  }

  const person = conversations[active];
  const visibleMessages = query
    ? messages.filter((message) => message.text.toLowerCase().includes(query.toLowerCase()))
    : messages;

  return (
    <main className="app">
      <aside className={`sidebar ${mobileMenu ? 'sidebar-open' : ''}`}>
        <div className="brand-row">
          <button className="brand" aria-label="Divo home">
            <span className="brand-logo"><span /></span>
            <strong>Divo</strong>
          </button>
          <button className="icon close-menu" onClick={() => setMobileMenu(false)} aria-label="Close menu">×</button>
        </div>

        <button className="new-message"><span className="plus">＋</span> New message</button>

        <div className="section-heading"><span>Messages</span><span>{conversations.length}</span></div>
        <nav className="conversation-list" aria-label="Conversations">
          {conversations.map((conversation, index) => (
            <button
              type="button"
              key={conversation.name}
              className={`conversation ${active === index ? 'selected' : ''}`}
              onClick={() => { setActive(index); setMobileMenu(false); setQuery(''); }}
            >
              <span className="avatar" style={{ background: conversation.accent }}>
                {conversation.initials}
                {conversation.online && <i className="presence" />}
              </span>
              <span className="conversation-info">
                <span className="conversation-top"><b>{conversation.name}</b><time>{conversation.time}</time></span>
                <span className="conversation-preview">{conversation.message}</span>
              </span>
            </button>
          ))}
        </nav>

        <button className="profile" type="button">
          <span className="avatar profile-avatar">YO<i className="presence" /></span>
          <span className="profile-copy"><b>You</b><small>Available</small></span>
          <span className="dots">•••</span>
        </button>
      </aside>

      <section className="chat-panel">
        <header className="chat-header">
          <button className="icon menu-button" onClick={() => setMobileMenu(true)} aria-label="Open menu">☰</button>
          <span className="avatar header-avatar" style={{ background: person.accent }}>{person.initials}{person.online && <i className="presence" />}</span>
          <span className="header-person"><b>{person.name}</b><small>{person.online ? 'Active now' : 'Last seen recently'}</small></span>
          <span className="header-actions">
            <button className={`icon action ${searchOpen ? 'action-active' : ''}`} onClick={() => setSearchOpen((open) => !open)} aria-label="Search messages">⌕</button>
            <button className="video-button" onClick={() => setCallOpen(true)} type="button"><span className="video-icon">●</span><b>Video call</b></button>
          </span>
        </header>

        {searchOpen && (
          <div className="search-row">
            <span>⌕</span>
            <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search in conversation" />
            {query && <button onClick={() => setQuery('')} aria-label="Clear search">×</button>}
          </div>
        )}

        <div className="messages" aria-live="polite">
          <div className="date"><span>Today</span></div>
          {visibleMessages.map((message, index) => (
            <div className={`message-row ${message.mine ? 'mine' : ''}`} key={`${message.text}-${index}`}>
              {!message.mine && <span className="mini-avatar" style={{ background: person.accent }}>{person.initials}</span>}
              <div className="message-stack">
                <div className="bubble">{message.text}</div>
                <time>{message.time}</time>
              </div>
            </div>
          ))}
          {query && visibleMessages.length === 0 && <div className="empty-search">No messages match “{query}”</div>}
        </div>

        <footer className="composer">
          <button className="icon attach" type="button" aria-label="Attach a file">＋</button>
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => { if (event.key === 'Enter') sendMessage(); }}
            placeholder="Write a message…"
          />
          <button className="icon emoji" type="button" aria-label="Choose emoji">☺</button>
          <button className="send" type="button" onClick={sendMessage} aria-label="Send message">➤</button>
        </footer>
      </section>

      {callOpen && (
        <div className="call-overlay" role="dialog" aria-modal="true" aria-label="Video call">
          <div className="call-card">
            <div className="call-background">
              <span className="remote-avatar" style={{ background: person.accent }}>{person.initials}</span>
              <b>{person.name}</b>
              <small>Connected</small>
              <video ref={videoRef} autoPlay muted playsInline className={cameraOff ? 'camera-hidden' : 'local-video'} />
            </div>
            <div className="call-controls">
              <button type="button" className={muted ? 'control-active' : ''} onClick={() => setMuted((value) => !value)}>{muted ? 'Unmute' : 'Mute'}</button>
              <button type="button" className={cameraOff ? 'control-active' : ''} onClick={() => setCameraOff((value) => !value)}>{cameraOff ? 'Camera on' : 'Camera off'}</button>
              <button type="button" className="hangup" onClick={() => setCallOpen(false)}>End call</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
