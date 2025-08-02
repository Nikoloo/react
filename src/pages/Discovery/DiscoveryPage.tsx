import React from 'react';
import './DiscoveryPage.scss';

const DiscoveryPage: React.FC = () => {
  return (
    <div className="discovery-page">
      <div className="discovery-page__header">
        <h1>Good evening</h1>
        <p>Discover new music and revisit your favorites</p>
      </div>
      
      <div className="discovery-page__content">
        <section className="quick-picks">
          <h2>Quick picks</h2>
          <div className="quick-picks__grid">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="quick-pick-card">
                <div className="quick-pick-card__image">🎵</div>
                <span className="quick-pick-card__title">Liked Songs</span>
              </div>
            ))}
          </div>
        </section>
        
        <section className="recently-played">
          <h2>Recently played</h2>
          <div className="content-grid">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="content-card">
                <div className="content-card__image">📀</div>
                <h3 className="content-card__title">Album {i + 1}</h3>
                <p className="content-card__subtitle">Artist Name</p>
              </div>
            ))}
          </div>
        </section>
        
        <section className="made-for-you">
          <h2>Made for you</h2>
          <div className="content-grid">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="content-card">
                <div className="content-card__image">🎧</div>
                <h3 className="content-card__title">Daily Mix {i + 1}</h3>
                <p className="content-card__subtitle">Based on your listening</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default DiscoveryPage;