import React from 'react';
import './PlayingBar.scss';

const PlayingBar: React.FC = () => {
  return (
    <div className="playing-bar">
      <div className="playing-bar__content">
        <div className="playing-bar__track">
          <div className="track-info">
            <div className="track-placeholder">🎵 No track playing</div>
          </div>
        </div>
        
        <div className="playing-bar__controls">
          <div className="controls-placeholder">
            ⏮️ ⏯️ ⏭️
          </div>
        </div>
        
        <div className="playing-bar__volume">
          <div className="volume-placeholder">🔊 Volume</div>
        </div>
      </div>
    </div>
  );
};

export default PlayingBar;