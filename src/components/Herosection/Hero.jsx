import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import './Hero.css';

function Hero() {
  const vantaEffect = useRef(null);
  const navigate = useNavigate(); // Initialize the navigate function

  useEffect(() => {
    // Load external scripts if they are not already included
    const loadScripts = () => {
      return new Promise((resolve) => {
        if (window.VANTA) {
          resolve();
        } else {
          const threeScript = document.createElement('script');
          threeScript.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r121/three.min.js";
          threeScript.onload = () => {
            const vantaScript = document.createElement('script');
            vantaScript.src = "https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.globe.min.js";
            vantaScript.onload = () => resolve();
            document.body.appendChild(vantaScript);
          };
          document.body.appendChild(threeScript);
        }
      });
    };

    // Initialize Vanta.js after scripts are loaded
    const initializeVanta = () => {
      if (window.VANTA) {
        vantaEffect.current = window.VANTA.GLOBE({
          el: "#hero-container",
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.5,
          scaleMobile: 1.0,
          color: 0xed1717,
          size: 1.3,
          backgroundColor: 0xf0f10
        });
      }
    };

    loadScripts().then(() => {
      initializeVanta();
    });

    // Cleanup on component unmount
    return () => {
      if (vantaEffect.current) {
        vantaEffect.current = null;
      }
    };
  }, []);

  // Function to handle button click and navigate to SigninPage
  const handleGetStartedClick = () => {
    navigate('/signin');
  };

  return (
    <div id="hero-container" className="hero-container">
      <h1 className="hero-title">ParkEase</h1>
      <p className="hero-subtitle">we provide the best spot!</p>
      <button className="hero-button" onClick={handleGetStartedClick}>Get Started</button> {/* Add onClick here */}
    </div>
  );
}

export default Hero;
