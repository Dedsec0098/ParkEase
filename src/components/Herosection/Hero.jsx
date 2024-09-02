import React, { useEffect, useRef } from 'react';
import './Hero.css';

function Hero() {
  const vantaEffect = useRef(null);

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
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.50,
          scaleMobile: 1.00,
          color: 0xed1717,
          size: 1.30,
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

  return (
    <div id="hero-container" className="hero-container">
      <h1 className="hero-title">ParkEase</h1>
      <p className="hero-subtitle">we provide the best spot!</p>
      <button className="hero-button">Get Started</button>
    </div>
  );
}

export default Hero;
