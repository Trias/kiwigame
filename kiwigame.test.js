var kiwigame = require('./kiwigame');
var expect = require('chai').expect;

describe("Kiwigame", function() {
    describe("isPartiallyValid",function() {
        it("should validate an empty board", function () {
            var board = [
                [null, null, null],
                [null, null, null],
                [null, null, null]
            ];

            expect(kiwigame.isPartiallyValidBoard(board)).to.eql(true);
        });

        it("should validate an board with one card", function () {
            var board = [
                ['BKrw', null, null],
                [null, null, null],
                [null, null, null]
            ];

            expect(kiwigame.isPartiallyValidBoard(board)).to.eql(true);

            board = [
                [null, 'BKrw', null],
                [null, null, null],
                [null, null, null]
            ];

            expect(kiwigame.isPartiallyValidBoard(board)).to.eql(true);

            board = [
                [null, null, null],
                [null, null, null],
                [null, null, 'BKrw']
            ];

            expect(kiwigame.isPartiallyValidBoard(board)).to.eql(true);
        });
        it("should validate an board with two cards", function () {
            var board = [
                ['BKrw', 'RKrw', null],
                [null, null, null],
                [null, null, null]
            ];

            expect(kiwigame.isPartiallyValidBoard(board)).to.eql(true);

            board = [
                [null, 'BKrr', null],
                [null, 'BRrw', null],
                [null, null, null]
            ];

            expect(kiwigame.isPartiallyValidBoard(board)).to.eql(true);

            board = [
                [null, null, null],
                [null, 'BKrw', null],
                [null, null, 'BKrw']
            ];

            expect(kiwigame.isPartiallyValidBoard(board)).to.eql(true);
        });
        it("should validate an board with three cards", function () {
            var board = [
                ['BKrw', 'RKrw', 'Rrrr'],
                [null, null, null],
                [null, null, null]
            ];

            expect(kiwigame.isPartiallyValidBoard(board)).to.eql(true);

            board = [
                [null, 'BKrr', null],
                [null, 'BRrW', null],
                [null, 'wwRr', null]
            ];

            expect(kiwigame.isPartiallyValidBoard(board)).to.eql(true);

            board = [
                ['BKbw', 'BKrw', null],
                [null, 'BWrw', 'Rwbk'],
                [null, null, 'BKrw']
            ];

            expect(kiwigame.isPartiallyValidBoard(board)).to.eql(true);
        });
        it("should not validate an board with illegal configuration", function () {
            var board = [
                ['BKrw', 'RKrw', 'rrrr'],
                [null, null, null],
                [null, null, null]
            ];

            expect(kiwigame.isPartiallyValidBoard(board)).to.eql(false);

            board = [
                [null, 'BKrr', null],
                [null, 'BRrW', null],
                [null, 'wWRr', null]
            ];

            expect(kiwigame.isPartiallyValidBoard(board)).to.eql(false);

            board = [
                ['BKrw', 'BKrw', null],
                [null, 'BKrw', null],
                [null, null, 'BKrw']
            ];

            expect(kiwigame.isPartiallyValidBoard(board)).to.eql(false);

        });
    });
    describe("isFullyValid",function() {
        it("should fully validate an board", function () {
            var board = [
                ['BKrw', 'RKrw', 'RRrr'],
                ['BWrw', 'RWrw', 'RRrr'],
                ['BWrw', 'RWrw', 'RRRr']
            ];

            expect(kiwigame.isFullyValidBoard(board)).to.eql(true);

            board = [
                ['RrRr', 'rRrR', 'RrRr'],
                ['rRrR', 'RrRr', 'rRrR'],
                ['RrRr', 'rRrR', 'RrRr']
            ];

            expect(kiwigame.isFullyValidBoard(board)).to.eql(true);
        });
        it("should not validate an empty board as a fully valid board", function () {
            var board = [
                [null, null, null],
                [null, null, null],
                [null, null, null]
            ];
            expect(kiwigame.isFullyValidBoard(board)).to.eql(false);
        });
        it("should validate an valid full board as a fully valid board", function () {
            var board = [
                ['RrRr', 'rRrR', 'RrRr'],
                ['rRrR', 'RrRr', 'rRrR'],
                ['RrRr', 'rRrR', 'RrRr']
            ];
            expect(kiwigame.isFullyValidBoard(board)).to.eql(true);

            board = [
                ['rrrr', 'RRRR', 'rrrr'],
                ['RRRR', 'rrrr', 'RRRR'],
                ['rrrr', 'RRRR', 'rrrr']
            ];
            expect(kiwigame.isFullyValidBoard(board)).to.eql(true);
        });
        it("should not validate a partially valid board as a fully valid board", function () {
            var board = [
                ['RrRr', 'rRrR', 'RrRr'],
                ['rRrR', 'RrRr', 'rRrR'],
                ['RrRr', 'rRrR', null]
            ];
            expect(kiwigame.isFullyValidBoard(board)).to.eql(false);
        });
    });
    describe("solve Kiwi game",function(){
        it("should should solve a kiwigame with stupid cards", function(){
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
            var solution = [
                ['rrrr', 'RRRR', 'rrrr'],
                ['RRRR', 'rrrr', 'RRRR'],
                ['rrrr', 'RRRR', 'rrrr']
            ];

            expect(kiwigame.solveKiwiGame(cards)).to.deep.equal(solution);
        });
        it("should solve a kiwi game with less stupid cards", function(){
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

            var actual = kiwigame.solveKiwiGame(cards);

            expect(actual).not.to.eql(null);
            expect(kiwigame.isFullyValidBoard(actual)).to.eql(true);
        });
        it("Should solve kiwi game with real cards", function(){
            var cards = [
                "BKrw",
                "BKrw",
                "RBkw",
                "RWbk",
                "RKbw",
                "BWkr",
                "BRwk",
                "BKbw",
                "RWrk"
            ];
            var actual = kiwigame.solveKiwiGame(cards);
            expect(kiwigame.isFullyValidBoard(actual)).to.eql(true);
        });
    });
});