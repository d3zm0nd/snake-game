import './App.css';
import React, { Component, useState } from 'react';
import Snake from './Snake';
import Foods from './Food';
import Background from './Background';

const SIZE_AREA = 10;
const SIZE_PIXELS = 600;
const MAX_FOOD = 5;
const START_SPEED = 800;
const MAX_SPEED = 900;

const DIRECTION = {
  RIGHT: [1, 0],
  LEFT: [-1, 0],
  UP: [0, -1],
  DOWN: [0, 1]
}

const getRandomCoordinates = (sizeArea) => {
  let x = Math.floor((Math.random() * sizeArea));
  let y = Math.floor((Math.random() * sizeArea));
  return [x, y];
}

const getFoods = (count, sizeArea) => {
  let foods = [];
  for (let i = 0; i < count; i++) {
    foods.push(getRandomCoordinates(sizeArea));
  }
  return foods;
}

class App extends Component {

  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState = () => {
    const borderCollisions = localStorage.getItem('borderCollisions') === 'true';
    const selfCollisions = localStorage.getItem('selfCollisions') === 'true';
    const countFood = parseInt(localStorage.getItem('countFood'), 10) || 1;
    const sizeArea = parseInt(localStorage.getItem('sizeArea'), 10) || SIZE_AREA;

    return {
      direction: DIRECTION.DOWN,
      speed: 0,
      snakeDots: [
        [3, 1],
        [3, 2],
        [3, 3]
      ],
      idInterval: null,
      settings: {
        borderCollisions,
        selfCollisions,
        countFood,
        sizeArea
      },
      foods: getFoods(countFood, sizeArea),
    }
  }


  componentDidMount() {
    document.onkeydown = this.onKeyDown;
    this.init();
  }

  componentDidUpdate() {
    if (this.state.settings.selfCollisions) {
      this.checkIfCollapse();
    }
    this.checkIfEat();
  }

  init() {
    clearInterval(this.state.idInterval);
    this.setState(this.getInitialState());
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
      case 27:
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

    if (isNaN(head[0]) || isNaN(head[1])) {
      debugger;
    }

    if (outOfBorder && this.state.settings.borderCollisions) {
      this.onGameOver();
    } else {
      this.setState({
        snakeDots: [...dots.slice(1), head]
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
      if (head[0] === food[0] && head[1] === food[1]) {
        this.removeFood(i);
        this.enlargeSnake();
        this.inceaseSpeed();
      }
    })
  }

  removeFood(i) {
    const newFoods = [...this.state.foods];
    newFoods.splice(i, 1);
    while (newFoods.length < this.state.settings.countFood) {
      newFoods.push(getRandomCoordinates(this.state.settings.sizeArea));
    }
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
    if (this.state.speed < MAX_SPEED) {
      this.changeSpeed(this.state.speed + 10);
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

  changeBorderCollisions = () => {
    let settings = this.state.settings;
    settings.borderCollisions = !settings.borderCollisions;
    localStorage.setItem('borderCollisions', settings.borderCollisions);
    this.setState({
      settings: settings
    });
  }

  changeSelfCollisions = () => {
    let settings = this.state.settings;
    settings.selfCollisions = !settings.selfCollisions;
    localStorage.setItem('selfCollisions', settings.selfCollisions);
    this.setState({
      settings: settings
    });
  }

  changeCountFood = (ev) => {
    let settings = this.state.settings;
    settings.countFood = parseInt(ev.target.value, 10);
    localStorage.setItem('countFood', settings.countFood);
    const newFoods = getFoods(settings.countFood, settings.sizeArea);
    this.setState({
      foods: newFoods,
      settings: settings
    });
  }

  changeSizeArea = (ev) => {
    let settings = this.state.settings;
    settings.sizeArea = parseInt(ev.target.value, 10);
    localStorage.setItem('sizeArea', settings.sizeArea);
    this.setState({
      settings: settings
    });
    this.newGame();
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
            <div className="game-statistics">
              <div>
                <div>Speed: {this.state.speed}</div>
                <div>Size: {this.state.snakeDots.length}</div>
              </div>
            </div>
            <div className="game-area">
              <Background sizeCell={SIZE_CELL} sizeArea={this.state.settings.sizeArea} />
              <Snake snakeDots={this.state.snakeDots} size={SIZE_CELL} />
              <Foods foods={this.state.foods} size={SIZE_CELL} />
            </div>
            <div className="game-settings">
              <div>
                <span>Border collisions&nbsp;</span>
                <input type="checkbox" onChange={this.changeBorderCollisions} checked={this.state.settings.borderCollisions} />
              </div>
              <div>
                <span>Self collisions&nbsp;</span>
                <input type="checkbox" onChange={this.changeSelfCollisions} checked={this.state.settings.selfCollisions} />
              </div>
              <div>
                <span>Count food&nbsp;</span>
                <select value={this.state.settings.countFood} onChange={this.changeCountFood}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </div>
              <div>
                <span>Size game area&nbsp;</span>
                <select value={this.state.settings.sizeArea} onChange={this.changeSizeArea}>
                  <option value="20">20x20</option>
                  <option value="30">30x30</option>
                  <option value="40">40x40</option>
                </select>
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
