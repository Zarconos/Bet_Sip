// Card.jsx

import PropTypes from 'prop-types';


const Card = ({ cardNumber, color, onClick }) => {
    let imagePath = '../../public/cards/back card/back_card.png'; // Chemin d'accès par défaut ou vide
    if (cardNumber !== undefined && color !== undefined) {
        if (color === 'red') {
            imagePath = `../../public/cards/${cardNumber}-r.png`;
        } else if (color === 'blue') {
            imagePath = `../../public/cards/${cardNumber}-b.png`;
        }
    }

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
