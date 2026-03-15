import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import NewGame from './components/NewGame';
import GamePlay from './components/GamePlay';
import AutomatedDemo from './components/AutomatedDemo';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import TeamLeaderboard from './components/TeamLeaderboard';
import GameHistory from './components/GameHistory';
import HeroesMissions from './components/HeroesMissions';
import About from './components/About';

function MainMenu() {
  const navigate = useNavigate();
  const [clickedButton, setClickedButton] = useState(null);

  const buttons = [
    
    { id: 'heroes', image: '../assets/main-menu/heroes_and_mission_button.svg', clickedImage: '../assets/main-menu/heroes_and_mission_clicked.svg', path: '/heroes-missions', position: 'bottom-left' },
    { id: 'play', image: '../assets/main-menu/play_button.svg', clickedImage: '../assets/main-menu/play_button_clicked.svg', path: '/new-game', position: 'bottom-center' },
    { id: 'history', image: '../assets/main-menu/game_history_button.svg', clickedImage: '../assets/main-menu/game_history_button_clicked.svg', path: '/history', position: 'bottom-right' }
  ];

  const handleButtonClick = (button) => {
    setClickedButton(button.id);
    setTimeout(() => {
      navigate(button.path);
      setClickedButton(null);
    }, 100);
  };

  return (
    <div className="main-menu" style={{ backgroundImage: `url(../assets/main-menu/menu-background.svg)` }}>
      <div className="menu-buttons-container">
        {buttons.map((button) => (
          <button
            key={button.id}
            className={`image-button ${button.position} ${clickedButton === button.id ? 'clicked' : ''}`}
            onClick={() => handleButtonClick(button)}
          > 
            <img
              src={clickedButton === button.id ? button.clickedImage : button.image}
              alt={button.id}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

function App() {
  return (
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<MainMenu />} />
            <Route path="/new-game" element={<NewGame />} />
            <Route path="/gameplay/:sessionId" element={<GamePlay />} />
            <Route path="/demo" element={<AutomatedDemo />} />
            <Route path="/analytics" element={<AnalyticsDashboard />} />
            <Route path="/leaderboard" element={<TeamLeaderboard />} />
            <Route path="/history" element={<GameHistory />} />
            <Route path="/heroes-missions" element={<HeroesMissions />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
      </Router>
  );
}

export default App;
