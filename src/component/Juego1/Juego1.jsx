import React, { useState, useEffect } from 'react';
import './Juego1.css';

const SistemaCoordenadas = ({ puntoX, puntoY, dibujarFlecha }) => {
  const size = Math.min(600); // Se ajusta al 80% del ancho de la pantalla o 600px máximo
  const margin = size * 0.1;
  const axisLength = size - 2 * margin;
  const scale = axisLength / 20;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <g transform={`translate(${size / 2}, ${size / 2})`}>
        {/* Ejes X y Y */}
        <line x1={-axisLength / 2} y1="0" x2={axisLength / 2} y2="0" stroke="black" strokeWidth="1.5" />
        <line x1="0" y1={axisLength / 2} x2="0" y2={-axisLength / 2} stroke="black" strokeWidth="1.5" />

        {/* Etiquetas de los ejes */}
        <text x={axisLength / 2 + 20} y="5" fontSize="20" textAnchor="start">X</text>
        <text x="5" y={-axisLength / 2 - 20} fontSize="20" textAnchor="start">Y</text>

        {/* Marcadores y etiquetas en los ejes */}
        {[-10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
          <React.Fragment key={i}>
            {/* Marcadores y etiquetas en el eje X */}
            <line x1={i * scale} y1="-5" x2={i * scale} y2="5" stroke="black" strokeWidth="1" />
            <text x={i * scale} y="25" fontSize="14" textAnchor="middle">{i}</text>
            {/* Marcadores y etiquetas en el eje Y */}
            <line y1={i * scale} x1="-5" y2={i * scale} x2="5" stroke="black" strokeWidth="1" />
            <text y={-i * scale} x="-25" fontSize="14" textAnchor="end" dominantBaseline="middle">{i}</text>
          </React.Fragment>
        ))}

        {/* Punto rojo en las coordenadas */}
        <circle cx={puntoX * scale} cy={-puntoY * scale} r="8" fill="red" />

        {/* Dibuja la flecha desde el origen hasta el punto */}
        {dibujarFlecha && (
          <line 
            x1="0" 
            y1="0" 
            x2={puntoX * scale} 
            y2={-puntoY * scale} 
            stroke="blue" 
            strokeWidth="2"
            markerEnd="url(#arrowhead)" // Marca la punta de la flecha
          />
        )}

        {/* Definición de la punta de la flecha */}
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="10"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="blue" />
          </marker>
        </defs>
      </g>
    </svg>
  );
};

const Juego1 = () => {
  const [puntoX, setPuntoX] = useState(0);
  const [puntoY, setPuntoY] = useState(0);
  const [intentoX, setIntentoX] = useState('');
  const [intentoY, setIntentoY] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [puntuacion, setPuntuacion] = useState(0);
  const [dibujarFlecha, setDibujarFlecha] = useState(false);

  const generarPuntoAleatorio = () => Math.floor(Math.random() * 21) - 10;

  const iniciarJuego = () => {
    setPuntoX(generarPuntoAleatorio());
    setPuntoY(generarPuntoAleatorio());
    setMensaje('');
    setIntentoX('');
    setIntentoY('');
    setDibujarFlecha(false); // Resetea el estado de la flecha
  };

  useEffect(() => {
    iniciarJuego();
  }, []);

  const verificarIntento = () => {
    const x = parseInt(intentoX, 10);
    const y = parseInt(intentoY, 10);

    if (x === puntoX && y === puntoY) {
      setMensaje('¡Felicidades! Has acertado.');
      setPuntuacion(puntuacion + 1);
      setTimeout(iniciarJuego, 2000);
    } else {
      setMensaje('Intenta de nuevo.');
    }
  };

  const handleDibujarFlecha = () => {
    setDibujarFlecha(true);
  };

  return (
    <div className="juego-container">
      <h1 className="juego-titulo">Juego de Coordenadas</h1>
      <div className="sistema-coordenadas">
        <SistemaCoordenadas puntoX={puntoX} puntoY={puntoY} dibujarFlecha={dibujarFlecha} />
      </div>
      <p className="descripcion">Ingresa las coordenadas del punto rojo:</p>
      <div className="ingreso-coordenadas">
        <input
          type="number"
          placeholder="X"
          value={intentoX}
          onChange={(e) => setIntentoX(e.target.value)}
          min={-10}
          max={10}
          className="input-coordenada"
        />
        <input
          type="number"
          placeholder="Y"
          value={intentoY}
          onChange={(e) => setIntentoY(e.target.value)}
          min={-10}
          max={10}
          className="input-coordenada"
        />
        <button onClick={verificarIntento} className="button-verificar">Verificar</button>
        <button onClick={handleDibujarFlecha} className="button-dibujar">Dibujar Flecha</button>
      </div>
      {mensaje && (
        <div className="alerta">
          <strong>Resultado:</strong> <span>{mensaje}</span>
        </div>
      )}
      <p className="puntuacion">Puntuación: {puntuacion}</p>
      <button onClick={() => window.location.href = "/"} className="shoot-button">
                Regresar
      </button>
    </div>
  );
};

export default Juego1;