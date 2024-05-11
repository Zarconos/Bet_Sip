import { useState } from 'react';
import GameLogic from './components/GameLogic';
import FinishButton from './components/FinishButton';
import ScorePage from './components/ScorePage';
import './style.css';

function App() {
  const [isGameFinished, setIsGameFinished] = useState(false);

  const finishGame = () => {
    setIsGameFinished(true);
  };

  const handleReplay = () => {
    setIsGameFinished(false);
  };

  const BoardGame = () => {
    return (
      <div className="board-game">
        <GameLogic onFinishGame={finishGame} />
        <div className="centered"></div>
      </div>
    );
  };

  return (
    <div className="app">
      {!isGameFinished && (
        <>
          <BoardGame />
          <FinishButton onFinishGame={finishGame} />
        </>
      )}

      {isGameFinished && (
        <ScorePage onReplay={handleReplay} />
      )}
    </div>
  );
}

export default App;
