import React, { useState, useEffect, useRef } from 'react';
import './Juego3.css';

const ParabolicShot = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [angle, setAngle] = useState(45);
  const [score, setScore] = useState(0);
  const [targetPosition, setTargetPosition] = useState(0);
  const [velocity, setVelocity] = useState('medio');
  const [cannonPosition, setCannonPosition] = useState(0);
  const [refresh, setRefresh] = useState(0);
  const [shotCount, setShotCount] = useState(0);
  const canvasRef = useRef(null);

  const gravity = 9.8;
  const canvasWidth = 600;
  const canvasHeight = 300;
  const baseCannonX = 50;
  const cannonY = canvasHeight - 50;
  const maxDistance = 100;
  const scale = (canvasWidth - 100) / maxDistance;

  const velocities = {
    lento: 30,
    medio: 50,
    rapido: 70,
  };

  useEffect(() => {
    if (gameStarted) {
      drawGame();
    } else {
      drawStartScreen();
    }
  }, [gameStarted, angle, targetPosition, velocity, cannonPosition, refresh]);

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setShotCount(0);
    setNewTarget();
  };

  const setNewTarget = () => {
    const newPosition = Math.floor(Math.random() * 20) * 5 + 5;
    setTargetPosition(newPosition);
  };

  const drawStartScreen = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.font = '30px Arial';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.fillText('Presiona "Iniciar Juego"', canvasWidth / 2, canvasHeight / 2);
  };

  const drawGame = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    ctx.beginPath();
    ctx.moveTo(0, cannonY);
    ctx.lineTo(canvasWidth, cannonY);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.stroke();

    const currentCannonX = baseCannonX + cannonPosition * scale;

    ctx.beginPath();
    ctx.moveTo(currentCannonX, cannonY);
    ctx.lineTo(
      currentCannonX + 30 * Math.cos((angle * Math.PI) / 180),
      cannonY - 30 * Math.sin((angle * Math.PI) / 180)
    );
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 5;
    ctx.stroke();

    const targetX = baseCannonX + targetPosition * scale;
    ctx.fillStyle = 'green';
    ctx.fillRect(targetX - 10, cannonY - 20, 20, 20);

    for (let i = 0; i <= maxDistance; i += 10) {
      const x = baseCannonX + i * scale;
      ctx.beginPath();
      ctx.moveTo(x, cannonY);
      ctx.lineTo(x, cannonY + 10);
      ctx.stroke();
      
      ctx.font = '10px Arial';
      ctx.fillStyle = 'black';
      ctx.textAlign = 'center';
      ctx.fillText(i.toString(), x, cannonY + 25);
    }
  };

  const shoot = () => {
    if (!gameStarted) return;

    setShotCount((prevCount) => prevCount + 1);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let t = 0;
    
    const animate = () => {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      drawGame();

      const currentCannonX = baseCannonX + cannonPosition * scale;
      const v = velocities[velocity];
      const x = currentCannonX + v * Math.cos((angle * Math.PI) / 180) * t;
      const y = cannonY - (v * Math.sin((angle * Math.PI) / 180) * t - 0.5 * gravity * t * t);

      ctx.beginPath();
      ctx.moveTo(currentCannonX, y);
      ctx.lineTo(currentCannonX, cannonY);
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(x, cannonY, 5, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(currentCannonX, cannonY);
      ctx.lineTo(x, cannonY);
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2 * Math.PI);
      ctx.fillStyle = 'red';
      ctx.fill();

      const targetX = baseCannonX + targetPosition * scale;
      
      if (Math.abs(x - targetX) < 15 && y > cannonY - 25) {
        let points = 0;
        if (velocity === 'lento') points = 3;
        else if (velocity === 'medio') points = 2;
        else if (velocity === 'rapido') points = 1;
        
        if (angle >= 45) points += 2;
        
        setScore((prevScore) => prevScore + points);
        setNewTarget();
        setRefresh((prev) => prev + 1);
        return;
      }

      if (x > canvasWidth || y > cannonY) {
        setScore((prevScore) => prevScore - 1);
        setRefresh((prev) => prev + 1);
        return;
      }

      t += 0.1;
      requestAnimationFrame(animate);
    };

    animate();
  };

  const changeAngle = (delta) => {
    if (!gameStarted) return;
    setAngle((prevAngle) => {
      const newAngle = prevAngle + delta;
      return Math.max(0, Math.min(90, newAngle));
    });
    setRefresh((prev) => prev + 1);
  };

  const moveCanon = (delta) => {
    if (!gameStarted) return;
    setCannonPosition((prevPosition) => {
      const newPosition = prevPosition + delta;
      return Math.max(0, Math.min(30, newPosition));
    });
    setRefresh((prev) => prev + 1);
  };

  const changeVelocity = (newVelocity) => {
    if (!gameStarted) return;
    setVelocity(newVelocity);
    setRefresh((prev) => prev + 1);
  };

  return (
    <div className="container">
      
      <div className="game-board">
        <h1>Juego de Lanzamiento Parabólico</h1>
        <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} className="game-canvas" />
        
        {gameStarted && (
          <>
            <div className="controls">
              <button onClick={() => changeAngle(-5)} disabled={angle <= 0}>
                -5°
              </button>
              <span>Ángulo: {angle}°</span>
              <button onClick={() => changeAngle(5)} disabled={angle >= 90}>
                +5°
              </button>
            </div>
            <div className="controls">
              <button onClick={() => moveCanon(-5)} disabled={cannonPosition <= 0}>
                ← Atrás
              </button>
              <span>Posición del cañón: {cannonPosition}</span>
              <button onClick={() => moveCanon(5)} disabled={cannonPosition >= 30}>
                Adelante →
              </button>
            </div>
            <div className="controls">
              <div>
                <span>Lento: 14 m/s</span>
                <button onClick={() => changeVelocity('lento')} className={velocity === 'lento' ? 'active' : ''}>
                  Lento
                </button>
              </div>
              <div>
                <span>Medio: 22,5 m/s</span>
                <button onClick={() => changeVelocity('medio')} className={velocity === 'medio' ? 'active' : ''}>
                  Medio
                </button>
              </div>
              <div>
                <span>Rápido: 31.5 m/s</span>
                <button onClick={() => changeVelocity('rapido')} className={velocity === 'rapido' ? 'active' : ''}>
                  Rápido
                </button>
              </div>
            </div>
            <div className="controls">
              <button onClick={shoot} className="shoot-button">
                Disparar
              </button>
            </div>
            <div className="score">Puntuación: {score}</div>
            <button onClick={() => window.location.href = "/"} className="shoot-button">
                Regresar
              </button>
          </>
        )}
      </div>
      {!gameStarted && (
          <button onClick={startGame} className="start-button">
            Iniciar Juego
          </button>
        )}
    </div>
  );
};

export default ParabolicShot;

/* version con movimiento de la caja     
import React, { useState, useEffect, useRef } from 'react';
import './Juego3.css';

const ParabolicShot = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [angle, setAngle] = useState(45);
  const [score, setScore] = useState(0);
  const [targetPosition, setTargetPosition] = useState({ x: 0, y: 0 });
  const [velocity, setVelocity] = useState('medio');
  const [cannonPosition, setCannonPosition] = useState(0);
  const [refresh, setRefresh] = useState(0);
  const [shotCount, setShotCount] = useState(0);
  const canvasRef = useRef(null);

  const gravity = 9.8;
  const canvasWidth = 600;
  const canvasHeight = 300;
  const baseCannonX = 50;
  const cannonY = canvasHeight - 50;
  const maxDistance = 100;
  const scale = (canvasWidth - 100) / maxDistance;
  
  const velocities = {
    lento: 40,
    medio: 50,
    rapido: 70,
  };

  const targetSpeeds = {
    lento: 0.1,
    medio: 0.2,
    rapido: 0.3,
  };

  const targetHeights = [canvasHeight - 100, canvasHeight - 150, canvasHeight - 200];

  useEffect(() => {
    if (gameStarted) {
      const intervalId = setInterval(() => {
        moveTarget();
        drawGame();
      }, 16);
      return () => clearInterval(intervalId);
    } else {
      drawStartScreen();
    }
  }, [gameStarted, angle, targetPosition, velocity, cannonPosition, refresh]);

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setShotCount(0);
    setNewTarget();
  };

  const setNewTarget = () => {
    const randomHeight = targetHeights[Math.floor(Math.random() * targetHeights.length)];
    setTargetPosition({ x: 0, y: randomHeight });
  };

  const drawStartScreen = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.font = '30px Arial';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.fillText('Presiona "Iniciar Juego"', canvasWidth / 2, canvasHeight / 2);
  };

  const drawGame = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    ctx.beginPath();
    ctx.moveTo(0, cannonY);
    ctx.lineTo(canvasWidth, cannonY);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.stroke();

    const currentCannonX = baseCannonX + cannonPosition * scale;

    ctx.beginPath();
    ctx.moveTo(currentCannonX, cannonY);
    ctx.lineTo(
      currentCannonX + 30 * Math.cos((angle * Math.PI) / 180),
      cannonY - 30 * Math.sin((angle * Math.PI) / 180)
    );
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 5;
    ctx.stroke();

    const targetX = targetPosition.x * scale;
    ctx.fillStyle = 'green';
    ctx.fillRect(targetX - 10, targetPosition.y - 10, 20, 20);

    for (let i = 0; i <= maxDistance; i += 10) {
      const x = baseCannonX + i * scale;
      ctx.beginPath();
      ctx.moveTo(x, cannonY);
      ctx.lineTo(x, cannonY + 10);
      ctx.stroke();
      
      ctx.font = '10px Arial';
      ctx.fillStyle = 'black';
      ctx.textAlign = 'center';
      ctx.fillText(i.toString(), x, cannonY + 25);
    }
  };

  const moveTarget = () => {
    setTargetPosition((prevPosition) => {
      const newX = prevPosition.x + targetSpeeds[velocity];
      return { ...prevPosition, x: newX >= maxDistance ? 0 : newX };
    });
  };

  const shoot = () => {
    if (!gameStarted) return;

    setShotCount((prevCount) => prevCount + 1);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let t = 0;
    
    const animate = () => {
      drawGame();

      const currentCannonX = baseCannonX + cannonPosition * scale;
      const v = velocities[velocity];
      const x = currentCannonX + v * Math.cos((angle * Math.PI) / 180) * t;
      const y = cannonY - (v * Math.sin((angle * Math.PI) / 180) * t - 0.5 * gravity * t * t);

      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2 * Math.PI);
      ctx.fillStyle = 'red';
      ctx.fill();

      // Dibujar la sombra en el eje X e Y
      ctx.beginPath();
      ctx.arc(x, cannonY, 5, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(currentCannonX, y, 5, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fill();

      const targetX = targetPosition.x * scale;
      const targetY = targetPosition.y;

      if (Math.abs(x - targetX) < 15 && Math.abs(y - targetY) < 15) {
        let points = 0;
        if (velocity === 'lento') points = 3;
        else if (velocity === 'medio') points = 2;
        else if (velocity === 'rapido') points = 1;
        
        if (angle >= 45) points += 2;
        
        setScore((prevScore) => prevScore + points);
        setNewTarget();
        return;
      }

      if (x > canvasWidth || y > cannonY) {
        setScore((prevScore) => prevScore - 1);
        return;
      }

      t += 0.1;
      requestAnimationFrame(animate);
    };

    animate();
  };

  const changeAngle = (delta) => {
    if (!gameStarted) return;
    setAngle((prevAngle) => {
      const newAngle = prevAngle + delta;
      return Math.max(0, Math.min(90, newAngle));
    });
  };

  const moveCanon = (delta) => {
    if (!gameStarted) return;
    setCannonPosition((prevPosition) => {
      const newPosition = prevPosition + delta;
      return Math.max(0, Math.min(30, newPosition));
    });
  };

  const changeVelocity = (newVelocity) => {
    if (!gameStarted) return;
    setVelocity(newVelocity);
  };

  return (
    <div className="container">
      <div className="game-board">
        <h1>Juego de Lanzamiento Parabólico</h1>
        <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} className="game-canvas" />
        
        {gameStarted && (
          <>
            <div className="controls">
            <div className="controls">
              <button onClick={shoot}>Disparar</button>
            </div>
              <button onClick={() => changeAngle(-5)} disabled={angle <= 0}>
                -5°
              </button>
              <span>Ángulo: {angle}°</span>
              <button onClick={() => changeAngle(5)} disabled={angle >= 90}>
                +5°
              </button>
            </div>
            <div className="controls">
              <button onClick={() => moveCanon(-5)} disabled={cannonPosition <= 0}>
                ← Atrás
              </button>
              <span>Posición del cañón: {cannonPosition}</span>
              <button onClick={() => moveCanon(5)} disabled={cannonPosition >= 30}>
                Adelante →
              </button>
            </div>
            <div className="controls">
              <div>
                <span>Lento: 18.2 m/s</span>
                <button onClick={() => changeVelocity('lento')} className={velocity === 'lento' ? 'active' : ''}>
                  Lento
                </button>
              </div>
              <div>
                <span>Medio: 22.8 m/s</span>
                <button onClick={() => changeVelocity('medio')} className={velocity === 'medio' ? 'active' : ''}>
                  Medio
                </button>
              </div>
              <div>
                <span>Rápido: 31.8 m/s</span>
                <button onClick={() => changeVelocity('rapido')} className={velocity === 'rapido' ? 'active' : ''}>
                  Rápido
                </button>
              </div>
            </div>
            <div className="score">
              <p>Puntuación: {score}</p>
              <p>Disparos realizados: {shotCount}</p>
            </div>
          </>
        )}
        {!gameStarted && <button onClick={startGame} className="shoot-button">Iniciar Juego</button>}
      </div>
      <button onClick={() => window.location.href = "/"} className="shoot-button">
        Regresar
      </button>
    </div>
  );
};

export default ParabolicShot;

*/ 