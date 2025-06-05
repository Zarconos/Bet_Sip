import { useState, useEffect } from 'react';
import { useMultiplayerState } from 'playroomkit';
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

  const [restartGame] = useMultiplayerState('restartGame', false);

  useEffect(() => {
    if (restartGame) {
      setIsGameFinished(false);
    }
  }, [restartGame]);

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
