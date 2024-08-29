import React, { useState, useEffect } from 'react';
import './Juego5.css';


const GameEvaluator = ({ balance1, balance2, isBalanced }) => {
  const [message, setMessage] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (balance1==balance2) {
      setMessage('¡Felicitaciones! El torque está equilibrado.');
      
    } else {
      setMessage('El torque no está equilibrado.');
      
    }
  }, [isBalanced]);

  return (
    <div className="evaluator-card">
      <h2 className="evaluator-title">Evaluación del Juego</h2>
      <div className="evaluator-content">
        <p className="font-semibold">Torque 1: {balance1.toFixed(2)}</p>
        <p className="font-semibold">Torque 2: {balance2.toFixed(2)}</p>
        <p className="font-semibold">{message}</p>
        {showConfetti && <Confetti />}
      </div>
    </div>
  );
};

export default function BalanceGame() {
  const [weights, setWeights] = useState([
    { mass: 0, position: -10 },
    { mass: 0, position: 10 },
    { mass: 2, position: 0 } // User weight starts at 0
  ]);
  const [balance1, setBalance1] = useState(0);
  const [balance2, setBalance2] = useState(0);
  const [isBalanced, setIsBalanced] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);

  const generateRandomWeight = () => {
    const mass = Math.floor(Math.random() * 3) + 1; // 1, 2, or 3
    const position = Math.floor(Math.random() * 21) - 10; // -10 to 10
    return { mass, position };
  };

  const startGame = () => {
    const newWeights = [
      generateRandomWeight(),
      generateRandomWeight(),
      { mass: 2, position: 0 } // User weight starts at 0
    ];
    setWeights(newWeights);
    setGameStarted(true);
    setIsBalanced(false);
    setRotation(0);
    setIsSimulating(false);
  };

  const resetGame = () => {
    setWeights([
      { mass: 0, position: -10 },
      { mass: 0, position: 10 },
      { mass: 2, position: 0 } // User weight starts at 0
    ]);
    setGameStarted(false);
    setIsBalanced(false);
    setRotation(0);
    setIsSimulating(false);
  };

  const calculateBalance = () => {
    let newBalance1 = 0;
    let newBalance2 = 0;

    weights.forEach(weight => {
      const torque = weight.mass * Math.abs(weight.position);
      if (weight.position < 0) {
        newBalance1 += torque;
      } else {
        newBalance2 += torque;
      }
    });

    setBalance1(newBalance1);
    setBalance2(newBalance2);

    if (newBalance1 > newBalance2) {
      setRotation(Math.max((newBalance2 - newBalance1) * 5 / 10, -45));
    } else if (newBalance1 < newBalance2) {
      setRotation(Math.min((newBalance2 - newBalance1) * 5 / 10, 45));
    } else {
      setRotation(0);
    }

    setIsBalanced(Math.abs(newBalance1 - newBalance2) < 10);
  };

  const startSimulation = () => {
    setIsSimulating(true);
  };

  useEffect(() => {
    if (isSimulating && !isBalanced) {
      const timer = setInterval(() => {
        calculateBalance();
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isSimulating, isBalanced]);

  const handlePositionChange = (event) => {
    const newPosition = parseInt(event.target.value, 10);
    setWeights(prevWeights => [
      ...prevWeights.slice(0, 2),
      { ...prevWeights[2], position: newPosition }
    ]);
  };

  const checkOverlappingWeights = () => {
    const weightPositions = weights.map(weight => weight.position);
    const uniquePositions = [...new Set(weightPositions)];

    if (uniquePositions.length < weights.length) {
      const overlappingWeight = uniquePositions.find(pos =>
        weightPositions.filter(position => position === pos).length > 1
      );
      if (overlappingWeight !== undefined) {
        return overlappingWeight;
      }
    }
    return null;
  };

  const getOverlappingWeightsSum = (position) => {
    return weights
      .filter(weight => weight.position === position)
      .reduce((sum, weight) => sum + weight.mass, 0);
  };

  return (
    <div className="container">
      <h1 className="title">Juego de Equilibrio</h1>
      <div className="button-group">
        <button onClick={startGame} disabled={gameStarted}>Iniciar Juego</button>
        <button onClick={resetGame}>Reiniciar Juego</button>
        {gameStarted && !isSimulating && (
          <button onClick={startSimulation}>Simular</button>
        )}
      </div>
      {gameStarted && (
        <div className="balance-beam-container">
          <div className="balance-beam" style={{ transform: `rotate(${rotation}deg)` }}>
            <div className="balance-marker" style={{ left: '50%' }}></div>
            {[...Array(21)].map((_, i) => (
              <div key={i} className="balance-marker" style={{ left: `${(i / 20) * 100}%` }}></div>
            ))}
            {[-10, -5, 0, 5, 10].map((num) => (
              <div key={num} className="balance-number" style={{ left: `${(num + 10) / 20 * 100}%` }}>
                {num}
              </div>
            ))}
            {weights.map((weight, index) => {
              const overlappingPosition = checkOverlappingWeights();
              const isOverlapping = overlappingPosition !== null && overlappingPosition === weight.position;
              const overlappingSum = isOverlapping ? getOverlappingWeightsSum(weight.position) : null;

              return (
                <div
                  key={index}
                  className={`weight ${index === 0 ? 'red' : index === 1 ? 'blue' : 'green'}`}
                  style={{ left: `${(weight.position + 9) / 20 * 100}%` }}
                >
                  {isOverlapping ? overlappingSum : weight.mass}
                </div>
              );
            })}
            <div className="triangle"></div> {/* Triángulo centrado */}
          </div>
          <div className="slider-container">
            <label htmlFor="position-slider">Posición de tu peso: {weights[2].position}</label>
            <input
              type="range"
              id="position-slider"
              min="-10"
              max="10"
              value={weights[2].position}
              onChange={handlePositionChange}
            />
          </div>
          <GameEvaluator
            balance1={balance1}
            balance2={balance2}
            isBalanced={isBalanced}
          />
        </div>
        
      )}
      
      <div className="button-group">
        <button onClick={() => window.location.href = "/"} >Regresar</button>
      </div>
      

    </div>
    
  );
}