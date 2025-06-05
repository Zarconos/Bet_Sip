import { useEffect } from 'react';
import PropTypes from 'prop-types';

const DrinkModal = ({ numberOfDrinks, isWinner, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            if (onClose) {
                onClose();
            }
        }, 5000);

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>{isWinner ? 'Tu distribues' : 'Tu bois'}</h2>
                <p>{isWinner ? `Distribue ${numberOfDrinks} gorgées.` : `Bois ${numberOfDrinks} gorgées.`}</p>
            </div>
        </div>
    );
};

DrinkModal.propTypes = {
    numberOfDrinks: PropTypes.number.isRequired,
    isWinner: PropTypes.bool.isRequired,
    onClose: PropTypes.func,
};

export default DrinkModal;
