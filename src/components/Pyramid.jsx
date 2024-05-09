//Pyramid.jsx

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Card from '../data/Card';
import cardsData from '../data/cardsData';
import DrinkModal from './DrinkModal';

const Pyramid = ({ previousCards }) => {
    const [pyramidCards, setPyramidCards] = useState([]);
    const [selectedPreviousCard, setSelectedPreviousCard] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedValue, setSelectedValue] = useState(null);
    const [passTurn, setPassTurn] = useState(false);
    const [drinkModal, setDrinkModal] = useState(null);

    const handlePreviousCardClick = (clickedCard) => {
        setSelectedPreviousCard(clickedCard);
        setPassTurn(false);
    };

    const handleColorSelection = (color) => {
        setSelectedColor(color);
        setSelectedValue(null);
    };

    const handlePassTurn = () => {
        setPassTurn(true);
        setSelectedPreviousCard(null);
        setSelectedColor(null);
        setSelectedValue(null);
    };

    const handleValidate = () => {
        if (selectedPreviousCard && (selectedColor || selectedValue || passTurn)) {
            const newCard = cardsData[Math.floor(Math.random() * cardsData.length)];
            console.log('Carte tirée:', newCard.value, newCard.color); // Ajouter ce console log pour afficher la carte tirée
    
            let numberOfDrinks = 0;
    
            if (!passTurn && selectedPreviousCard) {
                const previousCard = pyramidCards[pyramidCards.length - 1];
    
                if (selectedColor && selectedColor !== previousCard.color) { // Modifier cette ligne pour vérifier la couleur par rapport à la carte précédemment sélectionnée
                    numberOfDrinks += 1;
                }
    
                if (selectedValue && selectedValue !== previousCard.value) {
                    numberOfDrinks += 1;
                }
            }
    
            if (numberOfDrinks > 0 || passTurn) {
                setDrinkModal({ numberOfDrinks, isWinner: false }); // Le joueur doit boire
            } else {
                setDrinkModal({ numberOfDrinks: 1, isWinner: true }); // Le joueur est déclaré gagnant et doit distribuer 1 boisson
            }
    
            if (!passTurn && selectedPreviousCard && pyramidCards.length < 10) {
                // Si le joueur n'a pas passé son tour et qu'il a décidé de jouer, on ajoute une nouvelle carte
                setPyramidCards([...pyramidCards, newCard]);
            }
    
            setSelectedPreviousCard(null);
            setSelectedColor(null);
            setSelectedValue(null);
            setPassTurn(false);
        } else {
            console.log('Veuillez sélectionner au moins une option ou passer votre tour.');
        }
    };
    
    
    // Ajouter ce console log pour afficher la valeur et la couleur de la carte sélectionnée
    console.log('Carte sélectionnée:', selectedPreviousCard ? selectedPreviousCard.value : 'Aucune', selectedPreviousCard ? selectedPreviousCard.color : 'Aucune');
    

    useEffect(() => {
        const initialCard = cardsData[Math.floor(Math.random() * cardsData.length)];
        setPyramidCards([initialCard]);
    }, []);

    return (
        <div>
            {pyramidCards.map((card) => (
                <div key={card.id} className="pyramid-card">
                    <Card 
                        cardNumber={card.value} 
                        color={card.color} 
                        onClick={() => handlePreviousCardClick(card)}
                    />
                </div>
            ))}
            <div className="selection-checkboxes">
                {previousCards.map((card) => (
                    <div key={card.id} className="previous-card" onClick={() => handlePreviousCardClick(card)}>
                        <Card cardNumber={card.value} color={card.color} />
                    </div>
                ))}
                {selectedPreviousCard && !passTurn && (
                    <>
                        <label>
                            <input type="checkbox" onChange={() => handleColorSelection(selectedPreviousCard.color)} checked={selectedColor === selectedPreviousCard.color} />
                            Même couleur
                        </label>
                        <label>
                            <input type="checkbox" onChange={() => setSelectedValue(selectedPreviousCard.value)} checked={selectedValue === selectedPreviousCard.value} />
                            Même valeur
                        </label>
                    </>
                )}

                {drinkModal && (
                    <DrinkModal
                        numberOfDrinks={drinkModal.numberOfDrinks}
                        isWinner={drinkModal.isWinner}
                    />
                )}
                <label>
                    <input type="checkbox" onChange={handlePassTurn} />
                    Passer son tour
                </label>
            </div>
            <div className="validate-button">
                <button onClick={handleValidate}>Valider</button>
            </div>
        </div>
    );
};

Pyramid.propTypes = {
    previousCards: PropTypes.array.isRequired,
};

export default Pyramid;
