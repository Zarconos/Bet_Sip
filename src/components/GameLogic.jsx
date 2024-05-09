import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Card from '../data/Card';
import Modal from './Modal';
import DrinkModal from './DrinkModal';
import { useMultiplayerState, insertCoin, myPlayer, usePlayersList } from 'playroomkit';
import Avatar from '../Avatar/Avatar';
import cardsData from '../data/cardsData';
import './GameLogic.css';

const ModaleNextPlayer = ({ onClose, onNextPlayer }) => {
    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Passer au joueur suivant</h2>
                <p>Voulez-vous passer au joueur suivant ?</p>
                <button onClick={onNextPlayer}>Oui</button>
                <button onClick={onClose}>Non</button>
            </div>
        </div>
    );
};

ModaleNextPlayer.propTypes = {
    onClose: PropTypes.func.isRequired,
    onNextPlayer: PropTypes.func.isRequired,
};

const GameLogic = ({ onFinishGame }) => {
    const players = usePlayersList();
    const [round, setRound] = useMultiplayerState('round', 1);
    const [score, setScore] = useMultiplayerState('score', 10);
    const [previousCardValue, setPreviousCardValue] = useMultiplayerState('previousCardValue', 0);
    const [currentCard, setCurrentCard] = useMultiplayerState('currentCard', null);
    const [showBackCard, setShowBackCard] = useMultiplayerState('showBackCard', true);
    const [showModal, setShowModal] = useMultiplayerState('showModal', false);
    const [gameOver, setGameOver] = useMultiplayerState('gameOver', false);
    const [previousCards, setPreviousCards] = useMultiplayerState('previousCards', []);
    const [availableCards, setAvailableCards] = useState([]);
    const [currentPlayerIndex, setCurrentPlayerIndex] = useMultiplayerState('currentPlayerIndex', 0);
    const [answeredQuestions, setAnsweredQuestions] = useState(0);
    const [showNextPlayerModal, setShowNextPlayerModal] = useState(false);
    const [showReplayModal, setShowReplayModal] = useState(false);

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

    const toggleNextPlayerModal = () => {
        setShowNextPlayerModal(!showNextPlayerModal);
    };

    const resetGame = () => {
        setRound(1);
        setPreviousCards([]);
    };

    const handleNextPlayer = () => {
        resetGame();

        const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
        setCurrentPlayerIndex(nextPlayerIndex);

        setAnsweredQuestions(0);

        const allPlayersAnswered = players.every((player, index) => {
            return index === nextPlayerIndex || player.id === myPlayer().id;
        });

        if (allPlayersAnswered) {
            toggleReplayModal();
        }
    };

    const toggleReplayModal = () => {
        setShowReplayModal(!showReplayModal);
    };

    const handleGuess = (guess) => {
        if (gameOver) return;
        if (players[currentPlayerIndex].id !== myPlayer().id) {
            return;
        }
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

        setScore(score + (isCorrect ? 1 : -1));

        if (round === 4) {
            onFinishGame(score);
            setShowModal(true);
            setGameOver(true);
        } else {
            setRound(round + 1);
        }

        setAnsweredQuestions(answeredQuestions + 1);

        if (answeredQuestions >= 4) {
            handleNextPlayer();
        }
    };

    const handleReplay = () => {
        setRound(1);
        setScore(0);
        setShowModal(false);
        setGameOver(false);
        setPreviousCards([]);
    };

    return (
        <div>
            <Avatar players={players} />
            <h2>Round {round}</h2>
            <div className="score-container">
                <p>Score: {score}</p>
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
                        <button onClick={() => handleGuess('even')}>Even</button>
                        <button onClick={() => handleGuess('odd')}>Odd</button>
                    </div>
                )}
                {round === 2 && (
                    <div>
                        <p>Is the next card higher or lower than the previous one?</p>
                        <button onClick={() => handleGuess('higher')}>Higher</button>
                        <button onClick={() => handleGuess('lower')}>Lower</button>
                    </div>
                )}
                {round === 3 && (
                    <div>
                        <p>Is the next card inside or outside the previous ones?</p>
                        <button onClick={() => handleGuess('inside')}>Inside</button>
                        <button onClick={() => handleGuess('outside')}>Outside</button>
                    </div>
                )}
                {round === 4 && (
                    <div>
                        <p>Is the next card red or blue?</p>
                        <button onClick={() => handleGuess('red')}>Red</button>
                        <button onClick={() => handleGuess('blue')}>Blue</button>
                    </div>
                )}
            </div>
            
            {showModal && (
                <Modal
                    score={score}
                    onReplay={handleReplay}
                />
            )}

            {showNextPlayerModal && (
                <ModaleNextPlayer
                    onClose={toggleNextPlayerModal}
                    onNextPlayer={handleNextPlayer}
                />
            )}


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
