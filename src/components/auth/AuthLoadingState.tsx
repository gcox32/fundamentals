import React from 'react';

export default function AuthLoadingState() {
  return (
    <div className="auth-layout">
      <div className="auth-banner">
        <div className="banner-content">
          <div className="loading-placeholder">
            <div className="loading-title"></div>
            <div className="loading-description"></div>
          </div>
        </div>
      </div>
      <div className="auth-content">
        <div className="loading-form"></div>
      </div>
    </div>
  );
} 