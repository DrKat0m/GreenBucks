// src/components/koshi/KoshiHTMLButton.jsx
import { useEffect, useState } from "react";
import koshi from "../../assets/koshi.svg";

export default function KoshiHTMLButton({ onToggle, isOpen }) {
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    const onKey = (e) => {
      const isK = (e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey);
      if (isK) {
        e.preventDefault();
        onToggle();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onToggle]);

  const handleClick = () => {
    setIsClicked(true);
    onToggle();
    // Reset click effect after animation
    setTimeout(() => setIsClicked(false), 300);
  };

  return (
    <button
      onClick={handleClick}
      aria-label={isOpen ? "Close Koshi Chat" : "Open Koshi Chat"}
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        width: '70px',
        height: '70px',
        background: isClicked 
          ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' // Bright green when clicked
          : isOpen 
            ? 'linear-gradient(135deg, #059669 0%, #047857 100%)' // Darker green when open
            : 'linear-gradient(135deg, #047857 0%, #064e3b 100%)',
        color: 'white',
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        zIndex: 1001,
        transition: 'all 0.3s ease',
        border: 'none',
        outline: 'none',
        animation: isClicked 
          ? 'clickPulse 0.3s ease-out' 
          : isOpen 
            ? 'none' 
            : 'goldenRipple 2s ease-in-out infinite'
      }}
      onMouseEnter={(e) => {
        if (!isOpen) {
          e.target.style.transform = 'scale(1.05)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isOpen) {
          e.target.style.transform = 'scale(1)';
        }
      }}
    >
      <img 
        src={koshi} 
        alt="Koshi" 
        style={{ 
          width: '50px', 
          height: '50px',
          transition: 'transform 0.2s ease',
          transform: isClicked ? 'scale(0.95)' : 'scale(1)'
        }} 
      />
    </button>
  );
}
