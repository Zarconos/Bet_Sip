import { useEffect, useState } from 'react';
import { useMultiplayerState, usePlayersList, useIsHost } from 'playroomkit';

const ScorePage = () => {
    const [drinksCountByPlayer] = useMultiplayerState('drinksCountByPlayer', {});
    const [drinksCount] = useMultiplayerState('drinksCount', 0);
    const players = usePlayersList();
    const [playerProfiles, setPlayerProfiles] = useState({});
    const isHost = useIsHost();

    useEffect(() => {
        const profiles = {};
        players.forEach(player => {
            const profile = player.getProfile();
            profiles[player.id] = profile;
        });
        setPlayerProfiles(profiles);
    }, [players]);

    const [, setRestartGame] = useMultiplayerState('restartGame', false);

    const handleReplay = () => {
        if (isHost) {
            setRestartGame(prev => !prev);
        }
    };

    return (
        <div>
            <h1>Page des scores</h1>
            <div>
                <h2>Nombre total de boissons bues : {drinksCount}</h2>
            </div>
            <div>
                <h2>Nombre de boissons bues par joueur :</h2>
                <ul>
                    {players.map(player => (
                        <li key={player.id}>
                            {playerProfiles[player.id] && playerProfiles[player.id].name ? playerProfiles[player.id].name : 'Joueur anonyme'}: {drinksCountByPlayer[player.id] || 0}
                            {playerProfiles[player.id] && playerProfiles[player.id].photo && <img src={playerProfiles[player.id].photo} alt={playerProfiles[player.id].name} />}
                        </li>
                    ))}
                </ul>
            </div>
            {isHost && (
                <button onClick={handleReplay}>Rejouer</button>
            )}
        </div>
    );
};

export default ScorePage;
