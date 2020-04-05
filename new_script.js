

///////////////////////////////////////Start Game

const addNames = (event) => {
    // Get Player name
    playerOneName = document.querySelector('.name-one').value;
    playerTwoName = document.querySelector('.name-two').value;

    // Delete names from input
    document.querySelector('.name-one').value = "";
    document.querySelector('.name-two').value = "";
}

const startGame = (event) => {
    // hide start attributes
    const startAttributes = document.querySelector('.start-attributes');
    startAttributes.classList.add('hide');

    // Show Player turn
    const main = document.querySelector('main');
    const playerDisplay = document.createElement('div');
    playerDisplay.className = 'player-display';
    playerDisplay.textContent = `${playerOneName} turn`;
    main.appendChild(playerDisplay);


    // Create board on DOM
    createBoard();

    // Create virtual board tp keep track of pieces.
    createVirtualBoard();

    // Display pieces on board
    displayPieces();
}

const startButton = document.querySelector('.start-game');
startButton.addEventListener('click', startGame);

const submitNames = document.querySelector('.submit');
submitNames.addEventListener('click', addNames);


// Variable to store selected piece position and player turn
let selectPiecePosition = [];
let newPosition = [];
let playerTurn = true;
let playerOneName = "";
let playerTwoName = "";
let playerDisplayName = "";
let board = [];
let checkBoard = [];
let winState = false;


///////////////////////////////////////
//////////////////////////////////////
//////////////////////////////////////
////////////////////////////////////////
//////////////////////////////////////
/////////////////////////////////////
//////////////////////////////////////
// Controller for game play



const movePiece = (event) => {
    console.log(event.target.className);

    // Determines first click to select piece
    if (selectPiecePosition.length === 0) {
        //Change border colour of selected piece

        // store piece identity in variable
        selectPiece(event.target.className);
    }


    // Determines second click to move piece to new position
    else if ( (selectPiecePosition.length === 3) || (selectPiecePosition.length === 4) ) {

        // Store new position in variable
        storeNewPosition(event.target.className);

        // If wrong clck result in no newPosition
        if (newPosition.length === 0) {
            selectPiecePosition = [];
            newPosition = [];
        }
        else{
            // If user deselects his option
            if(newPosition[0] === selectPiecePosition[1] && newPosition[1] === selectPiecePosition[2]){
                selectPiecePosition = [];
                newPosition = [];

            }
            else{
                if (Math.abs(newPosition[0]-selectPiecePosition[1]) < 2) {
                    if (selectPiecePosition[3] === "king1" || selectPiecePosition[3] === "king2" ){
                        // If no obstruction.
                        kingMoveNoObstruction();
                    }
                    else if (selectPiecePosition[0] === "player1" || selectPiecePosition[0] === "player2"){
                        // If no obstruction.
                        moveNoObstruction();
                    }
                }
                else{
                    if (selectPiecePosition[3] === "king1" || selectPiecePosition[3] === "king2") {
                        kingMoveWithCapture();
                    }
                    else if (selectPiecePosition[0] === "player1" || selectPiecePosition[0] === "player2"){
                        // If obstruction.
                        moveWithCapture();
                    }
                }

                // display new Board
                displayPieces();

                // Check win condition
                checkWin()
                if (winState) {
                    // Blur board background
                    const uiBoard = document.querySelector('.board');
                    uiBoard.classList.add('blur');

                    // Add restart game button
                    addRestartButton();
                }

                // If no move was made
                else if(board === checkBoard){
                    console.log('no move was made');
                    selectPiecePosition = [];
                    newPosition = [];

                }

                // Reset selectPiecePosition and New Position for next move.
                else{
                    checkBoard = board;

                    selectPiecePosition = [];
                    newPosition = [];

                    // change player
                    changePlayer();
                }
            }
        }
    }
}



////////////////////////////////////////////////
////////////////////////////////////////////////
//////////////////////////////////////////////
//////////////////////////////////////////////////
////////////////////////////////////////////////
//////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////Create Board

const createBoard = () => {
    const main = document.querySelector('main');
    const buildBoard = document.createElement('div');
    buildBoard.className = 'board';
    main.appendChild(buildBoard);

    for (var i = 0; i < 8; i++) {

        const buildRow = document.createElement('div');

        buildRow.className = `length row${i}`;

        buildBoard.appendChild(buildRow);

        // let colCounterOdd = 1;
        // let colCounterEven = 0;
        for (var a = 0; a < 8; a++) {

            const buildBox = document.createElement('div');

            // console.log("colCounter is " + colCounter);

            if ( (i%2===0) && (a%2 !== 0) ) {
                buildBox.className = `dark row${i} col${a}`;
                // colCounterOdd++;
                buildBox.textContent = ""
                buildBox.addEventListener('click', movePiece)
                buildRow.appendChild(buildBox);
            }
            else if( (i%2===0) && (a%2===0) ){
                //light grids are non-plyable grids.
                // Classname only serves for styling purposes, therefore numbering not required.
                buildBox.className = 'light';
                buildBox.textContent = ""
                buildRow.appendChild(buildBox);
            }
            else if( (i%2 !== 0) && (a%2===0) ){
                buildBox.className = `dark row${i} col${a}`
                // colCounterEven++;
                buildBox.textContent = ""
                buildBox.addEventListener('click', movePiece)
                buildRow.appendChild(buildBox);
            }
            else if( (i%2 !== 0) && (a%2 !== 0) ){
                buildBox.className = 'light';
                buildBox.textContent = ""
                buildRow.appendChild(buildBox);
            }
        }
        // colCounterOdd = 1;
        // colCounterEven = 0;
    };
}



//////////////////////////////////////Create Virtual Board to keep track of pieces

// 0 means empty grid, 1 is Player 1 and 2 is Player 2;

const createVirtualBoard = () => {
    for(var b=0; b<8; b++){
        board[b] = [];
        for (var c = 0; c < 8; c++) {
            // Row even, column odd, player 1 piece up to 3 rows
            if((b%2===0) && (c%2 !== 0) && b<3){
                board[b].push(1);
            }
            // Row even, column even, light grids all the rows
            else if ((b%2===0) && (c%2 === 0)) {
                board[b].push(null)
            }
            // Row odd, column even, player 1 piece up to row 3
            else if ( (b%2 !== 0) && (c%2===0) && b<3){
                board[b].push(1);
            }
            // Row even, column odd, player 2 piece from row 5-7
            else if ((b%2===0) && (c%2 !== 0) && b > 4){
                board[b].push(2);
            }
            // Row odd, column odd, light grids all the rows
            else if ((b%2 !== 0) && (c%2!==0)) {
                board[b].push(null);
            }
            else if ((b%2 !== 0) && (c%2===0) && b > 4){
                board[b].push(2);
            }
            else{
                board[b].push(0);
            }

        }
    };
}



///////////////////////////////////////Create function to position pieces on UI

const displayPieces = () =>{
    for (var d=0; d<8; d++){
        for (var e=0; e<8; e++){
            // Specify Grid
            const grid = document.getElementsByClassName(`row${d} col${e}`)[0];
            // Loop may run over light grids which are undefined based on above classname selection
            if (grid != undefined) {
                // Manipulate Grid to show piece or remain as empty grid
                if(board[d][e] === 1){
                    grid.classList.add('player1');
                }
                else if(board[d][e] === 2){
                    grid.classList.add('player2');
                }
                else if(board[d][e] === 3){
                    grid.classList.add('player1')
                    grid.classList.add('king1')
                }
                else if(board[d][e] === 4){
                    grid.classList.add('player2')
                    grid.classList.add('king2')
                }
                // Remove piece from initial position after movement
                else if(board[d][e] === 0 && ( grid.classList.contains('player1') || grid.classList.contains('player2')) ){
                    if(grid.classList.contains('player1')){
                        grid.classList.remove('player1');
                        if(grid.classList.contains('king1')){
                            grid.classList.remove('king1')
                        }
                    }
                    else if(grid.classList.contains('player2')){
                        grid.classList.remove('player2');
                        if (grid.classList.contains('king2')) {
                            grid.classList.remove('king2');
                        }
                    }
                }
            }
        }
    }
}






/////////////////////////////////////////////Player turn

const changePlayer = () => {
    // Change player
    playerTurn = !playerTurn;

    if (playerTurn === true) {
        playerDisplayName = playerOneName;
    }
    else if(playerTurn === false){
        playerDisplayName = playerTwoName;
    }

    const nameDisplay = document.querySelector('.player-display');
    nameDisplay.textContent = `${playerDisplayName} Turn`
}



//////////////////////////////////////////////////Determination of first or second click

// Store position of selected piece into variable
const selectPiece = (piece) => {
    // Determine Player
    if (piece.split(' ')[3] === 'player1'){
        selectPiecePosition.push('player1');

        // Determine row
        selectPiecePosition.push(parseInt(piece.split(' ')[1].split('')[3]));

        // Determine column
        selectPiecePosition.push(parseInt(piece.split(' ')[2].split('')[3]));

        // Determine if piece is king
        if (piece.split(' ')[4] === 'king1') {
            selectPiecePosition.push('king1')
        }

        // Add border on selected piece
        const selectedPiece = document.getElementsByClassName(piece)[0];
        selectedPiece.classList.add('selected-piece');
    }
    else if(piece.split(' ')[3] === 'player2'){
        selectPiecePosition.push('player2');

        // Determine row
        selectPiecePosition.push(parseInt(piece.split(' ')[1].split('')[3]));

        // Determine column
        selectPiecePosition.push(parseInt(piece.split(' ')[2].split('')[3]));

        // Determine if piece is king
        if (piece.split(' ')[4] === 'king2') {
            selectPiecePosition.push('king2')
        }

        // Add border on selected piece
        const selectedPiece = document.getElementsByClassName(piece)[0];
        selectedPiece.classList.add('selected-piece');
    }
}

// Store position of new position into variable
const storeNewPosition = (piece) => {

    if (piece.split(' ')[3] === `player1` || piece.split(' ')[3] === `player2`){
        // If User deselect selectPiece
        if (parseInt(piece.split(' ')[1].split('')[3]) === selectPiecePosition[1] && parseInt(piece.split(' ')[2].split('')[3]) === selectPiecePosition[2]) {
            // Determine row
            newPosition.push(parseInt(piece.split(' ')[1].split('')[3]));

            // Determine column
            newPosition.push(parseInt(piece.split(' ')[2].split('')[3]));
        }
        // If new position is occupied position
        else{
            console.log(`Illegal move. You cannot move to an occupied position`);

        }
    }
    else{

        // Determine row
        newPosition.push(parseInt(piece.split(' ')[1].split('')[3]));

        // Determine column
        newPosition.push(parseInt(piece.split(' ')[2].split('')[3]));
    }

    const selectedPiece = document.getElementsByClassName(`row${selectPiecePosition[1]} col${selectPiecePosition[2]} ${selectPiecePosition[0]}`)[0];
    selectedPiece.classList.remove('selected-piece');
}


/////////////////////////////////////////////////////
////////////////////////////////////////////////////
//////////////////////////////////////////////////////
////////////////////////////////////////////////////
/////////////////////////////////////////////////////
///////////////////////////////////////////////////////
/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
//////////////////////////////////////////////////// Function to check if any player has won

const checkWin = () => {
    const allPieces = board.flat();
    if(!(allPieces.includes(1) || allPieces.includes(3))){
        const nameDisplay = document.querySelector('.player-display');
        console.log(nameDisplay);
        nameDisplay.textContent = `${playerOneName} Wins!!!`
        winState = true;
    }
    else if(!(allPieces.includes(2) || allPieces.includes(4))){
        const nameDisplay = document.querySelector('.player-display');
        nameDisplay.textContent = `${playerTwoName} Wins!!!`
        winState = true;
    }
}

const addRestartButton = () => {
    const restartButton = document.createElement('button');
    restartButton.textContent = "Restart Game"
    restartButton.setAttribute("type", "button");
    restartButton.setAttribute("class", "restart-button");
    restartButton.addEventListener('click', restartGame);
    const main = document.querySelector('main');
    main.appendChild(restartButton);
}

const restartGame = (event) => {
    // Remove restart button
    const restartBtn = document.querySelector('.restart-button');
    restartBtn.parentNode.removeChild(restartBtn);

    // Remove blur class of board
    const uiBoard = document.querySelector('.board');
    uiBoard.classList.remove('blur');

    selectPiecePosition = [];
    newPosition = [];
    board = [];
    winState = false;
    playerTurn = true;

    // Create virtual board tp keep track of pieces.
    createVirtualBoard();

    // Clear UI board
    for (var p=0; p<8; p++){
        for (var q=0; q<8; q++){
            // Specify Grid
            const grid = document.getElementsByClassName(`row${p} col${q}`)[0];
            // Loop may run over light grids which are undefined based on above classname selection
            if (grid != undefined) {
                if (grid.classList.contains('player1') || grid.classList.contains('player2') || grid.classList.contains('king1') || grid.classList.contains('king2')) {
                    grid.classList.remove('player1');
                    grid.classList.remove('player2');
                    grid.classList.remove('king1');
                    grid.classList.remove('king2');
                }
            }
        }
    }

    // Display pieces on board
    displayPieces();

    // Show player turn
    const playerDisplay = document.querySelector('.player-display');
    playerDisplay.textContent = `${playerOneName} turn`;

}



////////////////////////////////////////
////////////////////////////////
//////////////////////////////////////
/////////////////////////////////////
/////////////////////////////////////
/////////////////////////////////////
//////////////////////////////////////
/////////////////////////////////////
/////////////////////Movement

const player1 = {
    value: 1,
    king: 3,
    opponentPiece : 2,
    opponentKing : 4
};

const king1 = {
    value : 3,
    piece : 1,
    opponentPiece : 2,
    opponentKing : 4
};

const player2 = {
    value : 2,
    king : 4,
    opponentPiece : 1,
    opponentKing : 3
};

const king2 = {
    value : 4,
    piece : 2,
    opponentPiece: 1,
    opponentKing : 3
};

const moveNoObstruction = () => {
    // Determine player object
    let playerType;
    if (selectPiecePosition[0] === 'player1') {
        playerType = player1;
    }
    else if (selectPiecePosition[0] === 'player2') {
        playerType = player2;
    }

    // If new position moves backwards, illegal move until become king
    if( (selectPiecePosition[0] === "player1" && (newPosition[0] - selectPiecePosition[1]) < 0) ||
        (selectPiecePosition[0] === "player2" && (newPosition[0] - selectPiecePosition[1]) > 0)
        ){
        console.log(`Illegal move. Cannot move backwards until Piece becomes king`);
    }

    // If new position more than 1 column from previous position, illegal move
    else if (Math.abs(newPosition[1] - selectPiecePosition[2]) > 1) {
        console.log(`Illegal move. Cannot move more than 1 row.`);
    }

    // If new position changes piece to king
    else if (newPosition[0] === 7 || newPosition[0] === 0) {
        // piece becomes king
        board[newPosition[0]][newPosition[1]] = playerType.king;

        // initial position becomes empty grid
        board[selectPiecePosition[1]][selectPiecePosition[2]] = 0;
    }

    else {
        // Piece move to new position
        board[newPosition[0]][newPosition[1]] = playerType.value;

        // initial position becomes empty grid
        board[selectPiecePosition[1]][selectPiecePosition[2]] = 0;
    }
}



// King movement no obstruction
const kingMoveNoObstruction = () => {

    // Determine player object
    let playerType;
    if (selectPiecePosition[3] === 'king1') {
        playerType = king1;
    }
    else if (selectPiecePosition[3] === 'king2') {
        playerType = king2;
    }

    // If new position more than 1 column from previous position, illegal move
    if (Math.abs(newPosition[1] - selectPiecePosition[2]) > 1) {
        console.log(`Illegal move. Cannot move more than 1 row.`);
    }

    else {
        // Piece move to new position
        board[newPosition[0]][newPosition[1]] = playerType.value;

        // initial position becomes empty grid
        board[selectPiecePosition[1]][selectPiecePosition[2]] = 0;
    }
}



////////////////////////////////
/////////////////////////////////
////////////////////////////////
///////////////////////////////
///////////////////////////////////
//////////////////////////////
/////////////////////////////////
///////////////Move with capture

const moveWithCapture = () => {
    // Determine player object
    let playerType;
    if (selectPiecePosition[0] === 'player1') {
        playerType = player1;
    }
    else if (selectPiecePosition[0] === 'player2') {
        playerType = player2;
    }

    // If new position moves backwards, illegal move until become king
    if((selectPiecePosition[0] === "player1" && (newPosition[0] - selectPiecePosition[1]) < 0) ||
        (selectPiecePosition[0] === "player2" && (newPosition[0] - selectPiecePosition[1]) > 0)
        ){
        console.log(`Illegal move. Cannot move backwards until Piece becomes king`);
    }
    // If new position more than 1 row from previous position, illegal move
    else if ( Math.abs(newPosition[0] - selectPiecePosition[1]) > 2 ){
        console.log(`Illegal move. Can only move into grid after opponent grid `);
    }
    // If new position more than 2 rows, illegal move
    else if (Math.abs(newPosition[0] - selectPiecePosition[1]) > 2) {
        console.log('illegal move, cannot move more than 2 rows');
    }
    // If new position more than 2 columns, illegal move
    else if (Math.abs(newPosition[1] - selectPiecePosition[2]) > 2) {
        console.log('illegal move');
    }

    else if ( ( ( (board[selectPiecePosition[1]+1][selectPiecePosition[2]+1] === playerType.opponentPiece) || (board[selectPiecePosition[1]+1][selectPiecePosition[2]+1] === playerType.opponentKing) ) && (selectPiecePosition[2] + 2 === newPosition[1]) ) ||
     ( ( (board[selectPiecePosition[1]+1][selectPiecePosition[2]-1] === playerType.opponentPiece) || (board[selectPiecePosition[1]+1][selectPiecePosition[2]-1] === playerType.opponentKing) ) && (selectPiecePosition[2] - 2 === newPosition[1] ) ) ||
     ( ( (board[selectPiecePosition[1]-1][selectPiecePosition[2]+1] === playerType.opponentPiece) || (board[selectPiecePosition[1]-1][selectPiecePosition[2]+1] === playerType.opponentKing) ) && (selectPiecePosition[2] + 2 === newPosition[1]) ) ||
     ( ( (board[selectPiecePosition[1]-1][selectPiecePosition[2]-1] === playerType.opponentPiece) || (board[selectPiecePosition[1]-1][selectPiecePosition[2]-1] === playerType.opponentKing) ) && (selectPiecePosition[2] - 2 === newPosition[1] ) )

        ){
        // If piece captures opponent piece and becomes king
        if (newPosition[0] === 7 || newPosition[0] === 0) {
            // piece becomes king
            board[newPosition[0]][newPosition[1]] = playerType.king;

            // initial position becomes empty grid
            board[selectPiecePosition[1]][selectPiecePosition[2]] = 0;

            if ( ( (board[selectPiecePosition[1]+1][selectPiecePosition[2]+1] === playerType.opponentPiece) || (board[selectPiecePosition[1]+1][selectPiecePosition[2]+1] === playerType.opponentKing) ) && selectPiecePosition[2]+2 === newPosition[1] )  {
            board[selectPiecePosition[1]+1][selectPiecePosition[2]+1] = 0;
            }
            else if ( ( (board[selectPiecePosition[1]+1][selectPiecePosition[2]-1] === playerType.opponentPiece) || (board[selectPiecePosition[1]+1][selectPiecePosition[2]-1] === playerType.opponentKing) ) && selectPiecePosition[2]-2 === newPosition[1]  ){
                board[selectPiecePosition[1]+1][selectPiecePosition[2]-1] = 0;
            }
            else if ( ( (board[selectPiecePosition[1]-1][selectPiecePosition[2]+1] === playerType.opponentPiece) || (board[selectPiecePosition[1]-1][selectPiecePosition[2]+1] === playerType.opponentKing) ) && selectPiecePosition[2]+2 === newPosition[1] )  {
                board[selectPiecePosition[1]-1][selectPiecePosition[2]+1] = 0;
            }
            else if ( ( (board[selectPiecePosition[1]-1][selectPiecePosition[2]-1] === playerType.opponentPiece) || (board[selectPiecePosition[1]-1][selectPiecePosition[2]-1] === playerType.opponentKing) ) && selectPiecePosition[2]-2 === newPosition[1]  ){
                board[selectPiecePosition[1]-1][selectPiecePosition[2]-1] = 0;
            }
        }
        else{
            // Piece move to new position
            board[newPosition[0]][newPosition[1]] = playerType.value;

            // initial position becomes empty grid
            board[selectPiecePosition[1]][selectPiecePosition[2]] = 0;

            // captured position becomes empty grid
            if ( ( (board[selectPiecePosition[1]+1][selectPiecePosition[2]+1] === playerType.opponentPiece) || (board[selectPiecePosition[1]+1][selectPiecePosition[2]+1] === playerType.opponentKing) ) && selectPiecePosition[2]+2 === newPosition[1] )  {
                board[selectPiecePosition[1]+1][selectPiecePosition[2]+1] = 0;
            }
            else if ( ( (board[selectPiecePosition[1]+1][selectPiecePosition[2]-1] === playerType.opponentPiece) || (board[selectPiecePosition[1]+1][selectPiecePosition[2]-1] === playerType.opponentKing) ) && selectPiecePosition[2]-2 === newPosition[1]  ){
                board[selectPiecePosition[1]+1][selectPiecePosition[2]-1] = 0;
            }
            else if ( ( (board[selectPiecePosition[1]-1][selectPiecePosition[2]+1] === playerType.opponentPiece) || (board[selectPiecePosition[1]-1][selectPiecePosition[2]+1] === playerType.opponentKing) ) && selectPiecePosition[2]+2 === newPosition[1] )  {
                board[selectPiecePosition[1]-1][selectPiecePosition[2]+1] = 0;
            }
            else if ( ( (board[selectPiecePosition[1]-1][selectPiecePosition[2]-1] === playerType.opponentPiece) || (board[selectPiecePosition[1]-1][selectPiecePosition[2]-1] === playerType.opponentKing) ) && selectPiecePosition[2]-2 === newPosition[1]  ){
                board[selectPiecePosition[1]-1][selectPiecePosition[2]-1] = 0;
            }
        }
    }
}


// If king
// King movement
const kingMoveWithCapture = () => {
    // Determine player object
    let playerType;
    if (selectPiecePosition[3] === 'king1') {
        playerType = king1;
    }
    else if (selectPiecePosition[3] === 'king2') {
        playerType = king2;
    }

    // If new position more than 2 rows, illegal move
    if (Math.abs(newPosition[0] - selectPiecePosition[1]) > 2) {
        console.log('illegal move, cannot move more than 2 rows');
    }
    // If new position more than 2 columns, illegal move
    else if (Math.abs(newPosition[1] - selectPiecePosition[2]) > 2) {
        console.log('illegal move');
    }
    else if (( ( (board[selectPiecePosition[1]+1][selectPiecePosition[2]+1] === playerType.opponentPiece) || (board[selectPiecePosition[1]+1][selectPiecePosition[2]+1] === playerType.opponentKing) ) && (selectPiecePosition[2] + 2 === newPosition[1]) ) ||
        ( ( (board[selectPiecePosition[1]+1][selectPiecePosition[2]-1] === playerType.opponentPiece) || (board[selectPiecePosition[1]+1][selectPiecePosition[2]-1] === playerType.opponentKing) ) && (selectPiecePosition[2] - 2 === newPosition[1] ) )
        ) {
        // Piece move to new position
        board[newPosition[0]][newPosition[1]] = playerType.value;

        // initial position becomes empty grid
        board[selectPiecePosition[1]][selectPiecePosition[2]] = 0;

        // captured position becomes empty grid
        if ( ( (board[selectPiecePosition[1]+1][selectPiecePosition[2]+1] === playerType.opponentPiece) || (board[selectPiecePosition[1]+1][selectPiecePosition[2]+1] === playerType.opponentKing) ) && selectPiecePosition[2]+2 === newPosition[1] ) {
            board[selectPiecePosition[1]+1][selectPiecePosition[2]+1] = 0;
        }
        else if ( ( (board[selectPiecePosition[1]+1][selectPiecePosition[2]-1] === playerType.opponentPiece) || (board[selectPiecePosition[1]+1][selectPiecePosition[2]-1] === playerType.opponentKing) ) && selectPiecePosition[2]-2 === newPosition[1] ){
            board[selectPiecePosition[1]+1][selectPiecePosition[2]-1] = 0;
        }
    }
    else if ( ( ( (board[selectPiecePosition[1]-1][selectPiecePosition[2]+1] === playerType.opponentPiece) || (board[selectPiecePosition[1]-1][selectPiecePosition[2]+1] === playerType.opponentKing) ) && (selectPiecePosition[2] + 2 === newPosition[1]) ) ||
        ( ( (board[selectPiecePosition[1]-1][selectPiecePosition[2]-1] === playerType.opponentPiece) || (board[selectPiecePosition[1]-1][selectPiecePosition[2]-1] === playerType.opponentKing) ) && (selectPiecePosition[2] - 2 === newPosition[1] ) ) ){

        // Piece move to new position
        board[newPosition[0]][newPosition[1]] = playerType.value;

        // initial position becomes empty grid
        board[selectPiecePosition[1]][selectPiecePosition[2]] = 0;

        // captured position becomes empty grid
        if ( ( (board[selectPiecePosition[1]-1][selectPiecePosition[2]+1] === playerType.opponentPiece) || (board[selectPiecePosition[1]-1][selectPiecePosition[2]+1] === playerType.opponentKing) ) && selectPiecePosition[2]+2 === newPosition[1] ) {
            board[selectPiecePosition[1]-1][selectPiecePosition[2]+1] = 0;
        }
        else if ( ( (board[selectPiecePosition[1]-1][selectPiecePosition[2]-1] === playerType.opponentPiece) || (board[selectPiecePosition[1]-1][selectPiecePosition[2]-1] === playerType.opponentKing)) && selectPiecePosition[2]-2 === newPosition[1] ){
            board[selectPiecePosition[1]-1][selectPiecePosition[2]-1] = 0;
        }
    }
}