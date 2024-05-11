// Avatar.jsx
import { useState } from 'react';
import PropTypes from 'prop-types';
import defaultImg from "./default-avatar.png";
import { usePlayersList, useMultiplayerState } from "playroomkit";
import "./style.css";

const Avatar = ({ drinksCountByPlayer }) => {
  const players = usePlayersList(true);
  const [playerDrawing, ] = useMultiplayerState('playerDrawing');
  const [isGameFinished, setIsGameFinished] = useState(false);



  const sortedPlayers = Object.keys(drinksCountByPlayer).sort((a, b) => drinksCountByPlayer[b] - drinksCountByPlayer[a]);

  return (
    <div className="player-avatar-bar">
      {players.map((playerState) => {
        const isActivePlayer = playerState.id === playerDrawing;
        const guessed = playerState.getState("guessed");
        const avatarStyle = {
          backgroundColor: playerState.getState("profile")?.color,
          backgroundImage: `url(${playerState.getState("profile")?.photo || defaultImg})`,
          backgroundSize: "contain",
          borderColor: isActivePlayer ? "yellow" : guessed ? "green" : "transparent",
        };

        return (
          <div key={playerState.id} className="player-avatar-container">
            {isActivePlayer && <div className="drawing"></div>}
            {guessed && <div className="guessed"></div>}
            <div className="avatar-holder" style={avatarStyle}></div>
            <p className="player-name">{playerState.getState("profile")?.name}</p>
            <p className="drink-count">Drinks: {drinksCountByPlayer[playerState.id] || 0}</p>
          </div>
        );
      })}

      {isGameFinished && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Game Results</h2>
            <ul>
              {sortedPlayers.map(playerId => (
                <li key={playerId}>
                  {players.find(player => player.id === playerId)?.getState("profile")?.name}: {drinksCountByPlayer[playerId]} drinks
                </li>
              ))}
            </ul>
            <button onClick={() => setIsGameFinished(false)}>Replay</button>
          </div>
        </div>
      )}
    </div>
  );
};

Avatar.propTypes = {
  drinksCountByPlayer: PropTypes.object.isRequired,
};

export default Avatar;
