import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function TeamLeaderboard() {
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const limit = 10;

  useEffect(() => {
    axios.get(`/api/teams/${limit}/leaderboard`).then(res => { setTeams(res.data); setLoading(false); }).catch(err => { console.error(err); setLoading(false); });
  }, []);

  if (loading) return <div className="loading"><div className="spinner"></div><p>Loading...</p></div>;

  return (
    <div className="fade-in">
      <div className="page-header"><h1>🏆 Team Leaderboard</h1></div>
      <div className="content-container">
        {teams.length > 0 ? (
          <table className="data-table">
            <thead><tr><th>Rank</th><th>Team</th><th>Games</th><th>Wins</th><th>Losses</th><th>Win Rate</th></tr></thead>
            <tbody>{teams.map((t, i) => (<tr key={t.id}><td>{i+1}</td><td>{t.name}</td><td>{t.total_games}</td><td>{t.wins}</td><td>{t.losses}</td><td>{t.win_rate?.toFixed(1)}%</td></tr>))}</tbody>
          </table>
        ) : <p style={{ textAlign: 'center', padding: '60px' }}>No teams yet!</p>}
        <button className="secondary-button" onClick={() => navigate('/')}>Back</button>
      </div>
    </div>
  );
}

export default TeamLeaderboard;
