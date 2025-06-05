// main.jsx

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { insertCoin } from 'playroomkit';
import './index.css';

const startGameAfterInsertCoin = async () => {
  try {
    // Activer le mode tour par tour et récupérer l'ID du défi
    await insertCoin();
    createRoot(document.getElementById('root')).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error('Erreur lors de l\'insertion de la pièce :', error);
  }
};

startGameAfterInsertCoin();
