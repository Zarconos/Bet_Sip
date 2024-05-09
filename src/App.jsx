
import './style.css';
import GameLogic from './components/GameLogic';

function App() {
  // Supprimer les déclarations de gameStarted et setGameStarted

  const BoardGame = () => {
    const finishGame = (score) => {
      console.log('Game finished with score:', score);
    };

    return (
      <div className="board-game">
        <GameLogic onFinishGame={finishGame} />
        <div className="centered"></div>
      </div>
    );
  };

  return (
    <div className="app">
      <BoardGame />
    </div>
  );
}

export default App;
