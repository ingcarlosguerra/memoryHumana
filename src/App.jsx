import React, { Component } from 'react';
import construirBaraja from './utils/construirBaraja';
import Tablero from './components/Tablero';
import Header from './components/Header';

const getEstadoInicial = () => {
  const baraja = construirBaraja();
  return {
    baraja,
    parejaSeleccionada: [],
    estaComparando: false,
    numeroDeIntentos: 0    
  };
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...getEstadoInicial(),
      nombre: '',
      correo: '',
      registrado: false,
    };
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleRegistro = () => {
    if (this.state.nombre && this.state.correo) {
      this.setState({ registrado: true });
    } else {
      alert("Por favor, completa todos los campos");
    }
  };

  seleccionarCarta(carta) {
    if (
      this.state.estaComparando ||
      this.state.parejaSeleccionada.indexOf(carta) > -1 ||
      carta.fueAdivinada
    ) {
      return;
    }

    const parejaSeleccionada = [...this.state.parejaSeleccionada, carta];
    this.setState({
      parejaSeleccionada
    });

    if (parejaSeleccionada.length === 2) {
      this.compararPareja(parejaSeleccionada);
    }
  }

  compararPareja(parejaSeleccionada) {
    this.setState({estaComparando: true});

    setTimeout(() => {
      const [primeraCarta, segundaCarta] = parejaSeleccionada;
      let baraja = this.state.baraja;

      if (this.esPareja(primeraCarta, segundaCarta)) {
        baraja = baraja.map((carta) => {
          if (!this.esPareja(carta, primeraCarta)) {
            return carta;
          }

          return {...carta, fueAdivinada: true};
        });
      }

      this.verificarSiHayGanador(baraja);
      this.setState({
        parejaSeleccionada: [],
        baraja,
        estaComparando: false,
        numeroDeIntentos: this.state.numeroDeIntentos + 1
      })
    }, 1000)
  }

  esPareja(carta1, carta2) {
    const nombreCarta1 = carta1.icono.split("/")[1].split("-")[0];
    const nombreCarta2 = carta2.icono.split("/")[1].split("-")[0];
    return nombreCarta1 === nombreCarta2;
  }

  verificarSiHayGanador(baraja) {
    if (
      baraja.filter((carta) => !carta.fueAdivinada).length === 0
    ) {
      alert(`Ganaste en ${this.state.numeroDeIntentos} intentos!`);
    }
  }

  resetearPartida() {
    this.setState(
      getEstadoInicial()
    );
  }

  render() {
    if (!this.state.registrado) {
      return (
        <div className="registro">
          <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet"/>
          <h1 className="titulo">Registro</h1>
          <form>
            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={this.state.nombre}
              onChange={this.handleChange}
            />
            <input
              type="email"
              name="correo"
              placeholder="Correo"
              value={this.state.correo}
              onChange={this.handleChange}
            />
            <button type="button" onClick={this.handleRegistro}>Siguiente</button>
          </form>
        </div>
      );
    }

    return (
      <div className="App">
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet"/>
        <Header
          numeroDeIntentos={this.state.numeroDeIntentos}
          resetearPartida={() => this.resetearPartida()}
        />
        <Tablero 
          baraja={this.state.baraja}
          parejaSeleccionada={this.state.parejaSeleccionada}
          seleccionarCarta={(carta) => this.seleccionarCarta(carta)}
        />
      </div>
    );
  }
}

export default App;
