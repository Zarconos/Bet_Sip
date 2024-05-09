import PropTypes from 'prop-types';
import Avatar from '../Avatar/Avatar'; // Import d'AvatarBar
import { usePlayersList, myPlayer } from 'playroomkit'; // Ajout de myPlayer pour obtenir les informations sur le joueur actuel

const Menu = ({ startGame }) => {
    const players = usePlayersList(); // Appel de usePlayersList à l'intérieur du composant Menu
    const currentPlayer = myPlayer(); // Obtenir les informations sur le joueur actuel

    // Fonction pour lancer la partie
    const handleStartGame = () => {
        // Vérifier si le joueur actuel est l'host
        if (currentPlayer && currentPlayer.isHost) {
            startGame(); // Lancer la partie si c'est l'host
        } else {
            // Afficher un message ou une action spécifique si le joueur n'est pas l'host
            console.log("Only the host can start the game.");
        }
    };

    return (
        <div className="menu">
            <Avatar players={players} />
            <h1>Welcome to My Card Game</h1>
            <button onClick={handleStartGame}>Launch</button> {/* Utiliser la fonction handleStartGame pour conditionner le démarrage de la partie */}
        </div>
    );
};

Menu.propTypes = {
    startGame: PropTypes.func.isRequired,
};

export default Menu;
