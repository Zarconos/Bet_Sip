import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import Card from '../data/Card';
import DrinkModal from './DrinkModal';
import { useMultiplayerState, insertCoin, myPlayer, usePlayersList,  waitForState } from 'playroomkit';
import Avatar from '../Avatar/Avatar';
import cardsData from '../data/cardsData';

import './GameLogic.css';
import './FinishModal.css';


const GameLogic = ({ onFinishGame }) => {
    const players = usePlayersList();
    
    const [round, setRound] = useMultiplayerState('round', 1);
    const [previousCardValue, setPreviousCardValue] = useMultiplayerState('previousCardValue', 0);
    const [currentCard, setCurrentCard] = useMultiplayerState('currentCard', null);
    const [showBackCard, setShowBackCard] = useMultiplayerState('showBackCard', true);
    const [previousCards, setPreviousCards] = useMultiplayerState('previousCards', []);
    const [availableCards, setAvailableCards] = useState([]);
    const [currentPlayerIndex, setCurrentPlayerIndex] = useMultiplayerState('currentPlayerIndex', 0);
    const [activePlayer, setActivePlayer] = useState('');
    const [drinksCount, setDrinksCount] = useMultiplayerState('drinksCount', 0);
    const [drinksCountByPlayer, setDrinksCountByPlayer] = useMultiplayerState('drinksCountByPlayer', {});
    const [restartGame, setRestartGame] = useMultiplayerState('restartGame', false);
    const [, setIsModalOpen] = useState(false);
    const [drinkModal, setDrinkModal] = useState(null); // Ajout de l'état pour la modalité de boisson
    const [isGameFinished] = useMultiplayerState('isGameFinished', false); // Nouvelle variable partagée

    const resetGameState = useCallback(() => {
        setRound(1);
        setPreviousCardValue(0);
        setCurrentCard(null);
        setShowBackCard(true);
        setPreviousCards([]);
        setCurrentPlayerIndex(0);
        setDrinksCount(0);
        setDrinksCountByPlayer({});
        localStorage.removeItem('drinksCountByPlayer');
        localStorage.removeItem('drinksCount');
        if (myPlayer().isHost) {
            setAvailableCards(cardsData);
            setRestartGame(false);
        }
    }, [setRound, setPreviousCardValue, setCurrentCard, setShowBackCard, setPreviousCards, setCurrentPlayerIndex, setDrinksCount, setDrinksCountByPlayer, setAvailableCards, setRestartGame]);

    
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
        const storedDrinksCountByPlayer = JSON.parse(localStorage.getItem('drinksCountByPlayer')) || {};
        setDrinksCountByPlayer(storedDrinksCountByPlayer);
    }, [setDrinksCountByPlayer]);

    useEffect(() => {
        const storedDrinksCount = parseInt(localStorage.getItem('drinksCount'));
        if (!isNaN(storedDrinksCount)) {
            setDrinksCount(storedDrinksCount);
        } else {
            localStorage.setItem('drinksCount', '0');
        }
    }, [setDrinksCount]);

    useEffect(() => {
        const currentPlayer = players[currentPlayerIndex];
        const playerProfile = currentPlayer.getProfile();
        const playerName = playerProfile.name;

        setActivePlayer(playerName);
    }, [players, currentPlayerIndex]);

    useEffect(() => {
        const waitForEndGame = async () => {
            await waitForState('endGameClicked');
            console.log("Le serveur a signalé la fin du jeu.");
            setIsModalOpen(true); // Ouvrir la modale à la fin du jeu
        };

        waitForEndGame();
    }, []);

    useEffect(() => {
        if (restartGame) {
            resetGameState();
        }
    }, [restartGame, resetGameState]);

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

        // Update the list of previously drawn cards while
        // keeping only the four most recent ones.
        setPreviousCards(prevCards => {
            const updatedCards = [...prevCards, card];
            if (updatedCards.length > 4) {
                updatedCards.shift();
            }
            return updatedCards;
        });

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

        
        // Mise à jour du nombre de boissons bues par le joueur actif
        if (!isCorrect && players[currentPlayerIndex].id === myPlayer().id) {
            const newDrinksCountByPlayer = {
                ...drinksCountByPlayer,
                [myPlayer().id]: (drinksCountByPlayer[myPlayer().id] || 0) + 1
            };
            setDrinksCountByPlayer(newDrinksCountByPlayer);
            localStorage.setItem('drinksCountByPlayer', JSON.stringify(newDrinksCountByPlayer));

            const totalDrinks = drinksCount + 1;
            setDrinksCount(totalDrinks);
            localStorage.setItem('drinksCount', totalDrinks.toString());
        }

    
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

        // Mise à jour de la modalité de boisson en fonction du résultat de la réponse
        const numberOfDrinks = isCorrect ? 1 : 1; // Par exemple, 1 gorgée si correct, 3 gorgées sinon
        setDrinkModal({ numberOfDrinks, isWinner: isCorrect });
    
        // Mettre à jour la dernière carte jouée avant de passer au joueur suivant
        setCurrentCard(card);
    };


    // Effet pour surveiller les changements de l'état partagé indiquant la fin du jeu
    useEffect(() => {
        if (isGameFinished) {
            onFinishGame(); // Appeler la fonction de fin de jeu
            setIsModalOpen(true); // Ouvrir la modale de fin de jeu
        }
    }, [isGameFinished, onFinishGame]);

    return (
        <div>
            <Avatar players={players} drinksCountByPlayer={drinksCountByPlayer}/>
            <h2>Round {round}</h2>
            
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
                        <p> La carte suivante est-elle paire ou impaire ?</p>
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
                        <p>La carte suivante est-elle plus grande ou plus petite que la précédente ?</p>
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
                        <p> La carte suivante est-elle entre ou en dehors des précédentes ?</p>
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
                        <p> La couleur de la carte suivante est-elle rouge ou bleue ?</p>
                        {(players[currentPlayerIndex].id === myPlayer().id) && (
                            <div>
                                <button onClick={() => handleGuess('red')}>Red</button>
                                <button onClick={() => handleGuess('blue')}>Blue</button>
                            </div>
                        )}
                    </div>
                )}
            </div>
            
            {drinkModal && (
                <DrinkModal
                    numberOfDrinks={drinkModal.numberOfDrinks}
                    isWinner={drinkModal.isWinner}
                />
            )}



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
