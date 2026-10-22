/**
 * Reusable Accessible Modal Component
 * Assignment 16: KBTCOE Connect Final Full-Stack Web Development Project
 * Department of Computer Engineering, MVP's KBTCOE Nashik
 */

import React, { useEffect } from 'react';

export default function Modal({ isOpen, title, onClose, children }) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close dialog">
          ✕
        </button>
        {title && <h2 id="modal-title" style={{ marginBottom: '1.25rem' }}>{title}</h2>}
        <div>{children}</div>
      </div>
    </div>
  );
}
