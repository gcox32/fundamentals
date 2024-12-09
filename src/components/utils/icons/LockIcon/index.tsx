import "./styles.css";

export default function LockIcon({ className, isLocked = true }: { className?: string; isLocked?: boolean }) {
    return (
      <svg 
        className={`lock-icon ${className || ''} ${isLocked ? 'locked' : 'unlocked'}`}
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2"
      >
        <rect className="lock-body" x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path 
          className="lock-shackle"
          d="M7 11V7a5 5 0 0 1 10 0v4"
        ></path>
      </svg>
    );
  }