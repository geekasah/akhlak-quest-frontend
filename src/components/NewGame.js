import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function NewGame() {
  const navigate = useNavigate();
  const [heroes, setHeroes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [team1Name, setTeam1Name] = useState('Team Alpha');
  const [team2Name, setTeam2Name] = useState('Team Beta');
  const [rounds, setRounds] = useState(5);
  const [gameLoading, setGameLoading] = useState(false);
  const [error, setError] = useState('');

  // 🔹 Fetch heroes from backend on component mount
  useEffect(() => {
    const fetchHeroes = async () => {
      try {
        const response = await axios.get("/api/heroes");
        setHeroes(response.data);
      } catch (error) {
        console.error("Error fetching heroes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHeroes();
  }, []);

  // 🔹 Fisher-Yates shuffle
  const shuffleHeroes = (heroArray) => {
    const newHeroes = [...heroArray];

    for (let i = newHeroes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newHeroes[i], newHeroes[j]] = [newHeroes[j], newHeroes[i]];
    }

    return newHeroes;
  };

  const handleStartGame = async (e) => {
    e.preventDefault();

    if (!team1Name.trim() || !team2Name.trim()) {
      setError('Please enter both team names');
      return;
    }

    setGameLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/games/new', {
        team1_name: team1Name,
        team2_name: team2Name,
        rounds: rounds
      });

      const shuffledHeroes = shuffleHeroes(heroes);
      navigate(`/gameplay/${response.data.session_id}?data=${encodeURIComponent(JSON.stringify(shuffledHeroes))}`);
    } catch (err) {
      setError('Failed to create game. Please try again.');
      console.error(err);
    } finally {
      setGameLoading(false);
    }
  };

  return (
    <div className="new-game-page" style={{ backgroundImage: 'url(/assets/new-game/background.svg)' }}>

        <form onSubmit={handleStartGame} className="new-game-form">
          <div className="form-group">
            <input
              type="text"
              id="team1"
              value={team1Name}
              onChange={(e) => setTeam1Name(e.target.value)}
              placeholder="Enter Team 1 name"
              required
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              id="team2"
              value={team2Name}
              onChange={(e) => setTeam2Name(e.target.value)}
              placeholder="Enter Team 2 name"
              required
            />
          </div>

          <div className="form-group">
            <input
              type="number"
              id="rounds"
              value={rounds}
              onChange={(e) => setRounds(e.target.value)}
              placeholder="Enter number of rounds"
              required
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="new-game-buttons">
            <button 
              type="submit" 
              className="svg-button start-game-button"
              disabled={gameLoading}
              style={{ backgroundImage: 'url(/assets/new-game/start-game.svg)' }}
              title={gameLoading ? 'Creating Game...' : 'Start Game'}
            >
              {gameLoading && <span className="loading-text">Creating...</span>}
            </button>
            <button 
              type="button"
              className="svg-button start-game-button"
              onClick={() => navigate('/')}
              style={{ backgroundImage: 'url(/assets/new-game/back.svg)' }}
              title="Back to Menu"
            />
          </div>
        </form>
    </div>
  );
}

export default NewGame;
