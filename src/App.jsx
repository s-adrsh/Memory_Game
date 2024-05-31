import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import Confetti from "react-confetti";

const gridIcons = [
  "🥰",
  "🤣",
  "💀",
  "✅",
  "❌",
  "😡",
  "💯",
  "🍷",
  "🌍",
  "🌊",
  "👋",
  "👧",
];
function App() {
  const [pieces, setPieces] = useState([]);
  const timeout = useRef();

  const isGameCompleted = useMemo(() => {
    if (pieces.length > 0 && pieces.every((piece) => piece.isSolved)) {
      return true;
    }
    return false;
  }, [pieces]);

  const stateGame = () => {
    const duplicateGridIcons = gridIcons.concat(gridIcons);
    const newGameIcons = [];

    while (newGameIcons.length < gridIcons.length * 2) {
      const randomIndex = Math.floor(Math.random() * duplicateGridIcons.length);
      newGameIcons.push({
        emoji: duplicateGridIcons[randomIndex],
        isFlipped: false,
        isSolved: false,
        position: newGameIcons.length,
      });
      duplicateGridIcons.splice(randomIndex, 1);
    }

    setPieces(newGameIcons);
  };

  useEffect(() => {
    stateGame();
  }, []);

  const handleActive = (data) => {
    const flippedData = pieces.filter(
      (piece) => piece.isFlipped && !piece.isSolved
    );
    if (flippedData.length === 2) return;
    const newData = pieces.map((piece) => {
      if (piece.position === data.position) {
        piece.isFlipped = !piece.isFlipped;
      }
      return piece;
    });
    setPieces(newData);
  };

  const logicForFlipped = () => {
    const flipped = pieces.filter((data) => data.isFlipped && !data.isSolved);
    if (flipped.length === 2) {
      timeout.current = setTimeout(() => {
        setPieces(
          pieces.map((data) => {
            if (flipped[0].emoji === flipped[1].emoji) {
              if (
                data.position === flipped[0].position ||
                data.position === flipped[1].position
              ) {
                data.isSolved = true;
              }
              return data;
            } else {
              if (
                data.position === flipped[0].position ||
                data.position === flipped[1].position
              ) {
                data.isFlipped = false;
              }
              return data;
            }
          })
        );
      }, 800);
    }
  };

  useEffect(() => {
    logicForFlipped();
    return () => clearTimeout(timeout.current);
  }, [pieces]);

  return (
    <main>
      <h1> Memory Game </h1>
      <div className="container">
        {pieces.map((data, key) => (
          <div
            className={`flip-card ${
              data.isFlipped || data.isSolved ? "active" : ""
            }`}
            key={key}
            onClick={() => handleActive(data)}
          >
            <div className="flip-card-inner">
              <div className="flip-card-front"></div>
              <div className="flip-card-back">{data.emoji}</div>
            </div>
          </div>
        ))}
      </div>
      {isGameCompleted && (
        <div className="game-completed">
          <h1> You Won ...!!</h1>
          <Confetti width={window.innerWidth} height={window.innerHeight} />
        </div>
      )}
    </main>
  );
}

export default App;
