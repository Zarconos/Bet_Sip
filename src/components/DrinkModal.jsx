import PropTypes from 'prop-types';

const DrinkModal = ({ numberOfDrinks, isWinner }) => {
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
};

export default DrinkModal;
