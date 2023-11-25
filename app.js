const BOARD = [
    [0, 2, 0, 2, 0, 2, 0, 2],
    [2, 0, 2, 0, 2, 0, 2, 0],
    [0, 2, 0, 2, 0, 2, 0, 2],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0]
];

const playWithBot = true;
const FIRST_PLAYER = 1;
const SECOND_PLAYER = 2;
let whitePlayerScore = 0;
let blackPlayerScore = 0;
const currentDatas = {
    currentPlayer: undefined,
    oppositePlayer: undefined,
    selectPiece: undefined,
    selectCell: undefined,
    selectCellID: [],
    king: false,
    avaliableCells: []
}


//UI
let pieces;
const cells = document.querySelectorAll('.cell');
const currentPlayeElement = document.querySelector('.currentPlayer');
const whiteScoreElement = document.querySelector('#white-score');
const blackScoreElement = document.querySelector('#black-score');
const winningBoxElement = document.querySelector('.winning-box');
const winningTextElement = document.querySelector('.winning-text');

const placePieces = () => {
    BOARD.forEach((row, rowIndex) => {
        row.forEach((col, colIndex) => {
            const cellID = `${colIndex}${rowIndex}`;
            const cell = document.getElementById(cellID);
            if (col === 1) cell.innerHTML = "<div class='piece piece1' data-king='0'></div>";
            if (col === 2) cell.innerHTML = "<div class='piece piece2' data-king='0'></div>";
        })
    })
}

const init = () => {
    placePieces();
    pieces = document.querySelectorAll('.piece');
    currentDatas.currentPlayer = FIRST_PLAYER;
    currentDatas.oppositePlayer = SECOND_PLAYER;
    currentPlayeElement.innerText = currentDatas.currentPlayer === 1 ?
        'Black Turn!' : 'White Turn!';
    whiteScoreElement.innerHTML = `<span>${whitePlayerScore}</span>`;
    blackScoreElement.innerHTML = `<span>${blackPlayerScore}</span>`;
}

const switchTurn = () => {
    if (currentDatas.currentPlayer === 1) {
        currentDatas.currentPlayer = 2;
        currentDatas.oppositePlayer = 1;
    } else {
        currentDatas.currentPlayer = 1;
        currentDatas.oppositePlayer = 2;
    }
    currentPlayeElement.innerText = currentDatas.currentPlayer === 1 ?
        'Black Turn!' : 'White Turn!';
}

const addDatasToAvailableCells = () => {
    if (currentDatas.selectCell != null)
        currentDatas.selectCell.classList.add('select');
    currentDatas.avaliableCells.forEach(availableCell => {
        availableCell.classList.add('active');
        availableCell.addEventListener('click', movePiece);
    })
}

const removeDatasToAvailableCells = () => {
    if (currentDatas.selectCell != null)
        currentDatas.selectCell.classList.remove('select');
    currentDatas.avaliableCells.forEach(availableCell => {
        availableCell.classList.remove('active');
        availableCell.removeEventListener('click', movePiece);
    })
}

const getAvailableCells = (currentPiece, currentPlayer, oppositePlayer) => {
    const availableCells = [];
    const nextRows = [];

    const currentCell = currentPiece.parentElement;
    const currentID = currentCell.id.split("");
    const currentRow = Number(currentID[1]);
    const currentCol = Number(currentID[0]);
    const isKing = currentPiece.dataset.king == 1 ? true : false;
    if (isKing) {
        nextRows.push(currentRow - 1, currentRow + 1);
    } else {
        if (currentPlayer === 1) {
            nextRows.push(currentRow - 1);
        } else if (currentPlayer === 2) {
            nextRows.push(currentRow + 1);
        }
    }

    nextRows.forEach(row => {
        const nextLeftCol = currentCol - 1;
        const nextRightCol = currentCol + 1;

        //left
        if (BOARD[row] != null && BOARD[row][nextLeftCol] === 0) {
            const availableCellID = nextLeftCol + "" + row;
            const availableCell = document.getElementById(availableCellID);
            availableCells.push(availableCell);
        } else if (BOARD[row] != null && BOARD[row][nextLeftCol] === oppositePlayer) {
            const nextLeftCol1 = nextLeftCol - 1;
            const nextRow = row - currentRow === -1 ?
                currentRow - 2 : currentRow + 2;
            if (BOARD[nextRow] != null && BOARD[nextRow][nextLeftCol1] === 0) {
                const availableCellID = nextLeftCol1 + "" + nextRow;
                const availableCell = document.getElementById(availableCellID);
                availableCells.push(availableCell);
            }
        }

        // right
        if (BOARD[row] != null && BOARD[row][nextRightCol] === 0) {
            const availableCellID = nextRightCol + "" + row;
            const availableCell = document.getElementById(availableCellID);
            availableCells.push(availableCell);
        } else if (BOARD[row] != null && BOARD[row][nextRightCol] === oppositePlayer) {
            const nextRightCol1 = nextRightCol + 1;
            const nextRow = row - currentRow === -1 ?
                currentRow - 2 : currentRow + 2;
            if (BOARD[nextRow] != null && BOARD[nextRow][nextRightCol1] === 0) {
                const availableCellID = nextRightCol1 + "" + nextRow;
                const availableCell = document.getElementById(availableCellID);
                availableCells.push(availableCell);
            }
        }
    });

    return availableCells;
}

function hasAvailableCellsForOppositeUser() {
    let condition;
    const remainingavailableCells = [];
    let remainingPieces;
    if (currentDatas.oppositePlayer === 1) {
        remainingPieces = document.querySelectorAll('.piece1');
    } else if (currentDatas.oppositePlayer === 2) {
        remainingPieces = document.querySelectorAll('.piece2');
    }

    remainingPieces.forEach(piece => {
        const availableCells = getAvailableCells(
            piece,
            currentDatas.oppositePlayer,
            currentDatas.currentPlayer
        );
        remainingavailableCells.push(...availableCells);
    });

    condition = remainingavailableCells.length > 0 ? true : false;
    return condition;
}

function movePiece() {
    const currentCol = currentDatas.selectCellID[0];
    const currentRow = currentDatas.selectCellID[1];
    const newCellID = this.id.split("");
    const newRow = Number(newCellID[1])
    const newCol = Number(newCellID[0]);

    //board 
    BOARD[currentRow][currentCol] = 0;
    BOARD[newRow][newCol] = currentDatas.currentPlayer;

    const hasRemoveablePiece = currentRow - newRow === 2 || currentRow - newRow === -2;
    if (hasRemoveablePiece) {
        const removeableRow = newRow - currentRow === -2 ?
            currentRow - 1 : currentRow + 1;
        const removeableCol = newCol - currentCol === -2 ?
            currentCol - 1 : currentCol + 1;
        BOARD[removeableRow][removeableCol] = 0;
        const cellID = removeableCol + "" + removeableRow;
        const cell = document.getElementById(cellID);
        const removeablePiece = cell.children[0];
        removeablePiece.remove();

        if (currentDatas.currentPlayer === 1) {
            blackPlayerScore++;
            blackScoreElement.innerHTML = `<span>${blackPlayerScore}</span>`;
        } else {
            whitePlayerScore++;
            whiteScoreElement.innerHTML = `<span>${whitePlayerScore}</span>`;
        }
    }

    // UI
    if (newRow === 0 || newRow === 7) {
        currentDatas.selectPiece.dataset.king = 1;
        currentDatas.selectPiece.classList.add('king');
    }
    this.appendChild(currentDatas.selectPiece);
    removeDatasToAvailableCells();

    const hasPiecesForOppositePlayer = BOARD.some(row => row.includes(currentDatas.oppositePlayer));
    const isWinning = !hasPiecesForOppositePlayer || !hasAvailableCellsForOppositeUser();
    if (isWinning) {
        winningBoxElement.style.display = 'block';
        winningTextElement.innerText = currentDatas.currentPlayer === 1 ?
            'Black Win!' : 'White Win!';
    } else {
        switchTurn();
        if(playWithBot && currentDatas.currentPlayer === SECOND_PLAYER) Bot();
    }

}


init();
pieces.forEach(piece => {
    piece.addEventListener('click', function () {
        const currentCellID = this.parentElement.id.split("");
        const currentCellRow = Number(currentCellID[1]);
        const currentCellCol = Number(currentCellID[0]);
        if (BOARD[currentCellRow][currentCellCol] !== currentDatas.currentPlayer) return;

        removeDatasToAvailableCells();
        //set current datas
        currentDatas.selectPiece = this;
        currentDatas.selectCell = this.parentElement;
        currentDatas.selectCellID = [currentCellCol, currentCellRow];
        currentDatas.king = currentDatas.selectPiece.dataset.king == 1 ?
            true : false;
        currentDatas.avaliableCells = getAvailableCells(
            currentDatas.selectPiece,
            currentDatas.currentPlayer,
            currentDatas.oppositePlayer
        );
        addDatasToAvailableCells();
    })
});

function getAvailablePiecesForBot() {
    const availablePiecesForBot = [];
    const botPieces = document.querySelectorAll('.piece2');
    botPieces.forEach(piece => {
        const cells = getAvailableCells(piece, SECOND_PLAYER, FIRST_PLAYER);
        if (cells.length > 0) availablePiecesForBot.push(piece);
    });
    return availablePiecesForBot;
}


function Bot() {
    const availablePieces = getAvailablePiecesForBot();
    //selecting removable cells
    const importantPieces = availablePieces.filter(piece => {
        const currentCell = piece.parentElement;
        const currentCellID = currentCell.id.split("");
        const currentRow = Number(currentCellID[1]);
        const availableCells = getAvailableCells(piece, SECOND_PLAYER, FIRST_PLAYER);
        return availableCells.some(cell => {
            const cellID = cell.id.split("");
            const newRow = Number(cellID[1]);
            return newRow - currentRow === 2 || newRow - currentRow === -2;
        })
    });

    let randomPiece;
    let randomCell;
    if (importantPieces.length === 0) {
        randomPiece = availablePieces[Math.floor(Math.random() * availablePieces.length)];
        const cells = getAvailableCells(randomPiece, SECOND_PLAYER, FIRST_PLAYER);
        randomCell = cells[Math.floor(Math.random() * cells.length)];
    } else {
        randomPiece = importantPieces[Math.floor(Math.random() * importantPieces.length)];
        const cells = getAvailableCells(randomPiece, SECOND_PLAYER, FIRST_PLAYER);
        const randomCells = cells.filter(cell => {
            const currentCell = randomPiece.parentElement;
            const currentCellID = currentCell.id.split("");
            const currentRow = Number(currentCellID[1]);

            const cellID = cell.id.split("");
            const newRow = Number(cellID[1]);
            return newRow - currentRow === 2 || newRow - currentRow === -2;
        });
        randomCell = randomCells[Math.floor(Math.random() * randomCells.length)];
    }

    setTimeout( () => {
        randomPiece.click();
    }, 1500);
    setTimeout( () => {
        randomCell.click();
    }, 2000);

}