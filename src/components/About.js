import React from 'react';
import { useNavigate } from 'react-router-dom';

function About() {
  const navigate = useNavigate();
  return (
    <div className="fade-in">
      <div className="page-header"><h1>ℹ️ About This Game</h1></div>
      <div className="content-container">
        <div className="card"><h3>SUPERHERO DISPATCHER</h3><p style={{marginTop:'15px',lineHeight:'1.8'}}>Welcome to the ultimate superhero dispatching challenge! Two teams compete to successfully dispatch heroes to dangerous missions.</p></div>
        <div className="card"><h3>HOW IT WORKS</h3><ol style={{marginTop:'15px',lineHeight:'2',paddingLeft:'25px'}}><li>A mission is presented with stat requirements</li><li>Both teams select heroes</li><li>Stats are combined using maximum values</li><li>Physics simulation determines success</li></ol></div>
        <div className="card"><h3>FEATURES</h3><ul style={{marginTop:'15px',lineHeight:'2',paddingLeft:'25px'}}><li>8 Unique Heroes</li><li>20 Diverse Missions</li><li>Competitive multiplayer</li><li>Statistics tracking</li><li>Analytics & Leaderboards</li></ul></div>
        <div className="card"><h3>HEROES</h3><div style={{marginTop:'15px',lineHeight:'1.8'}}><p>⚡ <strong>Captain Thunder</strong> - Balanced powerhouse</p><p>🗡️ <strong>Shadow Blade</strong> - Speed & agility specialist</p><p>🛡️ <strong>Iron Guardian</strong> - Tank</p><p>🔥 <strong>Phoenix Queen</strong> - Well-rounded</p><p>🌟 <strong>Quantum Kid</strong> - Intelligence & speed</p><p>🦣 <strong>Steel Mammoth</strong> - Pure strength</p><p>🧠 <strong>Mind Weaver</strong> - Genius strategist</p><p>💨 <strong>Velocity</strong> - Speed demon</p></div></div>
        <button className="secondary-button" onClick={() => navigate('/')}>Back</button>
      </div>
    </div>
  );
}

export default About;
