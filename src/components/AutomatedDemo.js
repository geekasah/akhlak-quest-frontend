import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AutomatedDemo() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const runDemo = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/demo/run');
      setResult(response.data);
    } catch (err) {
      alert('Failed to run demo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in">
      <div className="page-header"><h1>🤖 Automated Demo</h1><p>AI vs AI</p></div>
      <div className="content-container">
        {!result && !loading && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <p style={{ fontSize: '1.2rem', marginBottom: '30px' }}>Watch two AI teams compete!</p>
            <button className="primary-button" onClick={runDemo}>Run Demo</button>
          </div>
        )}
        {loading && <div className="loading"><div className="spinner"></div><p>Running demo...</p></div>}
        {result && (
          <div>
            <div className="score-display">
              <h3>Final Score</h3>
              <p style={{ fontSize: '1.5rem', marginTop: '15px' }}>AI Team Alpha: {result.final_score.team1} - {result.final_score.team2} AI Team Beta</p>
              <p style={{ fontSize: '1.8rem', fontWeight: 'bold', marginTop: '20px', color: 'var(--primary-red)' }}>Winner: {result.winner}</p>
            </div>
            <div style={{ marginTop: '40px' }}>
              <h3>Round Details:</h3>
              {result.rounds.map((round, idx) => (
                <div key={idx} className="card">
                  <h4>Round {round.round}: {round.mission.name}</h4>
                  <p style={{ fontStyle: 'italic' }}>{round.mission.description}</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '10px' }}>
                    <div><strong>AI Team Alpha:</strong> <span style={{ color: round.team1_success ? 'var(--success)' : 'var(--failure)' }}>{round.team1_success ? '✅ SUCCESS' : '❌ FAILED'}</span></div>
                    <div><strong>AI Team Beta:</strong> <span style={{ color: round.team2_success ? 'var(--success)' : 'var(--failure)' }}>{round.team2_success ? '✅ SUCCESS' : '❌ FAILED'}</span></div>
                  </div>
                  <p style={{ marginTop: '10px', fontWeight: 'bold' }}>Score: {round.team1_score} - {round.team2_score}</p>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: '30px' }}>
              <button className="primary-button" onClick={() => setResult(null)}>Run Another Demo</button>
            </div>
          </div>
        )}
        <button className="secondary-button" onClick={() => navigate('/')}>Back</button>
      </div>
    </div>
  );
}

export default AutomatedDemo;
