import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {  
    return (
      <button
       className="square"
       onClick={props.onClick}
      >
        {props.value}
      </button>
    );
  }

class Board extends React.Component {

  renderSquare(i) {
    return(
            <Square value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}/>
          );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {
        history: [{
            squares: Array(9).fill(null),
        }],
        stepNumber: 0,
        position: null,
        xisNext: true,
    }
  }

   handleClick(i){
      /*slice() creates a copy of the existing squares Array*/
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      const position = i;
      /* Return if winner is found or square is already filled*/
      if (calcWinner(squares) || checkDraw(squares) || squares[i]){
        return;
      }
     squares[i] = this.state.xisNext?'X':'O';
     this.setState({
                    history: history.concat([{
                     squares: squares,
                    }]),
                    stepNumber: history.length,
                    position: position,
                    xisNext: !this.state.xisNext,
     });
  }

  jumpTo(step){
      this.setState({
          stepNumber: step,
          xisNext: (step % 2) ===0,
        });
  }

  render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calcWinner(current.squares);
      const draw = checkDraw(current.squares);
      /*Logic for to get row, col*/
      const position = this.state.position;
      const row = Math.floor(position / 3) + 1;
      const col = position % 3 + 1;
      /**/
      const stepNumber = this.state.stepNumber;

      /*logic for navigating history button*/
      const moves = history.map((step, move) => {

          const desc = move? 'Go to ('+ row + ',' + col + ')' :'Go to the start of the game';
          return (
              <li key={move}>
                  <button
                      className={move === stepNumber? 'move-list-item-selected': ''}
                      onClick={() => this.jumpTo(move)}>{desc}</button>
              </li>
          );
      });
      let status;
      if (winner){
          status = 'Winner is player:' + winner;
        }
        else if (draw){
            status = "It's a draw";
        }
        else {
          status = 'Next player:' + (this.state.xisNext?'X':'O');
        }
        return (
          <div className="game">
            <div className="game-board">
              <Board
                  squares={current.squares}
                  onClick={(i) => this.handleClick(i)}
              />
            </div>
            <div className="game-info">
              <div>{status}</div>
              <ol>{moves}</ol>
            </div>
          </div>
        );
  }
}


/* To check for winner*/
function calcWinner(squares){
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++){
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

/*Function to check for a draw*/
function checkDraw(squares){
    for (let i = 0; i < squares.length; i++){
        if (squares[i] === null) {
            return false;
        }
    }
    return true;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
