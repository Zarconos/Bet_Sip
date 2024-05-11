
// FinishButton.jsx

import { useIsHost, useMultiplayerState } from 'playroomkit';

const FinishButton = () => {
    const isHost = useIsHost();
    const [isGameFinished, setIsGameFinished] = useMultiplayerState('isGameFinished', false);

    const handleFinishGame = () => {
        if (isHost) {
            setIsGameFinished(true); // Mettre à jour l'état partagé pour signaler la fin du jeu

            // Définir un délai de 2 secondes avant de réinitialiser isGameFinished à false
            setTimeout(() => {
                setIsGameFinished(false);
                console.log("isGameFinished set to false after 2 seconds");
            }, 2000);
        }
    };

    return (
        <>
            {isHost && !isGameFinished && (
                <button onClick={handleFinishGame}>Finish Game</button>
            )}
        </>
    );
};

export default FinishButton;
