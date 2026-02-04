import { useState, useRef } from "react";
import confetti from "canvas-confetti";
import "./App.css";

function App() {
  const [accepted, setAccepted] = useState(false);
  const [noBtnStyle, setNoBtnStyle] = useState<React.CSSProperties>({});
  const yesBtnRef = useRef<HTMLButtonElement>(null);
  const noBtnRef = useRef<HTMLButtonElement>(null);

  const handleNoHover = () => {
    const noBtn = noBtnRef.current;
    const noBtnRect = noBtn?.getBoundingClientRect();

    // Use actual button dimensions or fallback
    const buttonWidth = noBtnRect?.width || 100;
    const buttonHeight = noBtnRect?.height || 50;
    const padding = 10;

    // Calculate safe bounds
    const maxX = window.innerWidth - buttonWidth - padding;
    const maxY = window.innerHeight - buttonHeight - padding;

    // Get Yes button position to avoid overlapping
    const yesBtn = yesBtnRef.current;
    const yesBtnRect = yesBtn?.getBoundingClientRect();

    let x: number, y: number;
    let attempts = 0;
    const maxAttempts = 50;

    do {
      // Generate random position within safe bounds
      x = padding + Math.random() * (maxX - padding);
      y = padding + Math.random() * (maxY - padding);
      attempts++;

      // Check if position overlaps with Yes button (with extra margin)
      if (yesBtnRect) {
        const margin = 80;
        const overlapsYes =
          x < yesBtnRect.right + margin &&
          x + buttonWidth > yesBtnRect.left - margin &&
          y < yesBtnRect.bottom + margin &&
          y + buttonHeight > yesBtnRect.top - margin;

        if (!overlapsYes) break;
      } else {
        break;
      }
    } while (attempts < maxAttempts);

    // Ensure final position is clamped within viewport
    x = Math.max(padding, Math.min(x, maxX));
    y = Math.max(padding, Math.min(y, maxY));

    setNoBtnStyle({
      position: "fixed",
      left: `${x}px`,
      top: `${y}px`,
      zIndex: 1000,
      transition: "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    });
  };

  const triggerConfetti = () => {
    const duration = 5000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors: ["#ff3366", "#ff6b9d", "#ff85a2", "#ffc0cb", "#ffffff"],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors: ["#ff3366", "#ff6b9d", "#ff85a2", "#ffc0cb", "#ffffff"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    // Initial burst
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#ff3366", "#ff6b9d", "#ff85a2", "#ffc0cb", "#ffffff"],
    });

    frame();
  };

  const handleYesClick = () => {
    setAccepted(true);
    triggerConfetti();
  };

  return (
    <div className="container">
      {!accepted ? (
        <>
          <div className="gif-container">
            <img
              src="https://media1.tenor.com/m/pYcNXV2FL8wAAAAd/bearish-bearish-af.gif"
              alt="Cute bear asking"
            />
          </div>
          <h1>Vrunda, will you be my Valentine?</h1>
          <p>You are the best thing that ever happened to me!</p>

          <div className="buttons">
            <button
              ref={yesBtnRef}
              className="yes-btn"
              onClick={handleYesClick}
            >
              Yes
            </button>
            <button
              ref={noBtnRef}
              className="no-btn"
              style={noBtnStyle}
              onMouseEnter={handleNoHover}
              onTouchStart={handleNoHover}
              onClick={handleNoHover}
            >
              No
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="gif-container">
            <img
              src="https://media.tenor.com/gUiu1zyxfzYAAAAi/bear-kiss-bear-kisses.gif"
              alt="Cute bear kissing"
              style={{ width: "250px" }}
            />
          </div>
          <div className="success-message">YAY! I Love You! ❤️</div>
        </>
      )}
    </div>
  );
}

export default App;
