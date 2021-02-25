import './App.css';
import React, { Component } from 'react';
import Snake from './Snake';
import Foods from './Food';


const SIZE_AREA = 20;
const SIZE_PIXELS = 600;
const SIZE_CELL = SIZE_PIXELS / SIZE_AREA;
const MAX_FOOD = 5;
const START_SPEED = 950;

const DIRECTION = {
  RIGHT: [0.1, 0],
  LEFT: [-0.1, 0],
  UP: [0, -0.1],
  DOWN: [0, 0.1]
}

const getRandomCoordinates = () => {
  let x = Math.floor((Math.random() * SIZE_AREA));
  let y = Math.floor((Math.random() * SIZE_AREA));
  return [x, y];
}

const getFoods = () => {
  let foods = [];
  for (let i = 0; i < MAX_FOOD; i++) {
    foods.push(getRandomCoordinates());
  }
  return foods;
}

const initialState = {
  foods: getFoods(),
  direction: DIRECTION.DOWN,
  speed: START_SPEED,
  snakeDots: [
    [0, 1],
    [0, 2],
    [0, 3]
  ],
  idInterval: null,
  settings: {
    borderCollisions: true
  }
}

class App extends Component {
  state = initialState;

  componentDidMount() {
    document.onkeydown = this.onKeyDown;
    this.init();
  }

  componentDidUpdate() {
    this.checkIfCollapse();
    this.checkIfEat();
  }

  init() {
    clearInterval(this.state.idInterval);
    this.setState(initialState);
    this.changeSpeed(this.state.speed);
  }

  onKeyDown = (e) => {
    e = e || window.event;
    switch (e.keyCode) {
      case 38:
        if (this.state.direction.toString() !== DIRECTION.DOWN.toString()) {
          this.setState({ direction: DIRECTION.UP });
        }
        break;
      case 40:
        if (this.state.direction.toString() !== DIRECTION.UP.toString()) {
          this.setState({ direction: DIRECTION.DOWN });
        }
        break;
      case 37:
        if (this.state.direction.toString() !== DIRECTION.RIGHT.toString()) {
          this.setState({ direction: DIRECTION.LEFT });
        }
        break;
      case 39:
        if (this.state.direction.toString() !== DIRECTION.LEFT.toString()) {
          this.setState({ direction: DIRECTION.RIGHT });
        }
        break;
    }
  }

  changeSpeed(speed) {
    this.setState({ speed: speed });
    clearInterval(this.state.idInterval);
    if (speed !== 0) {
      const newInterval = setInterval(this.moveSnake, 1000 - speed);
      this.setState({
        idInterval: newInterval
      });
    }
  }

  moveSnake = () => {
    let out = false;
    let dots = this.state.snakeDots.map( (elem) => {
      return [elem[0] + this.state.direction[0], elem[1] + this.state.direction[1]];
    })
    let head = dots[dots.length - 1];
    //head = [head[0] + this.state.direction[0], head[1] + this.state.direction[1]];

    [0, 1].forEach((i) => {
      let newValue;
      if (head[i] >= SIZE_AREA) {
        newValue = 0;
        out = true;
      }
      if (head[i] < 0) {
        newValue = SIZE_AREA - 1;
        out = true;
      }
      if (out) {
        head[i] = newValue;
      }
    });

    if (out && this.state.settings.borderCollisions) {
      this.onGameOver();
    } else {
      this.setState({
        //snakeDots: [...dots.slice(1), head]
        snakeDots: dots
      });
    }
  }

  checkIfCollapse() {
    const head = this.state.snakeDots[this.state.snakeDots.length - 1];
    const collapsed = this.state.snakeDots.slice(0, -1).some((elem) => {
      return elem[0] === head[0] && elem[1] === head[1];
    });
    if (collapsed) {
      this.onGameOver();
    }
  }

  checkIfEat() {
    let head = this.state.snakeDots[this.state.snakeDots.length - 1];
    this.state.foods.forEach((food, i) => {
      if (head[0] == food[0] && head[1] === food[1]) {
        this.removeFood(i);
        this.enlargeSnake();
        this.inceaseSpeed();
      }
    })
  }

  removeFood(i) {
    const newFoods = [...this.state.foods];
    newFoods.splice(i, 1);
    newFoods.push(getRandomCoordinates());
    this.setState({
      foods: newFoods
    });
  }

  enlargeSnake() {
    const newSnake = [...this.state.snakeDots];
    newSnake.unshift([])
    this.setState({
      snakeDots: newSnake
    });
  }

  inceaseSpeed() {
    if (this.state.speed < 950) {
      this.changeSpeed(this.state.speed + 10);
    }
  }

  onGameOver() {
    clearTimeout(this.state.idInterval);
    this.init();
    alert(`Game Over. Snake length is ${this.state.snakeDots.length}`);
  }

  gamePause = () => {
    this.changeSpeed(0);
  }

  gameResume = () => {
    this.changeSpeed(800);
  }

  changeBorderCollisions = () => {
    let settings = this.state.settings;
    settings.borderCollisions = !settings.borderCollisions;
    this.setState({
      settings: settings
    });
  }

  render() {
    let button;
    if (this.state.speed === 0) {
      button = <button onClick={this.gameResume}>Resume</button>
    } else {
      button = <button onClick={this.gamePause}>Stop</button>
    }
    return (
      <div className="game">
        <header className="game-header">
          SNAKE-GAME
      </header>
        <div>
          <div class="game-content">
            <div className="game-statistics">
              <div>
                <div>Speed: {this.state.speed}</div>
                <div>Size: {this.state.snakeDots.length}</div>
              </div>
            </div>
            <div className="game-area">
              <Snake snakeDots={this.state.snakeDots} size={SIZE_CELL} />
              <Foods foods={this.state.foods} size={SIZE_CELL} />
            </div>
            <div className="game-settings">
              <div>
                <span>Border collisions&nbsp;</span>
                <input type="checkbox" onChange={this.changeBorderCollisions} checked={this.state.settings.borderCollisions} />
              </div>
            </div>
          </div>
        </div>
        <div className="game-footer">
          {button}

        </div>
      </div>
    )
  };
}


export default App;
