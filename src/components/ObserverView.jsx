// ObserverView.js

import PropTypes from 'prop-types';

const ObserverView = ({ player }) => {
    return (
        <div>
            <h3>Observing Player: {player.name}</h3>
            {/* Add any additional information or UI elements specific to the observer */}
        </div>
    );
};

ObserverView.propTypes = {
    player: PropTypes.object.isRequired, // Assuming player object has necessary properties like name
};

export default ObserverView;
