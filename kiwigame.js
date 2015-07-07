
module.exports = {
    isPartiallyValidBoard: isPartiallyValidBoard,
    solveKiwiGame: solveKiwiGame,
    isFullyValidBoard: isFullyValidBoard
};
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

    return cards.reduce(function(prev, card, cardIndex){
        var allOrientations = getAllOrientationsOfACard(card);
        var remainingCards = copyArrayExceptIndexAt(cards, +cardIndex);

        return prev || allOrientations.reduce(function(prev, orientedCard){
                var ownBoard = deepCopy(board);
                ownBoard[coordinates[0]][coordinates[1]] = orientedCard;

                return prev || solveKiwiGame(remainingCards, ownBoard, nextCoordinate(coordinates));
            }, null);
    }, null);
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
    return !!(noEmptyTiles(board) && isPartiallyValidBoard(board));
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