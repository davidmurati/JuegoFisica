import React, { useState, useEffect } from 'react';
import './Juego4.css';  // Importa el archivo CSS

const NewtonBoxGame = () => {
  const [spheres, setSpheres] = useState(0);
  const [position, setPosition] = useState(0);
  const [target, setTarget] = useState(null);
  const [velocity, setVelocity] = useState(0);
  const [friction, setFriction] = useState(false);
  const [gameState, setGameState] = useState('initial');
  const [force, setForce] = useState(10);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');

  const FRICTION_COEFFICIENT = 0.05;
  const GRAVITY = 9.8;
  const FIELD_LENGTH = 300;
  const BOX_WIDTH = 10;
  const Tiempo = 0.1;
/*en esta parte del codigo donde dice velocity es aceleracion y 0.1 el tiempo*/ 
  useEffect(() => {
    if (gameState === 'moving') {
      const interval = setInterval(() => {
        setPosition((prevPosition) => {
          const newPosition = prevPosition + velocity * 0.1;
          if (friction) {
            setVelocity((prevVelocity) => {
              const mass = 5 + spheres * 10;
              const frictionForce = FRICTION_COEFFICIENT * mass * GRAVITY;
              const acceleration = -frictionForce / mass;
              const newVelocity = prevVelocity + acceleration * 0.1;
              return newVelocity > 0 ? newVelocity : 0;
            });
          }
          if (newPosition >= FIELD_LENGTH || velocity <= 0) {
            setGameState('finished');
            clearInterval(interval);
            if (isBoxOverlappingTarget(newPosition)) {
              setScore(prevScore => prevScore + 1);
              setMessage('¡Felicidades! Ganaste un punto. ¡Eres muy fuerte!');
            } else if (newPosition + BOX_WIDTH < target) {
              setMessage('Poca fuerza aplicada. ¡Inténtalo de nuevo!');
            } else {
              setMessage('Mucha fuerza aplicada. ¡Inténtalo de nuevo!');
            }
          }
          return newPosition < FIELD_LENGTH ? newPosition : FIELD_LENGTH;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [gameState, velocity, friction, target, spheres]);

  const isBoxOverlappingTarget = (boxPosition) => {
    return (
      (boxPosition <= target && target < boxPosition + BOX_WIDTH) ||
      (target <= boxPosition && boxPosition < target + 1)
    );
  };

  const addSphere = () => {
    if (spheres < 3) setSpheres(spheres + 1);
  };

  const removeSphere = () => {
    if (spheres > 0) setSpheres(spheres - 1);
  };

  const initGame = () => {
    setTarget(Math.floor(Math.random() * (FIELD_LENGTH - 50)) + 50);
    setGameState('ready');
    setPosition(0);
    setVelocity(0);
    setMessage('');
  };

  const push = () => {
    if (gameState !== 'ready') return;
    const mass = 5 + spheres * 10;
    const frictionForce = friction ? FRICTION_COEFFICIENT * mass * GRAVITY : 0;
    const netForce = force - frictionForce;
    const acceleration = netForce / mass;
    setVelocity(acceleration * 1);
    setGameState('moving');
    setMessage('');
  };

  const reset = () => {
    setPosition(0);
    setVelocity(0);
    setTarget(null);
    setGameState('initial');
    setMessage('');
  };

  return (
    <div className="game-container">
      <h2 className="game-title">Juego de la Caja de Newton</h2>
      <div className="controls">
        <button onClick={addSphere} disabled={spheres >= 3 || gameState !== 'initial'}>Añadir Esfera</button>
        <button onClick={removeSphere} disabled={spheres <= 0 || gameState !== 'initial'}>Quitar Esfera</button>
        <span className="sphere-count">Esferas: {spheres}</span>
      </div>
      <div className="controls">
        <button onClick={() => setFriction(!friction)} disabled={gameState === 'moving'}>
          {friction ? 'Desactivar Fricción' : 'Activar Fricción'}
        </button>
      </div>
      <div className="controls">
        <label>Fuerza (N): {force}</label>
        <input
          type="range"
          value={force}
          onChange={(e) => setForce(parseInt(e.target.value))}
          max={100}
          step={10}
          className="force-slider"
          disabled={gameState === 'moving'}
        />
      </div>
      <div className="controls">
        <button onClick={initGame} disabled={gameState !== 'initial'}>Iniciar Juego</button>
        <button onClick={push} disabled={gameState !== 'ready'}>Empujar</button>
        <button onClick={reset} disabled={gameState === 'initial'}>Reiniciar</button>
      </div>
      <div className="game-field">
        <div 
          className="game-line" 
          style={{ backgroundColor: friction ? 'black' : 'white' }}
        ></div>
        <div 
          className="game-box" 
          style={{ left: `${position}px` }}
        >
          {[...Array(spheres)].map((_, i) => (
            <div key={i} className="game-sphere"></div>
          ))}
        </div>
        {target !== null && (
          <div 
            className="game-target" 
            style={{ left: `${target}px` }}
          ></div>
        )}
      </div>
      <div className="status">
        <p>Posición: {Math.round(position)} unidades</p>
        <p>Velocidad: {Math.round(velocity * 0.1*1000) } miliunidades/s</p>
        <p>Objetivo: {target !== null ? `${target} unidades` : 'No establecido'}</p>
        <p>Peso total: {5 + spheres * 10} kg</p>
        <p>Fuerza aplicada: {force} N</p>
        <p>Tiempo de aplicacion de la Fuerza aplicada: 0.1 s</p>
        <p>Puntuación: {score}</p>
      </div>
      {message && (
        <div className="game-alert">
          <p>{message}</p>
        </div>
      )}
        <button onClick={() => window.location.href = "/"} className="shoot-button">
                Regresar
        </button>
    </div>
  );
};

export default NewtonBoxGame;