import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function GameHistory() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const limit = 10;

  useEffect(() => {
    axios.get(`/api/games/${limit}/history`).then(res => { setSessions(res.data); setLoading(false); }).catch(err => { console.error(err); setLoading(false); });
  }, []);

  if (loading) return <div className="loading"><div className="spinner"></div><p>Loading...</p></div>;

  return (
    <div className="game-history-page">
      <h1 style={{
        fontFamily: "'Pixelify Sans', monospace",
        fontSize: '6rem',
        color: '#A1BBCA',
        textShadow: '-3px -3px 0 #292734, 3px -3px 0 #292734, -3px 3px 0 #292734, 3px 3px 0 #292734',
        margin: '-40px 0 40px 0',
        textAlign: 'center'
      }}>Game History</h1>
      <div className="game-history-content">
        {sessions.length > 0 ? sessions.map(s => (
          <div key={s.id} className="game-history-board">
            <div className="game-history-card">
              <div className="game-info-left">
                <h3 className="game-title">Game #{s.id}</h3>
                <p className="teams-text">{s.team1_name} vs {s.team2_name}</p>
              </div>
              <div className="game-info-right">
                <p className="score-text">{s.team1_score} - {s.team2_score}</p>
                <p className="date-text">{new Date(s.ended_at).toLocaleString()}</p>
              </div>
            </div>
          </div>
        )) : <p className="no-games-text">No games yet!</p>}
        <button className="game-history-back-button" onClick={() => navigate('/')}></button>
      </div>
    </div>
  );
}

export default GameHistory;
