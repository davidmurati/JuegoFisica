import React, { useState, useEffect } from 'react';
import './Juego42.css';  // Importa el archivo CSS

const NewtonBoxGame = () => {
  const [spheres, setSpheres] = useState(0);
  const [position, setPosition] = useState(0);
  const [target, setTarget] = useState(null);
  const [velocity, setVelocity] = useState(0);
  const [aceleracion, setAceleracion] = useState(0);
  const [friction, setFriction] = useState(false);
  const [gameState, setGameState] = useState('initial');
  const [force, setForce] = useState(10);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');
  const [timeElapsed, setTimeElapsed] = useState(0);

  const FRICTION_COEFFICIENT = 0.05;
  const GRAVITY = 9.8;
  const FIELD_LENGTH = 380;
  const BOX_WIDTH = 30;
  const Tiempo = 0.1;

  useEffect(() => {
    let timeInterval;
    if (gameState === 'moving') {
      timeInterval = setInterval(() => {
        setTimeElapsed((prevTime) => +(prevTime + Tiempo).toFixed(4));
      }, Tiempo * 1000);

      const positionInterval = setInterval(() => {
        setPosition((prevPosition) => {
          const newPosition = +(prevPosition + velocity * Tiempo + 0.5 * aceleracion * Tiempo * Tiempo).toFixed(4);
          if (friction) {
            setVelocity((prevVelocity) => {
              const mass = 5 + spheres * 10;
              const frictionForce = +(FRICTION_COEFFICIENT * mass * GRAVITY).toFixed(4);
              const acceleration = -frictionForce / mass;
              const newVelocity = +(prevVelocity + acceleration * Tiempo).toFixed(4);
              return newVelocity > 0 ? newVelocity : 0;
            });
          }

          // Si la caja se detiene y está sobre la línea de meta, suma un punto
          if (newPosition >= FIELD_LENGTH || velocity <= 0) {
            setGameState('finished');
            clearInterval(positionInterval);
            clearInterval(timeInterval);  // Detener el contador de tiempo cuando el movimiento se detenga
            
            const boxStart = newPosition;
            const boxEnd = newPosition + BOX_WIDTH;

            if (isBoxOverlappingTarget(boxStart, boxEnd, target)) {
              setScore((prevScore) => prevScore + 0.5);
              setMessage('¡Felicidades! Ganaste un punto. ¡Eres muy fuerte!');
            } else if (boxEnd < target) {
              setMessage('Poca fuerza aplicada. ¡Inténtalo de nuevo!');
            } else {
              setMessage('Mucha fuerza aplicada. ¡Inténtalo de nuevo!');
            }
          }

          return newPosition < FIELD_LENGTH ? newPosition : FIELD_LENGTH;
        });
      }, 100);

      return () => {
        clearInterval(positionInterval);
        clearInterval(timeInterval);
      };
    }
  }, [gameState, velocity, friction, target, spheres]);

  const isBoxOverlappingTarget = (boxStart, boxEnd, target) => {
    return target >= boxStart && target <= boxEnd;
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
    setTimeElapsed(0);  // Reiniciar el contador de tiempo
  };

  const push = () => {
    if (gameState !== 'ready') return;
    const mass = 5 + spheres * 10;
    const frictionForce = friction ? +(FRICTION_COEFFICIENT * mass * GRAVITY).toFixed(4) : 0;
    const netForce = force.toFixed(4) - frictionForce.toFixed(4);
    const acceleration = +(netForce / mass).toFixed(4);
    setAceleracion(acceleration);
    setVelocity(+(acceleration * Tiempo).toFixed(4));
    setGameState('moving');
    setMessage('');
  };

  const reset = () => {
    setPosition(0);
    setVelocity(0);
    setTarget(null);
    setGameState('initial');
    setMessage('');
    setTimeElapsed(0);  // Reiniciar el contador de tiempo
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
          max={1010}
          step={50}
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
        <p>Aceleración: {aceleracion.toFixed(2)} unidades/s²</p>
        <p>Velocidad: {velocity.toFixed(2)} unidades/s</p>
        <p>Objetivo: {target !== null ? `${target} Distancia` : 'No establecido'}</p>
        <p>Peso total: {5 + spheres * 10} kg</p>
        <p>Fuerza aplicada: {force} N</p>
        <p>Tiempo de aplicación de la Fuerza aplicada: 0.1 s</p>
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