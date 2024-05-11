
import PropTypes from 'prop-types';
import Avatar from './Avatar';

const AvatarModal = ({ drinksCountByPlayer, onClose }) => {
  // Tri des joueurs en fonction du nombre de boissons consommées
  const sortedPlayers = Object.keys(drinksCountByPlayer).sort((a, b) => drinksCountByPlayer[b] - drinksCountByPlayer[a]);

  return (
    <div className="avatar-modal">
      <h2>Players Sorted by Drinks Consumed</h2>
      <div className="avatar-list">
        {sortedPlayers.map(playerId => (
          <Avatar key={playerId} playerId={playerId} drinksCount={drinksCountByPlayer[playerId]} />
        ))}
      </div>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

AvatarModal.propTypes = {
  drinksCountByPlayer: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AvatarModal;
