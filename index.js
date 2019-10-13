
const print = console.log;

const container = document.getElementById('container');
const infoBox = document.getElementById('info-box');
const resetButton = document.getElementById('reset');


function initField(container, state, onCellClick) {
    const table = document.createElement('table');
    container.appendChild(table);
    const tBody = table.createTBody();
    const fieldRepr = [];

    for (let i = 0; i < 3; i++) {
        const tRow = document.createElement('tr');
        tBody.appendChild(tRow);
        fieldRepr[i] = [];
    
        for (let j = 0; j < 3; j++) {
            const data = state[i][j];
            const tData = document.createElement('td');
            if (onCellClick) {
                tData.addEventListener('click', onCellClick);
            }
            tData.dataset.y = j;
            tData.dataset.x = i;
            tData.innerText = game.playerRepr(data);
            tRow.appendChild(tData);
            fieldRepr[i][j] = tData;
        }
    }
    return fieldRepr;
}


function InputResult(player, type) {
    this.player = player;
    this.type = type;
}

InputResult.OK = 'OK';
InputResult.WIN = 'WIN';
InputResult.INGORED = 'INGORED';


const game = {
    currentPlayer: 1,
    field: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
    ],

    reset: function () {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                this.field[i][j] = 0;
            }
        }
        this.currentPlayer = 1;
    },
    togglePlayer: function () {
        // this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
        if (this.currentPlayer === 1) {
            this.currentPlayer = 2;
        } else {
            this.currentPlayer = 1;
        }
    },
    input: function (x, y) {
        const value = this.field[x][y];
        const current = this.currentPlayer;
        if (value === 0) {
            this.field[x][y] = current;
            if (this.calculateWinner()) {
                return new InputResult(this.field[x][y], InputResult.WIN);
            }
            this.togglePlayer();
            return new InputResult(this.field[x][y], InputResult.OK);
        }
        return new InputResult(this.field[x][y], InputResult.INGORED);
    },
    calculateWinner: function () {
        const rw = this._calculateRows()
        const cw = this._calculateColumns()
        const dw = this._calculateDiagonals();
        // print(rw, cw, dw)
        return rw || cw || dw;
    },
    _calculateRows: function () {
        for (let i = 0; i < 3; i++) {
            const firstValue = this.field[i][0];
            let isSamePlayer = true;
            for (let j = 1; j < 3; j++) {
                if (this.field[i][j] !== firstValue) {
                    isSamePlayer = false;
                    break;
                }
            }
            if (isSamePlayer && firstValue !== 0) {
                return firstValue;
            }
        }
    },
    _calculateColumns: function () {
        for (let i = 0; i < 3; i++) {
            const firstValue = this.field[0][i];
            let isSamePlayer = true;
            for (let j = 1; j < 3; j++) {
                if (this.field[j][i] !== firstValue) {
                    isSamePlayer = false;
                    break;
                }
            }
            if (isSamePlayer && firstValue !== 0) {
                return firstValue;
            }
        }
    },
    _calculateDiagonals: function () {

        // 0 0
        // 1 1
        // 2 2

        let firstValue = this.field[0][0];
        let isSamePlayer = true;
        for (let i = 1; i < 3; i++) {
            if (this.field[i][i] !== firstValue) {
                isSamePlayer = false;
                break;
            }
        }
        if (isSamePlayer && firstValue !== 0) {
            return firstValue;
        }

        // 2 0
        // 1 1
        // 0 2
        
        firstValue = this.field[2][0];
        isSamePlayer = true;
        for (let i = 1; i < 3; i++) {
            if (this.field[2-i][i] !== firstValue) {
                isSamePlayer = false;
                break;
            }
        }
        if (isSamePlayer && firstValue !== 0) {
            return firstValue;
        }
    }, 
    playerRepr: function (player = this.currentPlayer) {
        switch (player) {
            case 0: return '-';
            case 1: return 'x';
            case 2: return '0';
            default: return '?';
        }
    },
}


function onCellClick(e) {
    const el = e.target;
    // const {x, y} = el.dataset;
    const x = el.dataset.x, y = el.dataset.y;
    const inputResult = game.input(x, y);
    // print(x, y, '->', inputResult)
    const playerRepr = game.playerRepr(inputResult.player);
    el.innerText = playerRepr;
    if (inputResult.type === InputResult.WIN) {
        infoBox.innerHTML = playerRepr + ' WON!';
        infoBox.className = 'winner';
    } else if (inputResult.type === InputResult.OK) {
        infoBox.innerText = 'current: '+game.playerRepr(game.currentPlayer);
    } else {
        infoBox.innerText = game.playerRepr()+ ': wrong step!'
    }
    // print(game.field);
}


const fieldRepr = initField(container, game.field, onCellClick);

function reset() {
    game.reset();
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            fieldRepr[i][j].innerText = game.playerRepr(game.field[i][j]);
        }
    }
    infoBox.innerText = 'Tic Tac Toe';
    infoBox.className = '';
}
reset();

resetButton.addEventListener('click', reset);
