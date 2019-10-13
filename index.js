
const print = console.log;

const container = document.getElementById('container');
const infoBox = document.getElementById('info-box');
const resetButton = document.getElementById('reset');

function dataToRepr(value) {
    switch (value) {
        case 0: return '-';
        case 1: return 'x';
        case 2: return '0';
        default: return '?';
    }
}

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
            tData.innerText = dataToRepr(data);
            tRow.appendChild(tData);
            fieldRepr[i][j] = tData;
        }
    }
    return fieldRepr;
}


function InputResult(player, win) {
    this.player = player;
    this.win = win;
}


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
                return new InputResult(this.field[x][y], true);
            }
            this.togglePlayer();
        }
        return new InputResult(this.field[x][y], false);
    },
    calculateWinner: function () {
        return this._calculateRows() || this._calculateColumns() || this._calculateDiagonals();
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
        
        firstValue = this.field[2][0];
        isSamePlayer = true;
        for (let i = 2; i < 0; i--) {
            if (this.field[i][i] !== firstValue) {
                isSamePlayer = false;
                break;
            }
        }
        if (isSamePlayer && firstValue !== 0) {
            return firstValue;
        }
    }, 
}


function onCellClick(e) {
    const el = e.target;
    // const {x, y} = el.dataset;
    const x = el.dataset.x, y = el.dataset.y;
    // print(x, y);
    const inputResult = game.input(x, y);
    const playerRepr = dataToRepr(inputResult.player);
    el.innerText = playerRepr;
    if (inputResult.win) {
        infoBox.innerHTML = playerRepr + ' WON!';
        infoBox.className = 'winner';
    } else {
        infoBox.innerText = 'current: '+dataToRepr(game.currentPlayer);
    }
    print(game.field);
}


const fieldRepr = initField(container, game.field, onCellClick);

function reset() {
    game.reset();
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            fieldRepr[i][j].innerText = dataToRepr(game.field[i][j]);
        }
    }
    infoBox.innerText = 'current: '+dataToRepr(game.currentPlayer);
    infoBox.className = '';
}
reset();

resetButton.addEventListener('click', reset);
