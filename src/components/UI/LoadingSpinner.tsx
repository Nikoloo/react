import React from 'react';
import './LoadingSpinner.scss';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'white';
  text?: string;
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = 'primary',
  text,
  fullScreen = false
}) => {
  const spinnerClass = `loading-spinner loading-spinner--${size} loading-spinner--${color}`;
  
  const spinner = (
    <div className={spinnerClass}>
      <div className="loading-spinner__circle">
        <div className="loading-spinner__path"></div>
      </div>
      {text && <p className="loading-spinner__text">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="loading-spinner__fullscreen">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;