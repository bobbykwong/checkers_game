

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

const submitNames = document.querySelector('.submit-name');
submitNames.addEventListener('click', addNames);


// Variable to store selected piece position and player turn
let selectPiecePosition = [];
let newPosition = [];
let playerTurn = true;
let playerOneName = "";
let playerTwoName = "";
let playerDisplayName = "";
let board = [];


//////////////////////////////////////Controller for game play

const movePiece = (event) => {
    console.log(event.target.className);

    // Determines first click to select piece
    if (selectPiecePosition.length === 0) {
        //Change border colour of selected piece

        // store piece identity in variable
        selectPiece(event.target.className);
    }


    // Determines second click to move piece to new position
    else if (selectPiecePosition.length === 3) {
        selectPiece(event.target.className);

        // Store new position in variable
        storeNewPosition(event.target.className);

        // If no obstruction.
        moveNoObstruction();

        // If obstruction,
        moveWithCapture();

        // display new Board
        displayPieces();

        // Check win condition
        checkWin();

        // Reset selectPiecePosition and New Position for next move.
        selectPiecePosition = [];
        newPosition = [];

        // change player
        changePlayer();

    }
}


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
            }
            else if( (i%2===0) && (a%2===0) ){
                //light grids are non-plyable grids.
                // Classname only serves for styling purposes, therefore numbering not required.
                buildBox.className = 'light';
            }
            else if( (i%2 !== 0) && (a%2===0) ){
                buildBox.className = `dark row${i} col${a}`
                // colCounterEven++;
            }
            else if( (i%2 !== 0) && (a%2 !== 0) ){
                buildBox.className = 'light';
            }

            buildBox.textContent = ""
            buildBox.addEventListener('click', movePiece)
            buildRow.appendChild(buildBox);
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
            if((b%2===0) && (c%2 !== 0) && b<3){
                board[b].push(1);
            }
            else if ( (b%2 !== 0) && (c%2===0) && b<3){
                board[b].push(1);
            }
            else if ((b%2===0) && (c%2 !== 0) && b > 4){
                board[b].push(2);
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

displayPieces()





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
    }
    else if(piece.split(' ')[3] === 'player2'){
        selectPiecePosition.push('player2');

        // Determine row
        selectPiecePosition.push(parseInt(piece.split(' ')[1].split('')[3]));

        // Determine column
        selectPiecePosition.push(parseInt(piece.split(' ')[2].split('')[3]));
    }
}

// Store position of new position into variable
const storeNewPosition = (piece) => {

    // Determine if move legal
    if (piece.split(' ')[3] === `player1` || piece.split(' ')[3] === `player2` || piece.split(' ')[0] === `light`){
        console.log(`Illegal move. You cannot move to an occupied position`);
    }
    else{

        // Determine row
        newPosition.push(parseInt(piece.split(' ')[1].split('')[3]));

        // Determine column
        newPosition.push(parseInt(piece.split(' ')[2].split('')[3]));
    }
}





////////////////////////////////////////////////////Movement

// Logic for movement without obstruction
const moveNoObstruction = () => {

    // Determine if Player 1 or Player 2.
    // Player 1
    if (selectPiecePosition[0] === 'player1') {

        // If new position moves backwards, illegal move until become king
        if((newPosition[0] - selectPiecePosition[1]) < 0){
            console.log(`Illegal move. Cannot move backwards until Piece becomes king`);
        }
        // If new position more than 1 row, but movement for capture of opponent piece, return and execute moveWithCapture()
        else if ( ( ( (board[selectPiecePosition[1]+1][selectPiecePosition[2]+1] === 2) && (selectPiecePosition[2] + 2 === newPosition[1])) ) || ( (board[selectPiecePosition[1]+1][selectPiecePosition[2]-1] === 2) && (selectPiecePosition[2] - 2 === newPosition[1] ) ) ) {
            console.log('execute movement with capture');
        }

        // If new position more than 1 row from previous position, illegal move
        else if ( Math.abs(newPosition[0] - selectPiecePosition[1]) > 1 ){
            console.log(`Illegal move. Cannot move more than 1 row`);
        }

        // If row where select piece is on is even
        else if ( selectPiecePosition[1] %2 === 0 ) {
            // if Row even and last box, only one legal move
            if(selectPiecePosition[2] === 7){
                if (newPosition[1] === 6) {
                    // Piece becomes king
                    if (selectPiecePosition[1] === 6) {
                        // Piece move to new position and becomes king = 3
                        board[newPosition[0]][6] = 3;

                        // initial position becomes empty grid
                        board[selectPiecePosition[1]][selectPiecePosition[2]] = 0;
                    }
                    else{
                        // Piece move to new position
                        board[newPosition[0]][6] = 1;

                        // initial position becomes empty grid
                        board[selectPiecePosition[1]][selectPiecePosition[2]] = 0;
                    }
                }
            }
            else if(selectPiecePosition[2] % 2 !=0 ){
                // Piece becomes king
                if (selectPiecePosition[1] === 6) {
                    // Piece move to new position and becomes king = 3
                    board[newPosition[0]][newPosition[1]] = 3;

                    // initial position becomes empty grid
                    board[selectPiecePosition[1]][selectPiecePosition[2]] = 0;
                }
                else{
                    // Piece move to new position
                    board[newPosition[0]][newPosition[1]] = 1;

                    // initial position becomes empty grid
                    board[selectPiecePosition[1]][selectPiecePosition[2]] = 0;
                }
            }
            // If new position is light grid, illegal move
            else if(selectPiecePosition[2] % 2 ===0 ){
                console.log(`Illegal move, light grid`);
            }
        }

        // If row where select piece is on is odd
        else if ( selectPiecePosition[1] %2 != 0 ) {
            // if Row odd and first box, only one legal move
            if(selectPiecePosition[2] === 0){
                if (newPosition[1] === 1) {
                    // Piece move to new position
                    board[newPosition[0]][1] = 1;

                    // initial position becomes empty grid
                    board[selectPiecePosition[1]][selectPiecePosition[2]] = 0;
                }
            }
            else if(selectPiecePosition[2] % 2 ===0 ){
                // Piece move to new position
                board[newPosition[0]][newPosition[1]] = 1;

                // initial position becomes empty grid
                board[selectPiecePosition[1]][selectPiecePosition[2]] = 0;
            }
            // If new position is light grid, illegal move
            else if(selectPiecePosition[2] % 2 !=0 ){
                console.log(`Illegal move, light grid`);
            }
        }
    }


    // Player 2 movement
    else if (selectPiecePosition[0] === 'player2') {

        // If new position moves backwards, illegal move until become king
        if((newPosition[0] - selectPiecePosition[1]) > 0){
            console.log(`Illegal move. Cannot move backwards until Piece becomes king`);
        }
        // If new position more than 1 row, but movement for capture of opponent piece, return and execute moveWithCapture()
        else if( ( (board[selectPiecePosition[1]-1][selectPiecePosition[2]+1] === 1) && (selectPiecePosition[2] + 2 === newPosition[1]) ) || ( (board[selectPiecePosition[1]-1][selectPiecePosition[2]-1] === 1) && (selectPiecePosition[2] - 2 === newPosition[1] ) ) ){
            console.log('execute movement with capture');
        }

        // If new position more than 1 row from previous position, illegal move
        else if ( Math.abs(newPosition[0] - selectPiecePosition[1]) > 1 ){
            console.log(`Illegal move. Cannot move more than 1 row`);
        }

        // If row where select piece is on is even
        else if ( selectPiecePosition[1] %2 === 0 ) {
            // if Row even and last box, only one legal move
            if(selectPiecePosition[2] === 7){

                if (newPosition[1] === 6) {

                    // Piece move to new position
                    board[newPosition[0]][6] = 2;

                    // initial position becomes empty grid
                    board[selectPiecePosition[1]][selectPiecePosition[2]] = 0;
                }
            }
            else if(selectPiecePosition[2] % 2 !=0 ){

                // Piece move to new position
                board[newPosition[0]][newPosition[1]] = 2;

                // initial position becomes empty grid
                board[selectPiecePosition[1]][selectPiecePosition[2]] = 0;
            }
            // If new position is light grid, illegal move
            else if(selectPiecePosition[2] % 2 ===0 ){
                console.log(`Illegal move, light grid`);
            }
        }

        // If row where select piece is on is odd
        else if ( selectPiecePosition[1] %2 != 0 ) {
            // if Row odd and first box, only one legal move
            if(selectPiecePosition[2] === 0){
                if (newPosition[1] === 1) {
                     // Piece becomes king
                    if (selectPiecePosition[1] === 1) {
                        // Piece move to new position and becomes king = 4
                        board[newPosition[0]][1] = 4;

                        // initial position becomes empty grid
                        board[selectPiecePosition[1]][selectPiecePosition[2]] = 0;
                    }
                    else{
                        // Piece move to new position
                        board[newPosition[0]][1] = 2;

                        // initial position becomes empty grid
                        board[selectPiecePosition[1]][selectPiecePosition[2]] = 0;
                    }
                }
            }
            else if(selectPiecePosition[2] % 2 ===0 ){
                 // Piece becomes king
                if (selectPiecePosition[1] === 1) {
                    // Piece move to new position and becomes king = 4
                    board[newPosition[0]][newPosition[1]] = 4;

                    // initial position becomes empty grid
                    board[selectPiecePosition[1]][selectPiecePosition[2]] = 0;
                }
                else{
                    // Piece move to new position
                    board[newPosition[0]][newPosition[1]] = 2;

                    // initial position becomes empty grid
                    board[selectPiecePosition[1]][selectPiecePosition[2]] = 0;
                }

            }
            // If new position is light grid, illegal move
            else if(selectPiecePosition[2] % 2 !=0 ){
                console.log(`Illegal move, light grid`);
            }
        }
    }
}



const moveWithCapture = () => {
    // Determine if player 1 or player 2
    // Player 1
    if (selectPiecePosition[0] === 'player1') {
        // If new position moves backwards, illegal move until become king
        if((newPosition[0] - selectPiecePosition[1]) < 0){
            console.log(`Illegal move. Cannot move backwards until Piece becomes king`);
        }
        // If new position more than 1 row from previous position, illegal move
        else if ( Math.abs(newPosition[0] - selectPiecePosition[1]) > 2 ){
            console.log(`Illegal move. Can only move into grid after opponent grid `);
        }

        // If row is even
        else if(selectPiecePosition[1] %2 === 0){
            // If row is even and first box, only one legal move
            if( (board[selectPiecePosition[1]+1][selectPiecePosition[2]+1] === 2) && (selectPiecePosition[2] === 1) ){
                if(newPosition[1] === 3){
                    // Piece move to new position
                    board[newPosition[0]][newPosition[1]] = 1;

                    // initial position becomes empty grid
                    board[selectPiecePosition[1]][selectPiecePosition[2]] = 0;

                    // captured position becomes empty grid
                    board[selectPiecePosition[1]+1][selectPiecePosition[2]+1] = 0;
                }
            }
            // If row is even and last box, only one legal move
            else if( (board[selectPiecePosition[1]+1][selectPiecePosition[2]-1] === 2) && (selectPiecePosition[2] === 7) ){
                if(newPosition[1] === 5){
                    // Piece move to new position
                    board[newPosition[0]][newPosition[1]] = 1;

                    // initial position becomes empty grid
                    board[selectPiecePosition[1]][selectPiecePosition[2]] = 0;

                    // captured position becomes empty grid
                    board[selectPiecePosition[1]+1][selectPiecePosition[2]-1] = 0;
                }
            }
            else if ( ( ( (board[selectPiecePosition[1]+1][selectPiecePosition[2]+1] === 2) && (selectPiecePosition[2] + 2 === newPosition[1])) ) || ( (board[selectPiecePosition[1]+1][selectPiecePosition[2]-1] === 2) && (selectPiecePosition[2] - 2 === newPosition[1] ) ) ){
                // Piece move to new position
                board[newPosition[0]][newPosition[1]] = 1;

                // initial position becomes empty grid
                board[selectPiecePosition[1]][selectPiecePosition[2]] = 0;

                // captured position becomes empty grid
                if (board[selectPiecePosition[1]+1][selectPiecePosition[2]+1] === 2) {
                    board[selectPiecePosition[1]+1][selectPiecePosition[2]+1] = 0;
                }
                else if (board[selectPiecePosition[1]+1][selectPiecePosition[2]-1] === 2){
                    board[selectPiecePosition[1]+1][selectPiecePosition[2]-1] = 0;
                }
            }
            else{
                console.log(`Illegal move`);
            }
        }

        // If row is odd
        else if(selectPiecePosition[1] %2 != 0){
            // If row is odd and first box, only one legal move
            if( (board[selectPiecePosition[1]+1][selectPiecePosition[2]+1] === 2) && (selectPiecePosition[2] === 0) ){
                if(newPosition[1] === 2){
                     // Piece becomes king
                    if (selectPiecePosition[1] === 5) {
                        // Piece move to new position and becomes king = 4
                        board[newPosition[0]][2] = 3;

                        // initial position becomes empty grid
                        board[selectPiecePosition[1]][selectPiecePosition[2]] = 0;

                        // captured position becomes empty grid
                        board[selectPiecePosition[1]+1][selectPiecePosition[2]+1] = 0;
                    }
                    else{
                        // Piece move to new position
                        board[newPosition[0]][2] = 1;

                        // initial position becomes empty grid
                        board[selectPiecePosition[1]][selectPiecePosition[2]] = 0;

                        // captured position becomes empty grid
                        board[selectPiecePosition[1]+1][selectPiecePosition[2]+1] = 0;
                    }
                }
            }
            // If row is odd and last box, only one legal move
            else if( (board[selectPiecePosition[1]+1][selectPiecePosition[2]-1] === 2) && (selectPiecePosition[2] === 6) ){
                if(newPosition[1] === 4){
                    // Piece becomes king
                    if (selectPiecePosition[1] === 5) {
                        // Piece move to new position and becomes king = 4
                        board[newPosition[0]][4] = 3;

                        // initial position becomes empty grid
                        board[selectPiecePosition[1]][selectPiecePosition[2]] = 0;

                        // captured position becomes empty grid
                        board[selectPiecePosition[1]+1][selectPiecePosition[2]-1] = 0;
                    }
                    else{
                        // Piece move to new position
                        board[newPosition[0]][4] = 1;

                        // initial position becomes empty grid
                        board[selectPiecePosition[1]][selectPiecePosition[2]] = 0;

                        // captured position becomes empty grid
                        board[selectPiecePosition[1]+1][selectPiecePosition[2]-1] = 0;
                    }
                }
            }
            else if ( ( ( (board[selectPiecePosition[1]+1][selectPiecePosition[2]+1] === 2) && (selectPiecePosition[2] + 2 === newPosition[1])) ) || ( (board[selectPiecePosition[1]+1][selectPiecePosition[2]-1] === 2) && (selectPiecePosition[2] - 2 === newPosition[1] ) ) ){
                // Piece becomes king
                if (selectPiecePosition[1] === 5) {
                    // Piece move to new position and becomes king = 4
                    board[newPosition[0]][newPosition[1]] = 3;

                    // initial position becomes empty grid
                    board[selectPiecePosition[1]][selectPiecePosition[2]] = 0;

                    // captured position becomes empty grid
                    if ( (board[selectPiecePosition[1]+1][selectPiecePosition[2]+1] === 2) || (board[selectPiecePosition[1]+1][selectPiecePosition[2]+1] === 4) ) {
                        board[selectPiecePosition[1]+1][selectPiecePosition[2]+1] = 0;
                    }
                    else if ( (board[selectPiecePosition[1]+1][selectPiecePosition[2]-1] === 2) || (board[selectPiecePosition[1]+1][selectPiecePosition[2]+1] === 4) ){
                        board[selectPiecePosition[1]+1][selectPiecePosition[2]-1] = 0;
                    }
                }
                else{
                    // Piece move to new position
                    board[newPosition[0]][newPosition[1]] = 1;

                    // initial position becomes empty grid
                    board[selectPiecePosition[1]][selectPiecePosition[2]] = 0;

                    // captured position becomes empty grid
                    if ( (board[selectPiecePosition[1]+1][selectPiecePosition[2]+1] === 2) || (board[selectPiecePosition[1]+1][selectPiecePosition[2]+1] === 4) ) {
                        board[selectPiecePosition[1]+1][selectPiecePosition[2]+1] = 0;
                    }
                    else if ( (board[selectPiecePosition[1]+1][selectPiecePosition[2]-1] === 2) || (board[selectPiecePosition[1]+1][selectPiecePosition[2]+1] === 4) ){
                        board[selectPiecePosition[1]+1][selectPiecePosition[2]-1] = 0;
                    }
                }
            }
            else{
                console.log(`Illegal move`);
            }
        }


    }

    // Player 2
    else if (selectPiecePosition[0] === 'player2'){
        // If new position moves backwards, illegal move until become king
        if((newPosition[0] - selectPiecePosition[1]) > 0){
            console.log(`Illegal move. Cannot move backwards until Piece becomes king`);
        }
        // If new position more than 1 row from previous position, illegal move
        else if ( Math.abs(newPosition[0] - selectPiecePosition[1]) > 2 ){
            console.log(`Illegal move. Can only move into grid just after opponent grid `);
        }

        // If row is even
        else if(selectPiecePosition[1] %2 === 0){
            // If row is even and first box, only one legal move
            if( (board[selectPiecePosition[1]-1][selectPiecePosition[2]+1] === 1) && (selectPiecePosition[2] === 1) ){
                if(newPosition[1] === 3){
                    // Piece becomes king
                    if (selectPiecePosition[1] === 2) {
                        // Piece move to new position and becomes king = 4
                        board[newPosition[0]][3] = 4;

                        // initial position becomes empty grid
                        board[selectPiecePosition[1]][selectPiecePosition[2]] = 0;

                        // captured position becomes empty grid
                        board[selectPiecePosition[1]+1][selectPiecePosition[2]-1] = 0;
                    }
                    else{
                        // Piece move to new position
                        board[newPosition[0]][newPosition[1]] = 2;

                        // initial position becomes empty grid
                        board[selectPiecePosition[1]][selectPiecePosition[2]] = 0;

                        // captured position becomes empty grid
                        board[selectPiecePosition[1]-1][selectPiecePosition[2]+1] = 0;
                    }
                }
            }
            // If row is even and last box, only one legal move
            else if( (board[selectPiecePosition[1]-1][selectPiecePosition[2]-1] === 1) && (selectPiecePosition[2] === 7) ){
                if(newPosition[1] === 5){
                    // Piece becomes king
                    if (selectPiecePosition[1] === 2) {
                        // Piece move to new position and becomes king = 4
                        board[newPosition[0]][5] = 4;

                        // initial position becomes empty grid
                        board[selectPiecePosition[1]][selectPiecePosition[2]] = 0;

                        // captured position becomes empty grid
                        board[selectPiecePosition[1]+1][selectPiecePosition[2]-1] = 0;
                    }
                    else{
                        // Piece move to new position
                        board[newPosition[0]][newPosition[1]] = 2;

                        // initial position becomes empty grid
                        board[selectPiecePosition[1]][selectPiecePosition[2]] = 0;

                        // captured position becomes empty grid
                        board[selectPiecePosition[1]-1][selectPiecePosition[2]-1] = 0;
                    }
                }
            }
            else if ( ( ( (board[selectPiecePosition[1]-1][selectPiecePosition[2]+1] === 1) && (selectPiecePosition[2] + 2 === newPosition[1])) ) || ( (board[selectPiecePosition[1]-1][selectPiecePosition[2]-1] === 1) && (selectPiecePosition[2] - 2 === newPosition[1] ) ) ){
                // Piece becomes king
                if (selectPiecePosition[1] === 2) {
                    // Piece move to new position and becomes king = 4
                    board[newPosition[0]][newPosition[1]] = 4;

                    // initial position becomes empty grid
                    board[selectPiecePosition[1]][selectPiecePosition[2]] = 0;

                    // captured position becomes empty grid
                    if ( (board[selectPiecePosition[1]-1][selectPiecePosition[2]+1] === 1) || (board[selectPiecePosition[1]-1][selectPiecePosition[2]+1] === 3) ) {
                        board[selectPiecePosition[1]-1][selectPiecePosition[2]+1] = 0;
                    }
                    else if ( (board[selectPiecePosition[1]-1][selectPiecePosition[2]-1] === 1) || (board[selectPiecePosition[1]-1][selectPiecePosition[2]-1] === 3) ){
                        board[selectPiecePosition[1]-1][selectPiecePosition[2]-1] = 0;
                    }
                }
                else{
                    // Piece move to new position
                    board[newPosition[0]][newPosition[1]] = 2;

                    // initial position becomes empty grid
                    board[selectPiecePosition[1]][selectPiecePosition[2]] = 0;

                    // captured position becomes empty grid
                    if ( (board[selectPiecePosition[1]-1][selectPiecePosition[2]+1] === 1) || (board[selectPiecePosition[1]-1][selectPiecePosition[2]+1] === 3) ) {
                        board[selectPiecePosition[1]-1][selectPiecePosition[2]+1] = 0;
                    }
                    else if ( (board[selectPiecePosition[1]-1][selectPiecePosition[2]-1] === 1) || (board[selectPiecePosition[1]-1][selectPiecePosition[2]-1] === 3) ){
                        board[selectPiecePosition[1]-1][selectPiecePosition[2]-1] = 0;
                    }
                }
            }
            else{
                console.log(`Illegal move`);
            }
        }

        // If row is odd
        else if(selectPiecePosition[1] %2 != 0){
            // If row is odd and first box, only one legal move
            if( (board[selectPiecePosition[1]-1][selectPiecePosition[2]+1] === 1) && (selectPiecePosition[2] === 0) ){
                if(newPosition[1] === 2){
                    // Piece move to new position
                    board[newPosition[0]][newPosition[1]] = 2;

                    // initial position becomes empty grid
                    board[selectPiecePosition[1]][selectPiecePosition[2]] = 0;

                    // captured position becomes empty grid
                    board[selectPiecePosition[1]-1][selectPiecePosition[2]+1] = 0;
                }
            }
            // If row is odd and last box, only one legal move
            else if( (board[selectPiecePosition[1]-1][selectPiecePosition[2]-1] === 1) && (selectPiecePosition[2] === 6) ){
                if(newPosition[1] === 4){
                    // Piece move to new position
                    board[newPosition[0]][newPosition[1]] = 2;

                    // initial position becomes empty grid
                    board[selectPiecePosition[1]][selectPiecePosition[2]] = 0;

                    // captured position becomes empty grid
                    board[selectPiecePosition[1]-1][selectPiecePosition[2]-1] = 0;
                }
            }
            else if ( ( ( (board[selectPiecePosition[1]-1][selectPiecePosition[2]+1] === 1) && (selectPiecePosition[2] + 2 === newPosition[1])) ) || ( (board[selectPiecePosition[1]-1][selectPiecePosition[2]-1] === 1) && (selectPiecePosition[2] - 2 === newPosition[1] ) ) ){
                // Piece move to new position
                board[newPosition[0]][newPosition[1]] = 2;

                // initial position becomes empty grid
                board[selectPiecePosition[1]][selectPiecePosition[2]] = 0;

                // captured position becomes empty grid
                if (board[selectPiecePosition[1]-1][selectPiecePosition[2]+1] === 1) {
                    board[selectPiecePosition[1]-1][selectPiecePosition[2]+1] = 0;
                }
                else if (board[selectPiecePosition[1]-1][selectPiecePosition[2]-1] === 1){
                    board[selectPiecePosition[1]-1][selectPiecePosition[2]-1] = 0;
                }
            }
            else{
                console.log(`Illegal move`);
            }
        }
    }

}


//////////////////////////////////////////////////// Function to check if any player has won

const checkWin = () => {
    const allPieces = board.flat();
    if(!(allPieces.includes(1))){
        const nameDisplay = document.querySelector('.player-display');
        nameDisplay.textContent = `${playerOneName} Wins!!!`
    }
    else if(!(allPieces.includes(2))){
        const nameDisplay = document.querySelector('.player-display');
        nameDisplay.textContent = `${playerTwoName} Wins!!!`
    }
}