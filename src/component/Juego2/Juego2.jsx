import React, { useState, useEffect } from 'react';
import './Juego2.css';

// Importación de componentes de UI nativos
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

const Juego2 = () => {
  const [blueCarPosition, setBlueCarPosition] = useState(0);
  const [greenCarPosition, setGreenCarPosition] = useState(0);
  const [time, setTime] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [raceStarted, setRaceStarted] = useState(false);
  const [winner, setWinner] = useState(null);
  const [score, setScore] = useState(0);
  const [showAlert, setShowAlert] = useState(false);

  const trackLength = 100; // Longitud de la pista
  const minSpeed = 20; // Velocidad mínima (unidades por segundo)
  const maxAdditionalSpeed = 50; // Velocidad adicional máxima

  useEffect(() => {
    let interval;
    if (gameActive && raceStarted) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 0.1);
        
        const blueSpeed = minSpeed + Math.random() * maxAdditionalSpeed;
        const greenSpeed = minSpeed + Math.random() * maxAdditionalSpeed;
        
        setBlueCarPosition((prevPos) => Math.min(prevPos + blueSpeed * 0.1, trackLength));
        setGreenCarPosition((prevPos) => Math.min(prevPos + greenSpeed * 0.1, trackLength));

        if (blueCarPosition >= trackLength || greenCarPosition >= trackLength) {
          setGameActive(false);
          setWinner(greenCarPosition > blueCarPosition ? 'green' : 'blue');
        }
      }, 100);
    }
    return () => clearInterval(interval);
  }, [gameActive, raceStarted, blueCarPosition, greenCarPosition]);

  const startGame = () => {
    setBlueCarPosition(0);
    setGreenCarPosition(0);
    setTime(0);
    setWinner(null);
    setGameActive(true);
    setRaceStarted(false);
  };

  const startRace = () => {
    setRaceStarted(true);
  };

  const handleGuess = (color) => {
    if (color === winner) {
      setScore((prevScore) => prevScore + 1);
      setShowAlert(true);
    }
    startGame();
  };

  return (
    <div className="car-race-container">
      <h2 className="title">Carrera de Autos</h2>
      <div className="timer">Tiempo: {time.toFixed(1)}s</div>
      <div className="timer">Puntuación: {score}</div>
      <Button onClick={() => window.location.href = "/"} className="shoot-button">
        Regresar
      </Button>
      <div className="track">
        <div className="start-line">INICIO</div>
        <div className="finish-line">META</div>
        <div className="distance-marker">10 metros</div>
        <div
          className="car blue-car"
          style={{ left: `calc(${(blueCarPosition / trackLength) * 100}% - 3rem)` }}
        >
          A
        </div>
        <div
          className="car green-car"
          style={{ left: `calc(${(greenCarPosition / trackLength) * 100}% - 3rem)` }}
        >
          V
        </div>
        
      </div>
      {gameActive && !raceStarted && (
        <Button onClick={startRace} className="start-race-button" variant="contained" color="primary">
          Iniciar Carrera
        </Button>
        
      )}
      {!gameActive && (
        <div className="guess-buttons">
          <Button onClick={() => handleGuess('blue')} variant="contained" color="primary">
            Auto Azul fue más rápido
          </Button>
          <Button onClick={() => handleGuess('green')} variant="contained" color="success">
            Auto Verde fue más rápido
          </Button>
          
        </div>
        
      )}
      
      {!gameActive && !winner && (
        <Button onClick={startGame} className="start-game-button" variant="contained" color="secondary">
          Preparar Juego
        </Button>
        
      )}
      <Dialog open={showAlert} onClose={() => setShowAlert(false)}>
        <DialogTitle>¡Felicitaciones!</DialogTitle>
        <DialogContent>
          Has acertado. Tu puntuación actual es {score}.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAlert(false)} color="primary">
            Continuar
          </Button>
        </DialogActions>
      </Dialog>
      
    </div>
    
  );
  
};

export default Juego2;