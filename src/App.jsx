import { useState, useEffect  } from 'react'
import './App.css'
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Switch  } from "react-router-dom";
import Juego from "./component/menu/menu";
import Juego1 from "./component/Juego1/Juego1";
import Juego2 from "./component/Juego2/Juego2";
import Juego3 from "./component/Juego3/Juego3";
import Juego4 from "./component/Juego4/Juego4";


function App() {
  
  return (
    <div className="container">
    <Router>
     <Switch>
        <Route exact path="/">
          <Juego />
        </Route>
        <Route exact path="/Juego1">
          <Juego1 />
        </Route>
        <Route exact path="/Juego2">
          <Juego2 />
        </Route>
        <Route exact path="/Juego3">
          <Juego3 />
        </Route>
        <Route exact path="/Juego4">
          <Juego4 />
        </Route>
     </Switch>
     </Router>
    </div>
  )
}

export default App
