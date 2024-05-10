import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Card from '../data/Card';
import DrinkModal from './DrinkModal';
import { useMultiplayerState, insertCoin, myPlayer, usePlayersList } from 'playroomkit';
import Avatar from '../Avatar/Avatar';
import cardsData from '../data/cardsData';
import './GameLogic.css';

const GameLogic = () => {
    const players = usePlayersList();
    const [round, setRound] = useMultiplayerState('round', 1);
    const [score, setScore] = useMultiplayerState('score', 10);
    const [previousCardValue, setPreviousCardValue] = useMultiplayerState('previousCardValue', 0);
    const [currentCard, setCurrentCard] = useMultiplayerState('currentCard', null);
    const [showBackCard, setShowBackCard] = useMultiplayerState('showBackCard', true);
    const [previousCards, setPreviousCards] = useMultiplayerState('previousCards', []);
    const [availableCards, setAvailableCards] = useState([]);
    const [currentPlayerIndex, setCurrentPlayerIndex] = useMultiplayerState('currentPlayerIndex', 0);
    const [activePlayer, setActivePlayer] = useState('');
    const [drinksCount, setDrinksCount] = useState(0);


    useEffect(() => {
        const setupMultiplayer = async () => {
            await insertCoin();
            const player = myPlayer();
            if (player.isHost) {
                setAvailableCards(cardsData);
            }
        };
    
        setupMultiplayer();
    }, []);
    
    useEffect(() => {
        const remainingCards = cardsData.filter(card => !previousCards.includes(card));
        setAvailableCards(remainingCards);
    
    }, [previousCards]);

    useEffect(() => {
        const storedDrinksCount = parseInt(localStorage.getItem('drinksCount'));
        if (!isNaN(storedDrinksCount)) {
            setDrinksCount(storedDrinksCount);
        } else {
            localStorage.setItem('drinksCount', '0');
        }
    }, []);

    useEffect(() => {
        const currentPlayer = players[currentPlayerIndex];
        const playerProfile = currentPlayer.getProfile();
        const playerName = playerProfile.name;

        setActivePlayer(playerName);
    }, [players, currentPlayerIndex]);

    const handleGuess = (guess) => {
        const currentPlayer = players[currentPlayerIndex];
        const playerProfile = currentPlayer.getProfile();
        const playerName = playerProfile.name;

        console.log(`Le joueur ${playerName} joue.`);

        if (currentPlayer.id !== myPlayer().id) {
            return;
        }
    
        // Mettre à jour l'état partagé avec le nom du joueur actif
        currentPlayer.setState('activePlayer', playerName, true);
    
        const randomIndex = Math.floor(Math.random() * availableCards.length);
        const card = availableCards[randomIndex];
    
        setCurrentCard(card);
        setShowBackCard(false);
        setPreviousCards([...previousCards, card]);
    
        if (previousCards.length >= 4) {
            setPreviousCards(previousCards.slice(1));
        }
        setPreviousCardValue(card.value);
    
        let isCorrect = false;
        if (round === 1) {
            if ((card.value % 2 === 0 && guess === 'even') || (card.value % 2 !== 0 && guess === 'odd')) {
                isCorrect = true;
            }
        } else if (round === 2) {
            if ((card.value > previousCardValue && guess === 'higher') || (card.value < previousCardValue && guess === 'lower')) {
                isCorrect = true;
            }
        } else if (round === 3) {
            if ((card.value > previousCardValue && guess === 'inside') || (card.value < previousCardValue && guess === 'outside')) {
                isCorrect = true;
            }
        } else if (round === 4) {
            if ((card.color === 'red' && guess === 'red') || (card.color === 'blue' && guess === 'blue')) {
                isCorrect = true;
            }
        }

        if (!isCorrect && players[currentPlayerIndex].id === myPlayer().id) {
            // Augmenter le nombre de gorgées bues uniquement si le joueur actif a pris une mauvaise décision
            const newDrinksCount = drinksCount + 1;
            setDrinksCount(newDrinksCount);
            localStorage.setItem('drinksCount', newDrinksCount.toString());
        }
    
        setScore(score + (isCorrect ? 1 : -1));
    
        if (round === 4) {
            setRound(1); // Réinitialiser le tour à 1 pour continuer le jeu
            setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length); // Passer au joueur suivant
            
            // Lancer le timer de 10 secondes avant de supprimer les cartes précédentes
            setTimeout(() => {
                setPreviousCards([]); // Effacer les cartes précédentes après 10 secondes
            }, 5000);
        } else {
            setRound(round + 1);
        }
    
        // Mettre à jour la dernière carte jouée avant de passer au joueur suivant
        setCurrentCard(card);
    };

    return (
        <div>
            <Avatar players={players} />
            <h2>Round {round}</h2>
            <div className="score-container">
                <p>Score: {score}</p>
            </div>
            
            <div className="active-player">
    <p>Active Player: {activePlayer} (Drinks: {drinksCount})</p>
</div>

            
            <div className="card-container">
            {showBackCard ? (
                <Card cardNumber={0} color="back" />
            ) : (
                currentCard && <Card cardNumber={parseInt(currentCard.value)} color={currentCard.color} />
            )}
            {round === 1 && (
                <div>
                    <p>Is the next card even or odd?</p>
                    {(players[currentPlayerIndex].id === myPlayer().id) && (
                        <div>
                            <button onClick={() => handleGuess('even')}>Even</button>
                            <button onClick={() => handleGuess('odd')}>Odd</button>
                        </div>
                    )}
                </div>
            )}
            {round === 2 && (
                <div>
                    <p>Is the next card higher or lower than the previous one?</p>
                    {(players[currentPlayerIndex].id === myPlayer().id) && (
                        <div>
                            <button onClick={() => handleGuess('higher')}>Higher</button>
                            <button onClick={() => handleGuess('lower')}>Lower</button>
                        </div>
                    )}
                </div>
            )}
            {round === 3 && (
                <div>
                    <p>Is the next card inside or outside the previous ones?</p>
                    {(players[currentPlayerIndex].id === myPlayer().id) && (
                        <div>
                            <button onClick={() => handleGuess('inside')}>Inside</button>
                            <button onClick={() => handleGuess('outside')}>Outside</button>
                        </div>
                    )}
                </div>
            )}
            {round === 4 && (
                <div>
                    <p>Is the next card red or blue?</p>
                    {(players[currentPlayerIndex].id === myPlayer().id) && (
                        <div>
                            <button onClick={() => handleGuess('red')}>Red</button>
                            <button onClick={() => handleGuess('blue')}>Blue</button>
                        </div>
                    )}
                </div>
            )}
        </div>
            
            <DrinkModal
                numberOfDrinks={1}
                isWinner={true}
            />

            <div className="previous-cards-container">
                <h3>Previous Cards</h3>
                {previousCards.map((card, index) => (
                    <div key={index} className="previous-card">
                        <Card cardNumber={parseInt(card.value)} color={card.color} />
                    </div>
                ))}
            </div>
        </div>
    );
};

GameLogic.propTypes = {
    onFinishGame: PropTypes.func.isRequired,
};

export default GameLogic;
