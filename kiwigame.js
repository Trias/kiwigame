/**
 * Created by stefanackermann on 05.07.15.
 */

const EMPTY_BOARD = [
    [null, null, null],
    [null, null, null],
    [null, null, null]
];

const TOP_LEFT = [0,0];

function copyArrayExceptIndexAt(arr, index) {
    return arr.slice(0, index).concat(arr.slice(index + 1, arr.length));
}
function solveKiwiGame(cards, board, coordinates){
    if(!board){
        board = EMPTY_BOARD;
    }
    if(!coordinates){
        coordinates = TOP_LEFT;
    }
    if(!isPartiallyValidBoard(board)){
        return null;
    }
    if(isFullyValidBoard(board)){
        return board;
    }

    var ownBoard = deepCopy(board);

    for(var cardIndex in cards){
        var card = cards[+cardIndex];
        var allOrientations = getAllOrientationsOfACard(card);
        var remainingCards = copyArrayExceptIndexAt(cards, +cardIndex);

        if(remainingCards.length!=cards.length-1) {
            console.log(cards, cardIndex, remainingCards);
            throw Error();
        }

        for (var orientedCard in allOrientations){
            ownBoard[coordinates[0]][coordinates[1]] = allOrientations[+orientedCard];

            if(coordinates[0]>1){
                console.log(cards.length, ownBoard, remainingCards, cards, coordinates);
            }

            var solutionCandidate = solveKiwiGame(remainingCards, ownBoard, nextCoordinate(coordinates));
            if(solutionCandidate) {
                return solutionCandidate;
            }
        }
    }

    return null;
}

function deepCopy(arr) {
    return JSON.parse(JSON.stringify(arr));
}


function rotateCardCounterClockwise(card, times){
    if(times==0){
        return card;
    }else{
        return rotateCardCounterClockwise(card.substring(1) + card.charAt(0), times-1);
    }
}

function getAllOrientationsOfACard(card){
    return [
        rotateCardCounterClockwise(card, 0),
        rotateCardCounterClockwise(card, 1),
        rotateCardCounterClockwise(card, 2),
        rotateCardCounterClockwise(card, 3)
    ];
}

function isPartiallyValidBoard(board){
    return board.reduce(function(prev, row, rowIndex){
        return prev && row.reduce(function(prev, card, columnIndex){
            var relatedCards = getRelatedCards([rowIndex, columnIndex], board);

            return prev && relatedCards.reduce(function(prev, relatedCard, direction){
                if(relatedCard && card){
                    return prev && cardsFit(card, relatedCard, direction);
                }else{
                    return prev;
                }
            }, true);
        }, true);
    }, true);
}

function isFullyValidBoard(board){
    return noEmptyTiles(board) && isPartiallyValidBoard(board);
}

function noEmptyTiles(board){
    return board.reduce(function(prev, row){
        return prev && row.reduce(function(prev, card){
                return prev && card;
            }, true);
    }, true);
}

function cardsFit(card, relatedCard, directionFromFirstToSecondCard){
    var relevantFirstKiwiPart = getRelevantKiwiPart(card, directionFromFirstToSecondCard);
    var relevantSecondKiwiPart = getRelevantKiwiPart(relatedCard, (directionFromFirstToSecondCard+2)%4);
    return kiwiPartsFit(relevantFirstKiwiPart, relevantSecondKiwiPart);
}

function kiwiPartsFit(firstKiwiPart, secondKiwiPart) {
    return firstKiwiPart.toLowerCase() == secondKiwiPart.toLowerCase() && firstKiwiPart != secondKiwiPart;
}

function getRelevantKiwiPart(card, directionFrom) {
    return card.charAt(directionFrom);
}

function getRelatedCards(coordinates, board){
    return [
        cardOnBoard(leftOf(coordinates), board),
        cardOnBoard(topOf(coordinates), board),
        cardOnBoard(rightOf(coordinates), board),
        cardOnBoard(bottomOf(coordinates), board)
    ]
}

function nextCoordinate(coordinates){
    if(onBoard(rightOf(coordinates))){
        return rightOf(coordinates);
    }else{
        var nextCandidate = [
            coordinates[0]+1, 0
        ];
        if(onBoard(nextCandidate)) {
            return nextCandidate;
        }else{
            return null;
        }
    }
}

function leftOf(coordinates){
    return [
        coordinates[0],
        coordinates[1]-1
    ]
}

function topOf(coordinates){
    return [
        coordinates[0]-1,
        coordinates[1]
    ]
}

function rightOf(coordinates){
    return [
        coordinates[0],
        coordinates[1]+1
    ]
}

function bottomOf(coordinates){
    return [
        coordinates[0]+1,
        coordinates[1]
    ]
}

function cardOnBoard(coordinates, board){
    if(!onBoard(coordinates)){
        return null;
    }else {
        return board[coordinates[0]][coordinates[1]];
    }
}

function onBoard(coordinates){
    return !(coordinates[0]>2 || coordinates[1]>2 || coordinates[0]<0 || coordinates[1]<0);
}

function testEmptyBordShouldBeValid(){
    var board = [
        [null, null, null],
        [null, null, null],
        [null, null, null]
    ];

    var result = isPartiallyValidBoard(board);

    if (!result) throw new Error(); else console.log('pass testEmptyBordShouldBeValid');
}

function testOneTileOnBoardBordShouldBeValid(){
    var board = [
        ['BKrw', null, null],
        [null, null, null],
        [null, null, null]
    ];

    var result = isPartiallyValidBoard(board);

    if (!result) throw new Error(); else console.log('pass testOneTileOnBoardBordShouldBeValid1');

    board = [
        [null, 'BKrw', null],
        [null, null, null],
        [null, null, null]
    ];

    result = isPartiallyValidBoard(board);

    if (!result) throw new Error(); else console.log('pass testOneTileOnBoardBordShouldBeValid2');

    board = [
        [null, null, null],
        [null, null, null],
        [null, null, 'BKrw']
    ];

    result = isPartiallyValidBoard(board);

    if (!result) throw new Error(); else console.log('pass testOneTileOnBoardBordShouldBeValid3');
}

function testTwoTilesOnBoardBordShouldBeValid(){
    var board = [
        ['BKrw', 'RKrw', null],
        [null, null, null],
        [null, null, null]
    ];

    var result = isPartiallyValidBoard(board);

    if (!result) throw new Error(); else console.log('pass testTwoTilesOnBoardBordShouldBeValid1');

    board = [
        [null, 'BKrr', null],
        [null, 'BRrw', null],
        [null, null, null]
    ];

    result = isPartiallyValidBoard(board);

    if (!result) throw new Error(); else console.log('pass testTwoTilesOnBoardBordShouldBeValid2');

    board = [
        [null, null, null],
        [null, 'BKrw', null],
        [null, null, 'BKrw']
    ];

    result = isPartiallyValidBoard(board);

    if (!result) throw new Error(); else console.log('pass testTwoTilesOnBoardBordShouldBeValid3');
}

function testThreeTilesOnBoardBordShouldBeValid(){
    var board = [
        ['BKrw', 'RKrw', 'Rrrr'],
        [null, null, null],
        [null, null, null]
    ];

    var result = isPartiallyValidBoard(board);

    if (!result) throw new Error(); else console.log('pass testThreeTilesOnBoardBordShouldBeValid1');

    board = [
        [null, 'BKrr', null],
        [null, 'BRrw', null],
        [null, 'wWRr', null]
    ];

    result = isPartiallyValidBoard(board);

    if (!result) throw new Error(); else console.log('pass testThreeTilesOnBoardBordShouldBeValid2');

    board = [
        ['BKrw', null, null],
        [null, 'BKrw', null],
        [null, null, 'BKrw']
    ];

    result = isPartiallyValidBoard(board);

    if (!result) throw new Error(); else console.log('pass testThreeTilesOnBoardBordShouldBeValid3');
}

function testIllegalTilesOnBoardBordShouldBeInvalid(){
    var board = [
        ['BKrw', 'RKrw', 'rrrr'],
        [null, null, null],
        [null, null, null]
    ];

    var result = isPartiallyValidBoard(board);

    if (result) throw new Error(); else console.log('pass testThreeIllegalTilesOnBoardBordShouldBeInvalid1');

    board = [
        [null, 'BKrr', null],
        [null, 'BRrW', null],
        [null, 'wWRr', null]
    ];

    result = isPartiallyValidBoard(board);

    if (result) throw new Error(); else console.log('pass testThreeTilesOnBoardBordShouldBeValid2');

    board = [
        ['BKrw', 'BKrw', null],
        [null, 'BKrw', null],
        [null, null, 'BKrw']
    ];

    result = isPartiallyValidBoard(board);

    if (result) throw new Error(); else console.log('pass testThreeTilesOnBoardBordShouldBeValid3');
}

function testFullBoardBordShouldBeValid(){
    var board = [
        ['BKrw', 'RKrw', 'RRrr'],
        ['BWrw', 'RWrw', 'RRrr'],
        ['BWrw', 'RWrw', 'RRRr']
    ];

    var result = isPartiallyValidBoard(board);

    if (!result) throw new Error(); else console.log('pass testFullBoardBordShouldBeValid1');

    board = [
        ['RrRr', 'rRrR', 'RrRr'],
        ['rRrR', 'RrRr', 'rRrR'],
        ['RrRr', 'rRrR', 'RrRr']
    ];

    result = isPartiallyValidBoard(board);

    if (!result) throw new Error(); else console.log('pass testFullBoardBordShouldBeValid2');
}

function testEmptyBoardIsNotAFullyValidBoard() {
    var board = [
        [null, null, null],
        [null, null, null],
        [null, null, null]
    ];
    var result = isFullyValidBoard(board);
    if (result) throw new Error(); else console.log('pass testEmptyBoardIsNotAFullyValidBoard');
}

function testValidBoardIsAFullyValidBoard1() {
    var board = [
        ['RrRr', 'rRrR', 'RrRr'],
        ['rRrR', 'RrRr', 'rRrR'],
        ['RrRr', 'rRrR', 'RrRr']
    ];
    var result = isFullyValidBoard(board);
    if (!result) throw new Error(); else console.log('pass testValidBoardIsAFullyValidBoard1');
}

function testValidBoardIsAFullyValidBoard2() {
    var board = [
        [ 'rrrr', 'RRRR', 'rrrr' ],
        [ 'RRRR', 'rrrr', 'RRRR' ],
        [ 'rrrr', 'RRRR', 'rrrr' ]
    ];
    var result = isFullyValidBoard(board);
    if (!result) throw new Error(); else console.log('pass testValidBoardIsAFullyValidBoard2');
}

function testPartiallyValidBoardIsNotAFullyValidBoard() {
    var board = [
        ['RrRr', 'rRrR', 'RrRr'],
        ['rRrR', 'RrRr', 'rRrR'],
        ['RrRr', 'rRrR', null]
    ];
    var result = isFullyValidBoard(board);
    if (result) throw new Error(); else console.log('pass testPartiallyValidBoardIsNotAFullyValidBoard');
}

function testSolveKiwiGameWithStupidCards(){
    var cards = [
        "rrrr",
        "RRRR",
        "rrrr",
        "RRRR",
        "rrrr",
        "RRRR",
        "rrrr",
        "RRRR",
        "rrrr"
    ];
    var solution = solveKiwiGame(cards);
    console.log(solution);
    var result = solution && solution[0][0] == 'rrrr'
        && solution[1][0] == 'RRRR'
        && solution[2][0] == 'rrrr'
        && solution[0][1] == 'RRRR'
        && solution[1][1] == 'rrrr'
        && solution[2][1] == 'RRRR'
        && solution[0][2] == 'rrrr'
        && solution[1][2] == 'RRRR'
        && solution[2][2] == 'rrrr';

    if (!result) throw new Error(); else console.log('pass testSolveKiwiGameWithStupidCards');
}

function testSolveKiwiGameWithLessStupidCards(){
    var cards = [
        "rrrr",
        "RWRW",
        "rwrr",
        "RRRR",
        "rrrr",
        "RRRR",
        "rrrr",
        "RRRR",
        "rrrr"
    ];
    var solution = solveKiwiGame(cards);
    console.log(solution);
    var result = solution && solution[0][0] == 'rrrr'
        && solution[1][0] == 'RRRR'
        && solution[2][0] == 'rrrr'
        && solution[0][1] == 'RWRW'
        && solution[1][1] == 'rwrr'
        && solution[2][1] == 'RRRR'
        && solution[0][2] == 'rrrr'
        && solution[1][2] == 'RRRR'
        && solution[2][2] == 'rrrr';

    if (!result) throw new Error(); else console.log('pass testSolveKiwiGameWithLessStupidCards');
}

function testSolveKiwiGameWithRealCards(){
    var cards = [
        "BKrw",//
        "BKrw",//
        "RBkw",//
        "RWbk",//
        "RKbw",//
        "BWkr",//
        "BRwk",//
        "BKbw",
        "RWrk"
    ];
    var solution = solveKiwiGame(cards);
    console.log(solution);
    //var result = solution && solution[0][0] == 'rrrr'
    //    && solution[1][0] == 'RRRR'
    //    && solution[2][0] == 'rrrr'
    //    && solution[0][1] == 'RRRR'
    //    && solution[1][1] == 'rrrr'
    //    && solution[2][1] == 'RRRR'
    //    && solution[0][2] == 'rrrr'
    //    && solution[1][2] == 'RRRR'
    //    && solution[2][2] == 'rrrr';

    //if (!result) throw new Error(); else console.log('pass testSolveKiwiGameWithStupidCards');
}

testEmptyBordShouldBeValid();
testOneTileOnBoardBordShouldBeValid();
testTwoTilesOnBoardBordShouldBeValid();
testThreeTilesOnBoardBordShouldBeValid();
testIllegalTilesOnBoardBordShouldBeInvalid();
testFullBoardBordShouldBeValid();
testEmptyBoardIsNotAFullyValidBoard();
testValidBoardIsAFullyValidBoard1();
testValidBoardIsAFullyValidBoard2();
testPartiallyValidBoardIsNotAFullyValidBoard();
testSolveKiwiGameWithStupidCards();
testSolveKiwiGameWithLessStupidCards();
//testSolveKiwiGameWithMoreDifficultCards();
testSolveKiwiGameWithRealCards();