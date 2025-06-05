// PlayerView.js

import PropTypes from 'prop-types';

const PlayerView = ({ player }) => {
    return (
        <div>
            <h3>Current Player: {player.name}</h3>
            {/* Add any additional information or UI elements specific to the player */}
        </div>
    );
};

PlayerView.propTypes = {
    player: PropTypes.object.isRequired, // Assuming player object has necessary properties like name
};

export default PlayerView;
