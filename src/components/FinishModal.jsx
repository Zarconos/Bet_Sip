import './FinishModal.css';
import PropTypes from 'prop-types';

const FinishModal = ({ isOpen, onClose, drinksCountByPlayer, onReplay, isHost }) => {
    // Fonction pour gérer la réinitialisation du jeu pour tous les joueurs
    const handleReplay = () => {
        // Appelez la fonction de rappel onReplay pour réinitialiser le jeu
        onReplay();
        // Fermez la modale une fois que le jeu est réinitialisé
        onClose();
    };

    return (
        <div className={`modal ${isOpen ? 'show' : ''}`}>
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Game Over</h2>
                <div>
                    <h3>Drinks Consumed:</h3>
                    <ul>
                        {Object.entries(drinksCountByPlayer).map(([playerId, drinks]) => (
                            <li key={playerId}>Player {playerId}: {drinks} drinks</li>
                        ))}
                    </ul>
                </div>
                {/* Bouton "Replay" pour réinitialiser le jeu */}
                {isHost && <button onClick={handleReplay}>Replay</button>}
            </div>
        </div>
    );
};

FinishModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    drinksCountByPlayer: PropTypes.object.isRequired,
    onReplay: PropTypes.func.isRequired,
    isHost: PropTypes.bool.isRequired,
};

export default FinishModal;

