// Modal.jsx

import PropTypes from 'prop-types';

const Modal = ({ score, onReplay, onReturnToMenu }) => {
    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Game Over</h2>
                <p>Your final score is: {score}</p>
                <div>
                    <button onClick={onReplay}>Replay</button>
                    <button onClick={onReturnToMenu}>Return to Menu</button>
                </div>
            </div>
        </div>
    );
};

Modal.propTypes = {
    score: PropTypes.number.isRequired,
    onReplay: PropTypes.func.isRequired,
    onReturnToMenu: PropTypes.func.isRequired,
};

export default Modal;
