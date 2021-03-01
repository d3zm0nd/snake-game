import './App.css';
import React, { Component } from 'react';
import Snake from './Snake';
import { Foods, generateFoods } from './Food';
import Background from './Background';
import Settings from './Settings'
import Statistics from './Statistics';


const SIZE_PIXELS = 600;
const START_SPEED = 800;
const MAX_SPEED = 900;
const DEFAULT_SIZE_AREA = 15;
const DEFAULT_SNAKE_POSITION = [
  [3, 1],
  [3, 2],
  [3, 3]
];
const DIRECTION = {
  RIGHT: [1, 0],
  LEFT: [-1, 0],
  UP: [0, -1],
  DOWN: [0, 1]
}

class App extends Component {

  constructor(props) {
    super(props);
    this.state = this.getInitialState();
    this.needToChangeDrirection = '';
  }

  getInitialState = () => {
    const borderCollisions = localStorage.getItem('borderCollisions') === 'true';
    const selfCollisions = localStorage.getItem('selfCollisions') === 'true';
    const countFood = parseInt(localStorage.getItem('countFood'), 10) || 1;
    const sizeArea = parseInt(localStorage.getItem('sizeArea'), 10) || DEFAULT_SIZE_AREA;

    return {
      direction: DIRECTION.DOWN,
      speed: 0,
      snakeDots: DEFAULT_SNAKE_POSITION,
      idInterval: null,
      settings: {
        borderCollisions,
        selfCollisions,
        countFood,
        sizeArea
      },
      foods: generateFoods(countFood, sizeArea, DEFAULT_SNAKE_POSITION),
    }
  }

  componentDidMount() {
    document.onkeydown = this.onKeyDown;
    this.init();
  }

  componentDidUpdate() {
    this.checkIfCollapse();
    this.checkIfEat();
  }

  init() {
    this._speed = 0;
    clearInterval(this.state.idInterval); 
    this.setState(this.getInitialState());
    this.changeSpeed(this.state.speed);
  }

  onKeyDown = (e) => {
    e = e || window.event;
    switch (e.keyCode) {
      case 38:
        if (this.state.direction.toString() !== DIRECTION.DOWN.toString()) {
          this.needToChangeDrirection =  DIRECTION.UP;
        }
        break;
      case 40:
        if (this.state.direction.toString() !== DIRECTION.UP.toString()) {
          this.needToChangeDrirection =  DIRECTION.DOWN;
        }
        break;
      case 37:
        if (this.state.direction.toString() !== DIRECTION.RIGHT.toString()) {
          this.needToChangeDrirection =  DIRECTION.LEFT;
        }
        break;
      case 39:
        if (this.state.direction.toString() !== DIRECTION.LEFT.toString()) {
          this.needToChangeDrirection =  DIRECTION.RIGHT;
        }
        break;
      case 32:
        if (this.state.speed) {
          this.gamePause();
        } else {
          this.gameResume();
        }
        break;
      default:
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
    let outOfBorder = false;
    let dots = [...this.state.snakeDots];
    let head = dots[dots.length - 1];

    if(this.needToChangeDrirection){
      this.setState({ direction: this.needToChangeDrirection });
      this.needToChangeDrirection = null;
    }

    head = [head[0] + this.state.direction[0], head[1] + this.state.direction[1]];

    [0, 1].forEach((i) => {
      if (head[i] >= this.state.settings.sizeArea) {
        outOfBorder = true;
        head[i] = 0;
      }
      if (head[i] < 0) {
        head[i] = this.state.settings.sizeArea - 1;
        outOfBorder = true;
      }
    });

    if (outOfBorder && this.state.settings.borderCollisions) {
      this.onGameOver();
    } else {
      this.setState({
        snakeDots: [...dots.slice(1), head]
      });
    }
  }

  checkIfCollapse() {
    if (this.state.settings.selfCollisions) {
      const head = this.state.snakeDots[this.state.snakeDots.length - 1];
      const collapsed = this.state.snakeDots.slice(0, -1).some((elem) => {
        return elem[0] === head[0] && elem[1] === head[1];
      });
      if (collapsed) {
        this.onGameOver();
      }
    }
  }

  checkIfEat() {
    let head = this.state.snakeDots[this.state.snakeDots.length - 1];
    this.state.foods.forEach((food, i) => {
      if (head[0] === food.coordinates[0] && head[1] === food.coordinates[1]) {
        this.removeFood(i);
        this.enlargeSnake();
        this.inceaseSpeed();
      }
    })
  }

  removeFood(i) {
    let newFoods = [...this.state.foods];
    newFoods.splice(i, 1);
    newFoods = newFoods.concat(generateFoods(this.state.settings.countFood - newFoods.length, this.state.settings.sizeArea, this.state.snakeDots));
    this.setState({
      foods: newFoods
    });
  }

  enlargeSnake() {
    const newSnake = [...this.state.snakeDots];
    newSnake.unshift([null, null]);
    this.setState({
      snakeDots: newSnake
    });
  }

  inceaseSpeed() {
    if (this.state.speed < MAX_SPEED) {
      this.changeSpeed(this.state.speed + 5);
    }
  }

  onGameOver() {
    alert(`Game Over. Snake length is ${this.state.snakeDots.length}`);
    this.newGame();
  }

  newGame() {
    clearTimeout(this.state.idInterval);
    this.init();
  }

  gamePause = () => {
    this._speed = this.state.speed;
    this.changeSpeed(0);
  }

  gameResume = () => {
    this.changeSpeed(this._speed || START_SPEED);
  }

  onChangeSettings = (field, value) => {
    let settings = this.state.settings;
    settings[field] = value
    localStorage.setItem(field, value);
    this.setState({
      settings
    });
    this.afterChangeSetting(field, value);
  }

  afterChangeSetting = (field, value) => {
    switch (field) {
      case 'sizeArea': this.newGame(); break;
      case 'countFood': this.setState({foods:generateFoods(value, this.state.settings.sizeArea, this.state.snakeDots)}); break;
      default: break;
    }
  }

  render() {
    let button;
    let SIZE_CELL = SIZE_PIXELS / this.state.settings.sizeArea;
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
            <Statistics size={this.state.snakeDots.length} speed={this.state.speed} />
            <div className="game-area">
              <Background sizeCell={SIZE_CELL} sizeArea={this.state.settings.sizeArea} />
              <Snake snakeDots={this.state.snakeDots} size={SIZE_CELL} />
              <Foods foods={this.state.foods} size={SIZE_CELL} />
            </div>
            <Settings settings={this.state.settings} onChange={this.onChangeSettings} />
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
