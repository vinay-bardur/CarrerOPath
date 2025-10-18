import React from 'react';

export default function Debug({ user, previousResults, currentPage }) {
  if (process.env.NODE_ENV !== 'development') return null;
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '10px',
      fontSize: '12px',
      zIndex: 9999,
      maxWidth: '300px'
    }}>
      <h4>Debug Info:</h4>
      <p>Current Page: {currentPage}</p>
      <p>User ID: {user?.id || 'Not logged in'}</p>
      <p>Previous Results: {previousResults ? 'Found' : 'None'}</p>
      {previousResults && (
        <p>Result ID: {previousResults.id}</p>
      )}
    </div>
  );
}