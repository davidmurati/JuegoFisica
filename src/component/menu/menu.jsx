import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './menu.css';
import imagen1 from './Fisikids.jpg';
import imagen2 from './fisicaImagen.png';
import Footer from '../Footer/Footer';


const Menu = () => {
  const history = useHistory();
  const [selectedLink, setSelectedLink] = useState('');

  const navigateToGame = (game) => {
    history.push(`/${game}`);
  };

  const handleSelectChange = (e) => {
    setSelectedLink(e.target.value);
  };

  const handleLinkNavigation = () => {
    if (selectedLink) {
      window.location.href = selectedLink;  // Navegar en la misma página
    }
  };

  const cards3 = [
    {
        id: 1,
        title: "¡Bienvenido!",
        text: "¡Bienvenido a nuestra página de ejercicios funcionales! Estamos emocionados de que te unas a nosotros en este viaje hacia un estilo de vida más activo y saludable. Aunque estamos en nuestros primeros pasos, hemos creado esta plataforma con el objetivo de ayudarte a moverte más, a sentirte mejor, y a empezar a construir un hábito de ejercicio regular.",
       
        image: imagen1,
    },
    
    {
        id: 2,
        title: "Pez Argento en character.ai",
        text: (
            <>
                ¿Algo te incomoda y quieres hablar? Habla con el Pez Argento, amigo de Coraje. Seguro te dará un gran consejo. Puedes hablar con él en este enlace:{" "}
                <a href="https://character.ai/chat/qfT15B9lrHeRHYN0eK0dLKMPwc4d6qLV0AH8yDJh3-A" target="_blank" rel="noopener noreferrer">
                    Pez Argento en character.ai
                </a>.
            </>
        ),
        image: imagen1,
    },
];

  return (
    <div className="menu-container">

      <div className="heater-container">
      <h1 className="menu-title">Físikids</h1>
            </div>
            <img src={imagen1} className="App-logo" alt="logo" />

      <div className="game-options">
        <button className="game-button" onClick={() => window.location.href = "/Juego1"}>
          Diagrama de coordenadas
        </button>
        <button className="game-button" onClick={() => window.location.href = "/Juego2"}>
          Movimiento rectilíneo
        </button>
        <button className="game-button" onClick={() => window.location.href = "/Juego3"}>
          Lanzamiento parabólico
        </button>
        <button className="game-button" onClick={() => window.location.href = "/Juego4"}>
          Dinámica Caja Horizontal
        </button>
        <button className="game-button" onClick={() => window.location.href = "/Juego5"}>
          Balancín neón
        </button>

        <div className="menu-container">
        <img src={imagen2} className="App-logo" alt="logo" />
          <h2>Simuladores externos</h2>
          <select value={selectedLink} onChange={handleSelectChange}>
            <option value="">Selecciona un tema:</option>
            <option value="https://www.educaplus.org/game/distancia-y-desplazamiento">Distancia y desplazamiento</option>
            <option value="https://www.educaplus.org/game/mru-grafica-a-t">Movimiento rectilíneo constante</option>
            <option value="https://www.educaplus.org/game/mrua-grafica-a-t">Movimiento rectilíneo acelerado</option>
            <option value="https://www.educaplus.org/game/laboratorio-de-movimiento-rectilineo">Laboratorio de movimiento rectilíneo</option>
            <option value="https://www.educaplus.org/game/laboratorio-virtual-de-cinematica">Laboratorio virtual de cinemática</option>
            <option value="https://www.educaplus.org/game/grafica-v-t">Movimiento rectilíneo uniforme (Velocidad/Tiempo)</option>
            <option value="https://phet.colorado.edu/sims/html/projectile-motion/latest/projectile-motion_all.html?locale=es">Lanzamiento parabólico</option>
            <option value="https://www.educaplus.org/game/sistema-de-referencia">Marco de referencia</option>
            <option value="https://www.educaplus.org/game/graficas-de-la-caida-libre">Caída libre</option>
            <option value="https://www.educaplus.org/game/alcance-y-altura-maxima">Lanzamiento parabólico (Alcance y altura)</option>
            <option value="https://www.educaplus.org/game/primera-y-segunda-leyes-de-newton">Primera y segunda ley de Newton</option>
            <option value="https://www.educaplus.org/game/plano-inclinado-con-rozamiento">Fuerza y fricción en plano inclinado</option>
            <option value="https://www.educaplus.org/game/descomposicion-del-peso-en-un-plano-inclinado">Fuerza (descomposición del peso en un plano inclinado)</option>
            <option value="https://www.educaplus.org/game/cantidad-de-movimiento">Cantidad de movimiento</option>
            <option value="https://www.educaplus.org/game/ley-de-hooke-v2">Ley de Hooke</option>
            <option value="https://www.educaplus.org/game/ejercicio-de-dinamica-4">Ejercicio de polea 1</option>
            <option value="https://www.educaplus.org/game/dinamica-del-columpio">Tensión en columpio</option>
            <option value="https://www.educaplus.org/game/fuerzas-en-el-giro-de-un-coche">Fuerza en movimiento circular</option>
            <option value="https://www.educaplus.org/game/ejercicio-de-dinamica-1">Ejercicio de polea 2</option>
            <option value="https://www.educaplus.org/game/condicion-de-equilibrio-en-el-balancin">Torque</option>
            <option value="https://www.educaplus.org/game/impulso-mecanico">Impulso</option>
            <option value="https://www.educaplus.org/game/laboratorio-de-choques-frontales">Choque</option>
            <option value="https://phet.colorado.edu/es/simulations/states-of-matter">Estado de la materia</option>
            <option value="https://phet.colorado.edu/sims/html/gas-properties/latest/gas-properties_all.html?locale=es">Propiedades de los gases</option>
            <option value="https://phet.colorado.edu/sims/html/concentration/latest/concentration_all.html?locale=es">Chorro de agua</option>
            <option value="https://phet.colorado.edu/sims/html/density/latest/density_all.html?locale=es">Densidad 1</option>
            <option value="https://www.educaplus.org/game/principio-de-arquimedes">Densidad 2</option>
            <option value="https://www.educaplus.org/game/principio-de-pascal">Principio de Pascal</option>
            <option value="https://app.physion.net/">Mecánica</option>
          </select>
          <button className="game-button" onClick={handleLinkNavigation}>Ir al enlace</button>
        </div>
        <Footer />
      </div>
    </div>
    
  );
};

export default Menu;
