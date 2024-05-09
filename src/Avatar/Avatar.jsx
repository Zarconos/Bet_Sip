// Avatar.jsx

import defaultImg from "./default-avatar.png";
import { usePlayersList, useMultiplayerState } from "playroomkit";
import "./style.css";

const Avatar = () => {
  const players = usePlayersList(true);
  const [playerDrawing, ] = useMultiplayerState('playerDrawing');

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
          </div>
        );
      })}
    </div>
  );
};

export default Avatar;