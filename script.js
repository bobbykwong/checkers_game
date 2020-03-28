
////////////////////////////////////////////////////Movement

// Variable to store selected piece position
let selectPiecePosition = [];
let newPosition = [];

const movePiece = (event) => {
    console.log(event.target.className);

    // if click is first click to select piece
    if (selectPiecePosition.length === 0) {
        //Change border colour of selected piece

        // store piece identity in variable
        selectPiece(event.target.className);
    }


    // If click is second click to determine position movement
    else if (selectPiecePosition.length === 3) {
        selectPiece(event.target.className);

        // Store new position in variable
        storeNewPosition(event.target.className);

        // If obstruction,


         // Choose new position to move to.


         // Else If no obstruction
        moveNoObstruction(event.target.className);

         // Choose new position to move to.


         // Adjust virtual board to reflect new position


         // display new Board
    }




}

// Store position of selected piece into variable
const selectPiece = (piece) => {
    // Determine Player
    if (piece.split(' ')[3] === 'player1'){
        selectPiecePosition.push('player1');

        // Determine row
        selectPiecePosition.push(piece.split(' ')[1].split('')[3]);

        // Determine column
        selectPiecePosition.push(piece.split(' ')[2].split('')[3]);
    }
    else if(piece.split(' ')[3] === 'player2'){
        selectPiecePosition.push('player2');

        // Determine row
        selectPiecePosition.push(piece.split(' ')[1].split('')[3]);

        // Determine column
        selectPiecePosition.push(piece.split(' ')[2].split('')[3]);
    }
}

// Store position of new position into variable
const storeNewPosition = (piece) => {

    // Determine if move legal
    if (piece.split(' ')[3] === `player1` || piece.split(' ')[3] === `player2` || piece.split(' ')[0] === `light`){
        console.log(`move not allowed`);
    }
    else{

        // Determine row
        newPosition.push(piece.split(' ')[1].split('')[3]);

        // Determine column
        newPosition.push(piece.split(' ')[2].split('')[3]);
    }
}


// Logic for movement without obstruction
const moveNoObstruction = (newPosition) => {

    // Determine if Player 1 or Player 2.

    if (selectPiecePosition[0] === 'player1') {

        // If row where select piece is on is even
        if ( selectPiecePosition[1] %2 === 0 ) {

        }


    }


    // Player 2 movement
}







/////////////////////////Create Board

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


//////////////////////////////////////Create Virtual Board to keep track of pieces

// 0 means empty grid, 1 is Player 1 and 2 is Player 2;
let board = [];
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


///////////////////////////////////////Create function to position pieces on UI

const displayPieces = () =>{
    // debugger;
    for (var d=0; d<8; d++){
        let colCounter = 0;
        for (var e=0; e<8; e++){
            // Specify Grid
            const grid = document.getElementsByClassName(`row${d} col${e}`)[0];

            // Manipulate Grid to show piece or remain as empty grid
            if(board[d][e] === 1){
                grid.classList.add('player1')
            }
            else if(board[d][e] === 2){
                grid.classList.add('player2')
            }

            colCounter++;
        }
    }
}

displayPieces()