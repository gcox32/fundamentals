import React from 'react';
import { FaTimes } from 'react-icons/fa';
import SidebarProps from './types';

export default function Sidebar({ isOpen, onClose, position, children }: SidebarProps) {
  return (
    <>
      <div 
        className={`sidebar-overlay ${isOpen ? 'active' : ''}`} 
        onClick={onClose}
      />
      <div className={`sidebar ${position} ${isOpen ? 'open' : ''}`}>
        <button className="close-button" onClick={onClose}>
          <FaTimes />
        </button>
        <div className="sidebar-content">
          {children}
        </div>
      </div>
    </>
  );
} 