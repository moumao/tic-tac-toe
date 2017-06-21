import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    if (props.highlight) {
        return (
            <button className="square" onClick={() => props.onClick()} style={{color: "red"}}>
                {props.value}
            </button>
        );
    }else {
        return (
            <button className="square" onClick={() => props.onClick()}>
                {props.value}
            </button>
        );
    }
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                key={i}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
                highlight={this.props.winnerLine.includes(i)}
            />
        );
    }

    render() {
        let rows = [];
        for (let i=0; i<3 ; i++){
            let row = [];
            for (let j=3*i; j<3*i+3;j++){
                row.push(this.renderSquare(j));
            }
            rows.push(<div className="board=row" key={i}>{row}</div>)
        }
        return (
            <div>
                {rows}
            </div>
        );
    }
}

class Game extends React.Component {

    constructor() {
        super();
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
            xy: [],
        };
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) ? false : true,
        });
        const lis = document.getElementsByTagName("a")
        for (let v in lis){
            if (step == v){
                lis[v].classList.add("red")
            }else {
                if (lis[v].className == 'red'){
                    lis[v].classList.remove("red")
                }
            }
        }
        //console.log(lis)
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        const steps = [
            [1,1],[1,2],[1,3],
            [2,1],[2,2],[2,3],
            [3,1],[3,2],[3,3],
        ]
        const xy = this.state.xy.slice(0, this.state.stepNumber);
        xy.push(steps[i]);
        if (calculateWinner(squares).winner || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
            xy:xy,
        });
        const lis = document.getElementsByTagName("a")
        for (let v in lis){
            if (lis[v].className  == 'red'){
                lis[v].classList.remove("red")
            }
        }
    }

    render() {

        const history = this.state.history;
        const xy = this.state.xy;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares).winner;
        const winnerLine = calculateWinner(current.squares).line;

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        const moves = history.map((step, move) => {
            const desc = move ? `Move # ${xy[move-1]}` : 'Game start';
            if (history.length === move+1){
                return (
                    <li key={move} >
                        <a href="#" className="red"  onClick={() => this.jumpTo(move)}>{desc}</a>
                    </li>
                );
            }else {
                return (
                    <li key={move} >
                        <a href="#"  onClick={() => this.jumpTo(move)}>{desc}</a>
                    </li>
                );
            }
        });

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                        winnerLine={winnerLine}
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

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

//判断是否获胜函数
function calculateWinner(squares) {
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
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return {winner:squares[a], line:[a, b, c]};
        }
    }
    return {winner:null,line:[]};
}