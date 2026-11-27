'use client';

import { useEffect, useRef, useState } from 'react';

const people = [
  { name: 'Maya Chen', preview: 'The launch looks amazing!', time: '2m', online: true, color: '#e9b7a3', initials: 'MC' },
  { name: 'Jordan Lee', preview: 'Sent a photo', time: '18m', online: true, color: '#8bb4ce', initials: 'JL' },
  { name: 'Design Team', preview: 'Aisha: I added the notes', time: '1h', online: false, color: '#baabd4', initials: 'DT' },
  { name: 'Noah Williams', preview: 'See you then!', time: '3h', online: false, color: '#d3b589', initials: 'NW' },
  { name: 'Aisha Khan', preview: 'You: Thanks for the update', time: '1d', online: true, color: '#91b49b', initials: 'AK' },
];

const initialMessages = [
  { mine: false, text: 'Hey! Are we still on for the walkthrough today?', time: '10:32 AM' },
  { mine: true, text: 'Absolutely — I just finished the latest changes.', time: '10:33 AM' },
  { mine: true, text: 'Want me to share my screen and give you a quick tour?', time: '10:33 AM' },
  { mine: false, text: 'That would be perfect. Let’s do a call!', time: '10:35 AM' },
];

export default function Home() {
  const [active, setActive] = useState(0);
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState('');
  const [inCall, setInCall] = useState(false);
  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const localVideo = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!inCall) return;
    navigator.mediaDevices?.getUserMedia({ video: true, audio: true }).then((stream) => {
      if (localVideo.current) localVideo.current.srcObject = stream;
    }).catch(() => {});
  }, [inCall]);

  function sendMessage() {
    const text = draft.trim();
    if (!text) return;
    setMessages([...messages, { mine: true, text, time: 'Now' }]);
    setDraft('');
  }

  return (
    <main className="app-shell">
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="brand-row">
          <div className="brand-mark"><span /></div><strong>Divo</strong>
          <button className="icon-button close-mobile" onClick={() => setSidebarOpen(false)}>×</button>
        </div>
        <button className="compose"><span>＋</span><span>New message</span></button>
        <div className="section-title">Messages <span>{people.length}</span></div>
        <div className="conversation-list">
          {people.map((person, index) => (
            <button key={person.name} className={`conversation ${active === index ? 'active' : ''}`} onClick={() => { setActive(index); setSidebarOpen(false); }}>
              <div className="avatar" style={{ background: person.color }}>{person.initials}<i className={person.online ? 'online' : ''} /></div>
              <div className="conversation-copy"><div><b>{person.name}</b><time>{person.time}</time></div><p>{person.preview}</p></div>
            </button>
          ))}
        </div>
        <div className="profile"><div className="avatar you">YO<i className="online" /></div><div><b>You</b><p>Available</p></div><button className="icon-button">•••</button></div>
      </aside>

      <section className="chat">
        <header className="chat-header">
          <button className="icon-button menu-button" onClick={() => setSidebarOpen(true)}>☰</button>
          <div className="avatar" style={{ background: people[active].color }}>{people[active].initials}<i className={people[active].online ? 'online' : ''} /></div>
          <div className="chat-name"><b>{people[active].name}</b><span>{people[active].online ? 'Active now' : 'Last seen recently'}</span></div>
          <div className="header-actions">
            <button className="icon-button search-button">⌕</button>
            <button className="video-button" onClick={() => setInCall(true)}>🎥 <span>Video call</span></button>
          </div>
        </header>

        <div className="messages">
          <div className="date-divider"><span>Today</span></div>
          {messages.map((message, index) => (
            <div className={`message-row ${message.mine ? 'mine' : ''}`} key={index}>
              {!message.mine && <div className="mini-avatar" style={{ background: people[active].color }}>{people[active].initials}</div>}
              <div><div className="bubble">{message.text}</div><time>{message.time}</time></div>
            </div>
          ))}
        </div>

        <footer className="composer">
          <button className="icon-button attach">＋</button>
          <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage()} placeholder="Write a message…" />
          <button className="icon-button emoji">☺</button>
          <button className="send-button" onClick={sendMessage}>➤</button>
        </footer>
      </section>

      {inCall && (
        <div className="call-overlay"><div className="call-stage"><div className="remote-view">
          <div class="remote-avatar" style={{ background: people[active].color }}>{people[active].initials}</div>
          <b>{people[active].name}</b><span>Connected</span>
          <video ref={localVideo} autoPlay muted playsInline className={cameraOff ? 'camera-off' : ''} />
        </div><div className="call-controls">
          <button className={muted ? 'active' : ''} onClick={() => setMuted(!muted)}>{muted ? 'Unmute' : 'Mute'}</button>
          <button className={cameraOff ? 'active' : ''} onClick={() => setCameraOff(!cameraOff)}>{cameraOff ? 'Start camera' : 'Stop camera'}</button>
          <button className="hang-up" onClick={() => setInCall(false)}>End call</button>
        </div></div></div>
      )}
    </main>
  );
}
