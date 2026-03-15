import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const HERO_EMOJIS = {'Captain Thunder': '⚡', 'Shadow Blade': '🗡️', 'Iron Guardian': '🛡️', 'Phoenix Queen': '🔥', 'Quantum Kid': '🌟', 'Steel Mammoth': '🦣', 'Mind Weaver': '🧠', 'Velocity': '💨'};

function AnalyticsDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('heroes');
  const [heroLeaderboard, setHeroLeaderboard] = useState([]);
  const [missionStats, setMissionStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const limit = 10;

  useEffect(() => {
    Promise.all([axios.get(`/api/heroes/${limit}/leaderboard`), axios.get('/api/analytics/missions')])
      .then(([h, m]) => {
        setHeroLeaderboard(h.data);
        setMissionStats(m.data.filter(x => x.attempts > 0).slice(0, 10));
        setLoading(false);
      })
      .catch(err => { console.error(err); setLoading(false); });
  }, []);

  if (loading) return <div className="loading"><div className="spinner"></div><p>Loading...</p></div>;

  return (
    <div className="fade-in">
      <div className="page-header"><h1>📊 Analytics Dashboard</h1></div>
      <div className="content-container">
        <div className="tabs">
          <button className={`tab ${activeTab === 'heroes' ? 'active' : ''}`} onClick={() => setActiveTab('heroes')}>Hero Performance</button>
          <button className={`tab ${activeTab === 'missions' ? 'active' : ''}`} onClick={() => setActiveTab('missions')}>Mission Statistics</button>
        </div>
        {activeTab === 'heroes' && (
          <div className="tab-content">
            <table className="data-table">
              <thead><tr><th>Rank</th><th>Hero</th><th>Missions</th><th>Success</th><th>Failed</th><th>Success Rate</th></tr></thead>
              <tbody>{heroLeaderboard.map((h, i) => (<tr key={h.id}><td>{i+1}</td><td>{HERO_EMOJIS[h.name]||'🦸'} {h.name}</td><td>{h.total_missions}</td><td>{h.successful_missions}</td><td>{h.failed_missions}</td><td>{h.success_rate?.toFixed(1)}%</td></tr>))}</tbody>
            </table>
          </div>
        )}
        {activeTab === 'missions' && (
          <div className="tab-content">
            {missionStats.length > 0 ? (
              <table className="data-table">
                <thead><tr><th>Mission</th><th>Slots</th><th>Attempts</th><th>Success Rate</th></tr></thead>
                <tbody>{missionStats.map(m => (<tr key={m.id}><td>{m.name}</td><td>{m.slots}</td><td>{m.attempts}</td><td>{m.success_rate?.toFixed(1)}%</td></tr>))}</tbody>
              </table>
            ) : <p style={{ textAlign: 'center', padding: '40px' }}>No data yet!</p>}
          </div>
        )}
        <button className="secondary-button" onClick={() => navigate('/')}>Back</button>
      </div>
    </div>
  );
}

export default AnalyticsDashboard;
