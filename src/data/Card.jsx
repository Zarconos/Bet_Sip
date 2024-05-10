// Card.jsx

import PropTypes from 'prop-types';
import cardsData from './cardsData';

const Card = ({ cardNumber, color, onClick }) => {
    // Crée une fonction qui récupère l'URL de l'image en fonction de la couleur et du numéro de la carte
    const getImagePath = (color, cardNumber) => {
        const card = cardsData.find(card => card.color === color && card.value === cardNumber);
        return card ? card.image : 'https://i.imgur.com/orp60NC.png'; // Image par défaut si aucune correspondance n'est trouvée
    };

    const imagePath = getImagePath(color, cardNumber);

    return (
        <img
            src={imagePath}
            alt={`Card ${cardNumber}`}
            onClick={onClick}
            style={{
                cursor: onClick ? 'pointer' : 'pointer',
                filter: onClick ? 'brightness(1.1)' : 'brightness(1)',
                transition: 'filter 0.3s ease',
            }}
        />
    );
};

Card.propTypes = {
    cardNumber: PropTypes.number,
    color: PropTypes.string,
    onClick: PropTypes.func.isRequired,
};

export default Card;

