function Square(props) {
  return (
    props.win ?

    React.createElement("button", { style: { color: "green" }, className: "square", onClick: props.onClick },
    props.value) :


    React.createElement("button", { className: "square", onClick: props.onClick },
    props.value));


}

class Board extends React.Component {
  renderSquare(i) {
    return (
      React.createElement(Square, {
        key: i,
        value: this.props.squares[i],
        onClick: () => this.props.onClick(i),
        win: this.props.win[i] }));


  }

  createBoard() {
    let board = [];
    for (let i = 0; i < 3; i++) {
      let row = [];
      for (let j = 0; j < 3; j++) {
        row.push(this.renderSquare(i * 3 + j));
      }
      board.push(React.createElement("div", { className: "board-row", key: i }, row));
    }
    return board;
  }

  render() {
    return (
      React.createElement("div", null,
      this.createBoard()));


  }}


class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
      {
        squares: Array(9).fill(null) }],


      stepNumber: 0,
      xIsNext: true,
      posX: [null],
      posY: [null],
      order: false,
      win: Array(9).fill(false) };

  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    const posX = this.state.posX;
    const posY = this.state.posY;

    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
      {
        squares: squares }]),


      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      posX: posX.concat(Math.floor(i / 3)),
      posY: posY.concat(i % 3) });

  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0 });

  }

  changeOrder(i) {
    this.setState({
      order: !this.state.order });

  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
      'Go to move #' + move + ' (' + this.state.posX[move] + ', ' + this.state.posY[move] + ')' :
      'Go to game start';
      return (
        React.createElement("li", { key: move },
        move === this.state.stepNumber ?
        React.createElement("button", { onClick: () => this.jumpTo(move), style: { fontWeight: "bold" } }, desc) :
        React.createElement("button", { onClick: () => this.jumpTo(move) }, desc)));



    });

    this.state.order ? moves.reverse() : moves;

    let status;
    if (winner) {
      status = "Winner: " + (this.state.xIsNext ? "O" : "X");
      for (let i = 0; i < 3; i++) {
        this.state.win[winner[i]] = true;
      }
    } else if (!current.squares.includes(null)) {
      status = "Draw!";
      for (let i = 0; i < 9; i++) {
        this.state.win[i] = false;
      }
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
      for (let i = 0; i < 9; i++) {
        this.state.win[i] = false;
      }
    }

    let order = this.state.order ? "Ascending" : "Descending";

    return (
      React.createElement("div", { className: "game" },
      React.createElement("div", { className: "game-board" },
      React.createElement(Board, {
        squares: current.squares,
        onClick: i => this.handleClick(i),
        win: this.state.win })),


      React.createElement("div", { className: "game-info" },

      React.createElement("div", null, status),
      React.createElement("button", { onClick: i => this.changeOrder(i) }, order),
      React.createElement("ol", { reversed: this.state.order }, moves))));



  }}


// ======================================== 

ReactDOM.render(React.createElement(Game, null), document.getElementById("root"));

function calculateWinner(squares) {
  const lines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }
  return null;
}