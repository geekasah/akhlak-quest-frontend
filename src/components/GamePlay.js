import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import BallSimulation from './BallSimulation';

function GamePlay() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  
  const [gameState, setGameState] = useState(null);
  const [mission, setMission] = useState(null);
  const [heroes, setHeroes] = useState({ team1: [], team2: [] });
  const [team1Selection, setTeam1Selection] = useState([]);
  const [team2Selection, setTeam2Selection] = useState([]);
  const [loading, setLoading] = useState(true);
  const [executing, setExecuting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadGameData();
  }, [sessionId]);

  const loadGameData = async () => {
    try {
      // Load game state first
      const gameRes = await axios.get(`/api/games/active/game`);
      const currentGame = gameRes.data.find(g => g.session_id === sessionId);
      
      if (!currentGame) {
        setError('Game session not found');
        setLoading(false);
        return;
      }
      
      // Load team-specific heroes and mission
      const [team1HeroesRes, team2HeroesRes, missionRes] = await Promise.all([
        axios.get(`/api/games/${sessionId}/heroes/1`),
        axios.get(`/api/games/${sessionId}/heroes/2`),
        axios.get(`/api/games/${sessionId}/mission`)
      ]);
      
      setHeroes({
        team1: team1HeroesRes.data,
        team2: team2HeroesRes.data
      });
      setMission(missionRes.data);
      setGameState({
        sessionId: parseInt(sessionId),
        team1Name: currentGame.team1_name,
        team2Name: currentGame.team2_name,
        team1Score: currentGame.team1_score,
        team2Score: currentGame.team2_score,
        currentRound: currentGame.current_round + 1,
        totalRounds: currentGame.total_rounds
      });
      setLoading(false);
    } catch (err) {
      setError('Failed to load game data');
      console.error(err);
      setLoading(false);
    }
  };

  const handleHeroToggle = (heroId, team) => {
    const selection = team === 1 ? team1Selection : team2Selection;
    const setSelection = team === 1 ? setTeam1Selection : setTeam2Selection;
    
    if (selection.includes(heroId)) {
      setSelection(selection.filter(id => id !== heroId));
    } else {
      if (selection.length < mission.slots) {
        setSelection([...selection, heroId]);
      } else {
        alert(`You can only select ${mission.slots} heroes!`);
      }
    }
  };

  const executeMission = async () => {
    if (team1Selection.length !== mission.slots || team2Selection.length !== mission.slots) {
      alert(`Both teams must select ${mission.slots} heroes!`);
      return;
    }

    setExecuting(true);
    try {
      const response = await axios.post(`/api/games/${sessionId}/round`, {
        team1_heroes: team1Selection,
        team2_heroes: team2Selection
      }, {
        params: { mission_id: mission.id }
      });

      setResult(response.data);
      setGameState(prev => ({
        ...prev,
        team1Score: response.data.team1_score,
        team2Score: response.data.team2_score,
        currentRound: response.data.round
      }));
    } catch (err) {
      setError('Failed to execute mission');
      console.error(err);
    } finally {
      setExecuting(false);
    }
  };

  const nextRound = async () => {
    setResult(null);
    setTeam1Selection([]);
    setTeam2Selection([]);
    
    try {
      const missionRes = await axios.get(`/api/games/${sessionId}/mission`);
      setMission(missionRes.data);
      setGameState(prev => ({ ...prev, currentRound: prev.currentRound + 1 }));
    } catch (err) {
      setError('Failed to load next mission');
    }
  };

  const endGame = async () => {
    try {
      await axios.post(`/api/games/${sessionId}/end`);
    } catch (err) {
      console.error(err);
    }
    navigate('/');
  };

  if (loading) return <div className="loading"><div className="spinner"></div><p>Loading...</p></div>;
  if (error && !gameState) return <div className="content-container"><div className="card"><h3 style={{ color: 'var(--failure)' }}>Error</h3><p>{error}</p><button className="secondary-button" onClick={() => navigate('/')}>Back</button></div></div>;

  if (result) {
    const gameComplete = gameState.currentRound >= gameState.totalRounds;
    console.log('Mission result:', result);
    
    return (
      <div className="fade-in" style={{ backgroundImage: 'url(/assets/simul/background-result.svg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
        <div style={{ 
          fontFamily: "'Pixelify Sans', monospace",
          padding: '40px 20px',
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1 style={{ 
              fontFamily: "'Pixelify Sans', monospace",
              fontSize: '5rem', 
              color: '#A1BBCA',
              textShadow: '-3px -3px 0 #292734, 3px -3px 0 #292734, -3px 3px 0 #292734, 3px 3px 0 #292734',
              margin: '0 0 15px 0',
              fontWeight: 'bold',
              padding: '0',
              marginBottom: '0px'
            }}>
              Mission Results
            </h1>
            <p style={{ 
              fontFamily: "'Pixelify Sans', monospace",
              fontSize: '3rem',
              color: '#292734',
              marginTop: '-20px',
              fontWeight: 'bold'
            }}>
              Round {result.round}/{gameState.totalRounds}
            </p>
          </div>

          {/* Simulations Container */}
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '30px',
            marginBottom: '40px',
            maxHeight: '600px',
            overflowY: 'auto'
          }}>
            {result.team1_trajectory && result.polygon1 && (
              <div style={{ 
                backgroundImage: 'url(/assets/simul/team-board.svg)',
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                padding: '40px 20px',
                minHeight: '580px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <BallSimulation
                  trajectory={result.team1_trajectory}
                  polygons={result.polygon1}
                  teamName={gameState.team1Name}
                  success={result.team1_success}
                />
              </div>
            )}
            {result.team2_trajectory && result.polygon2 && (
              <div style={{ 
                backgroundImage: 'url(/assets/simul/team-board.svg)',
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                padding: '40px 20px',
                minHeight: '580px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <BallSimulation
                  trajectory={result.team2_trajectory}
                  polygons={result.polygon2}
                  teamName={gameState.team2Name}
                  success={result.team2_success}
                />
              </div>
            )}
          </div>

          {/* Score Display */}
          <div style={{
            backgroundImage: 'url(/assets/simul/result-board.svg)',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            padding: '80px 40px',
            textAlign: 'center',
            marginBottom: '40px',
            minHeight: '300px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <h2 style={{
              fontFamily: "'Pixelify Sans', monospace",
              fontSize: '3rem',
              color: '#292734',
              margin: 0,
              fontWeight: 'bold'
            }}>
              {gameState.team1Name}: {result.team1_score} - {result.team2_score} {gameState.team2Name}
            </h2>
          </div>

          {/* Action Buttons */}
          <div style={{ textAlign: 'center' }}>
            {!gameComplete ? (
              <button 
                onClick={nextRound}
                style={{
                  border: 'none',
                  background: 'none',
                  backgroundImage: 'url(/assets/simul/next-round-button.svg)',
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                  width: '300px',
                  height: '100px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              />
            ) : (
              <>
                <div style={{
                  textAlign: 'center',
                  marginBottom: '40px'
                }}>
                  <h2 style={{
                    fontFamily: "'Pixelify Sans', monospace",
                    fontSize: '3rem',
                    color: '#A1BBCA',
                    textShadow: '-3px -3px 0 #292734, 3px -3px 0 #292734, -3px 3px 0 #292734, 3px 3px 0 #292734',
                    marginBottom: '20px',
                    fontWeight: 'bold'
                  }}>
                    WINNER
                  </h2>
                  <h1 style={{
                    fontFamily: "'Pixelify Sans', monospace",
                    fontSize: '4rem',
                    color: '#FFD700',
                    textShadow: '-4px -4px 0 #292734, 4px -4px 0 #292734, -4px 4px 0 #292734, 4px 4px 0 #292734',
                    margin: 0,
                    fontWeight: 'bold'
                  }}>
                    {result.team1_score > result.team2_score ? gameState.team1Name : result.team2_score > result.team1_score ? gameState.team2Name : "It's a Tie!"}
                  </h1>
                </div>
                <button 
                  onClick={endGame}
                  style={{
                    border: 'none',
                    background: 'none',
                    backgroundImage: 'url(/assets/simul/finish-game-button.svg)',
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    width: '300px',
                    height: '100px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))'
                  }}
                  onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                />
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="gameplay-container" style={{ backgroundImage: 'url(/assets/round/background.svg)' }}>
      <div className="gameplay-content">
        <div className="round-header">
          <h1 className="round-title">ROUND {gameState.currentRound}/{gameState.totalRounds}</h1>
          <p className="score-text">{gameState.team1Name} {gameState.team1Score} - {gameState.team2Score} {gameState.team2Name}</p>
        </div>

        {mission && (
          <div className="mission-board" style={{ backgroundImage: 'url(/assets/round/mission-board.svg)' }}>
            <div className="mission-content">
              <h2 className="mission-name">{mission.name}</h2>
              <p className="mission-slots">Hero Slots: {mission.slots}</p>
              <p className="mission-description">{mission.description}</p>
              
            </div>
          </div>
        )}

        <div className="gameplay-team-panels">
          <div className="gameplay-team-panel" style={{ backgroundImage: 'url(/assets/round/team-board.svg)' }}>
            <div className="gameplay-team-name">{gameState.team1Name}</div>
            <div className="gameplay-hero-list">
              {heroes.team1.map(hero => (
                <div key={hero.id} className="gameplay-hero-item" style={{ backgroundImage: 'url(/assets/round/hero-div.svg)' }}>
                  <input type="checkbox" checked={team1Selection.includes(hero.id)} onChange={() => handleHeroToggle(hero.id, 1)} />
                  <div className="gameplay-hero-info">
                    <div className="gameplay-hero-name">{hero.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="gameplay-team-panel" style={{ backgroundImage: 'url(/assets/round/team-board.svg)' }}>
            <div className="gameplay-team-name">{gameState.team2Name}</div>
            <div className="gameplay-hero-list">
              {heroes.team2.map(hero => (
                <div key={hero.id} className="gameplay-hero-item" style={{ backgroundImage: 'url(/assets/round/hero-div.svg)' }}>
                  <input type="checkbox" checked={team2Selection.includes(hero.id)} onChange={() => handleHeroToggle(hero.id, 2)} />
                  <div className="gameplay-hero-info">
                    <div className="gameplay-hero-name">{hero.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="execute-mission-container">
          <button 
            className="execute-mission-button" 
            onClick={executeMission} 
            
            style={{ 
              backgroundImage: `url(/assets/round/${
                (executing || team1Selection.length !== mission.slots || team2Selection.length !== mission.slots) 
                  ? 'execute_mission_not_clicked.svg' 
                  : 'execute-mission.svg'
              })`
            }}
            title={executing ? 'Executing...' : 'Execute Mission'}
          />
        </div>

        {error && <div className="gameplay-error">{error}</div>}
      </div>
    </div>
  );
}

export default GamePlay;
