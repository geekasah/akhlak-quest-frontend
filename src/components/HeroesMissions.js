import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function HeroesMissions() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('heroes');
  const [heroes, setHeroes] = useState([]);
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([axios.get('/api/heroes'), axios.get('/api/missions')])
      .then(([h, m]) => {
        setHeroes(h.data);
        setMissions(m.data);
        setLoading(false);
      })
      .catch(e => {
        console.error(e);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="heroes-missions-page">
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  const displayItems = activeTab === 'heroes' ? heroes : missions;

  return (
    <div className="heroes-missions-page fade-in">
      <h1 className="heroes-missions-title">Heroes & Missions</h1>

      <div className="heroes-missions-controls">
        <button
          className="tab-button-heroes"
          style={{
            backgroundImage: `url('/assets/heroes-and-mission/${activeTab === 'heroes' ? 'heroes-button-heroes-page.svg' : 'heroes-button-mission-page.svg'}')`
          }}
          onClick={() => setActiveTab('heroes')}
        />
        <button
          className="tab-button-mission"
          style={{
            backgroundImage: `url('/assets/heroes-and-mission/${activeTab === 'missions' ? 'mission-button-mission-page.svg' : 'mission-button-heroes-page.svg'}')`,
          }}
          onClick={() => setActiveTab('missions')}
        />
      </div>

      <div className="heroes-missions-content">
        {displayItems.map(item => (
          <div key={item.id} className={`heroes-mission-card ${activeTab === 'heroes' ? 'hero-card' : 'mission-card'}`}>
            <div className={`card-content ${activeTab === 'heroes' ? 'hero-content' : 'mission-content'}`}>
              <h3 className="card-name">{item.name}</h3>
              {item.description && (
                <p className="card-description">{item.description}</p>
              )}
              {activeTab === 'heroes' ? (
                <div className="card-stats">
                  <div className="stat-line">STR: {item.strength} SPD: {item.speed} AGL: {item.agility} END: {item.endurance} BRN: {item.brain}</div>
                </div>
              ) : (
                <div className="card-stats">
                  <div className="stat-line">Slots: {item.slots}</div>
                  <div className="stat-line">STR: {item.strength} SPD: {item.speed} AGL: {item.agility} END: {item.endurance} BRN: {item.brain}</div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <button
        className="back-button-heroes-missions"
        onClick={() => navigate('/')}
      />
    </div>
  );
}

export default HeroesMissions;
