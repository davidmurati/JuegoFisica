import React from 'react';
import { useHistory } from 'react-router-dom';
import './menu.css';
import imagen1 from './v80.png';

const Menu = () => {
  const history = useHistory();

  const navigateToGame = (game) => {
    history.push(`/${game}`);
  };

  return (
    <div className="menu-container">
      <h1 className="menu-title">Juegos de Física para Bebés</h1>
      <div className="game-options">
        <button 
          className="game-button" 
          onClick={() => window.location.href = "/Juego1"}>
          Juego 1
        </button>
        <button 
          className="game-button" 
          onClick={() => window.location.href = "/Juego2"}>
          Juego 2
        </button>
        <button 
          className="game-button" 
          onClick={() => window.location.href = "/Juego3"}>
          Juego 3
        </button>
        <button 
          className="game-button" 
          onClick={() => window.location.href = "/Juego4"}>
          Juego 4
        </button>
        <img src={imagen1} className="App-logo" alt="logo" />
      </div>
    </div>
  );
};

export default Menu;