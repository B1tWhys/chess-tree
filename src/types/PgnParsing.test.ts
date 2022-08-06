import {MoveNode} from './MoveNode';
import GameTree from "./GameTree";

function moveNodeFromPgn(pgn: string): MoveNode {
    let tree = GameTree.fromPgnStr(pgn);
    return tree.firstMoves.length ? tree.firstMoves[0] : null;
}

function minimalMoveObject(name: string, isWhiteTurn: boolean, children: Array<Object>) {
    return {
        name: name,
        isWhiteTurn: isWhiteTurn,
        children: children
    };
}

describe("When creating a game tree from PGN", function () {
    test("An empty game should result in empty tree", () => {
        let result = moveNodeFromPgn("[Event \"?\"]\n" +
            "[Site \"?\"]\n" +
            "[Date \"????.??.??\"]\n" +
            "[Round \"?\"]\n" +
            "[White \"?\"]\n" +
            "[Black \"?\"]\n" +
            "[Result \"*\"]\n" +
            "\n" +
            "*");
        expect(result).toBeNull();
    });

    test("A 1 ply game should return a root node with no children", () => {
        let result = moveNodeFromPgn( "1. d3 *");

        expect(result).toBeTruthy();
        expect(result).toMatchObject(minimalMoveObject("d3", true, []));
    });

    test("A linear 2 ply game returns a root & single child", () => {
        let result = moveNodeFromPgn("1. d3 d6 *");
        expect(result).toMatchObject({
            name: "d3",
            isWhiteTurn: true,
            children: [{name: "d6", isWhiteTurn: false, children: []}]
        });

        expect(result).toMatchObject(
            minimalMoveObject("d3", true,
                [minimalMoveObject("d6", false, [])
                ]
            )
        )
    });

    test("A linear 3 ply game returns a root with a child with a child", () => {
        let result = moveNodeFromPgn("1. d3 d6 2. e4 *");


        expect(result).toMatchObject(
            minimalMoveObject("d3", true, [
                minimalMoveObject("d6", false, [
                    minimalMoveObject("e4", true, [])
                ])
            ])
        );
    });

    test("A game with 2 variations of ply 2 is handled properly", () => {
        let result = moveNodeFromPgn("1. d3 d6 (1... e6) *");
        expect(result).toMatchObject(
            minimalMoveObject("d3", true, [
                minimalMoveObject("d6", false, []),
                minimalMoveObject("e6", false, [])
            ])
        )
    });

    test("A game with 3 variations of ply 2 is handled properly", () => {
        let result = moveNodeFromPgn("1. d3 d6 (1... e6) (1... f6) *");

        expect(result).toMatchObject(
            minimalMoveObject("d3", true, [
                minimalMoveObject("d6", false, []),
                minimalMoveObject("e6", false, []),
                minimalMoveObject("f6", false, [])
            ])
        )
    });

    test("A tree with 2 variations at ply 3 are handled properly", () => {
        let result = moveNodeFromPgn("1. d3 d6 2. e3 (2. e4) *");
        expect(result).toMatchObject(minimalMoveObject("d3", true, [
            minimalMoveObject("d6", false, [
                minimalMoveObject("e3", true, []),
                minimalMoveObject("e4", true, [])
            ])
        ]))
    });

    test("A multi-ply variation is handled properly", () => {
        let result = moveNodeFromPgn("1. d3 d6 (1... e6 2. e4 f6) *");
        expect(result).toMatchObject(minimalMoveObject("d3", true, [
            minimalMoveObject("d6", false, []),
            minimalMoveObject("e6", false, [
                minimalMoveObject("e4", true, [
                    minimalMoveObject("f6", false, [])
                ])
            ])
        ]));
    });

    test("Singly nested variations of ply 2 are handled properly", () => {
        let result = moveNodeFromPgn("1. d3 d6 (1... e6 2. e4 f6 (2... f5 3. exf5) 3. g3) *");
        expect(result).toMatchObject(minimalMoveObject("d3", true, [
            minimalMoveObject("d6", false, []),
            minimalMoveObject("e6", false, [
                minimalMoveObject("e4", true, [
                    minimalMoveObject("f6", false, [
                        minimalMoveObject("g3", true, []),
                    ]),
                    minimalMoveObject("f5", false, [
                        minimalMoveObject("exf5", true, [])
                    ])
                ])
            ])
        ]));
    });

    test("Singly nested variations of ply 3 are handled properly", () => {
        let result = moveNodeFromPgn("1. d3 d6 2. e4 (2. e3 f6 (2... f5) 3. f4) *");
        expect(result).toMatchObject(minimalMoveObject("d3", true, [
            minimalMoveObject("d6", false, [
                minimalMoveObject("e4", true, []),
                minimalMoveObject("e3", true, [
                    minimalMoveObject("f6", false, [
                        minimalMoveObject("f4", true, [])
                    ]),
                    minimalMoveObject("f5", false, [])
                ])
            ])
        ]))
    })
});

function compareIgnoringWhitespace(actual: string, expected: string) {
    let removeSpaces = (s) => s.replace(/\s/g, '');
    expect(removeSpaces(actual)).toEqual(removeSpaces(expected));
}

describe("When converting a move tree to PGN", function () {
    test("An empty game tree results in correct PGN", () => {
        const gt = new GameTree([]);
        const result = gt.toPgn();
        expect(result).toEqual("*");
    });

    test("A single node game tree is encoded properly", () => {
        const pgnStr = "1. d3 *";
        const result = GameTree.fromPgnStr(pgnStr).toPgn();
        expect(result).toEqual(pgnStr);
    });

    test("A linear game tree is encoded properly", () => {
        const pgnStr = "1. d4 d5 2. e4 e5 3. f4 f5 *";
        const result = GameTree.fromPgnStr(pgnStr).toPgn();
        expect(result).toEqual(pgnStr);
    });

    test("A complicated game tree is encoded properly", () => {
        const pgnStr = "1. d4 (1. a4 a5 2. b4 (2. c3 c6 (2... e5 3. e4 f6)) 2... b5) 1... d5 2. e4 e5 (2... f6 3. g3 g5) 3. f4 f5 *";
        const result = GameTree.fromPgnStr(pgnStr).toPgn();
        compareIgnoringWhitespace(result, pgnStr);
    });
});

describe("When merging game trees", function () {
    test("First moves are merged", () => {
        const tree1 = GameTree.fromPgnStr("1. a3 (1. b3) *");
        const tree2 = GameTree.fromPgnStr("1. c3 (1. d3) *");
        const tree3 = GameTree.fromPgnStr("1. c3 (1. e3) *");
        const merged = GameTree.merge(tree1, tree2, tree3);
        const expected = "1. a3 (1. b3) (1. c3) (1. d3) (1. e3) *";

        compareIgnoringWhitespace(merged.toPgn(), expected);
    });

    test("Second moves are merged", () => {
        const tree1 = GameTree.fromPgnStr("1. a3 a6 (1... b6) *");
        const tree2 = GameTree.fromPgnStr("1. a3 a6 (1... c6) *");
        const tree3 = GameTree.fromPgnStr("1. a3 a6 (1... d6) *");
        const merged = GameTree.merge(tree1, tree2, tree3);
        const expected = "1. a3 a6 (1... b6) (1... c6) (1... d6) *";

        compareIgnoringWhitespace(merged.toPgn(), expected);
    });

    test("Deeply nested variations are merged", () => {
        const tree1 = GameTree.fromPgnStr("1. a3 a6 (1... b6 2. b3 (2. c3 c6 (2... d6))) *");
        const tree2 = GameTree.fromPgnStr("1. a3 a6 (1... b6 2. b3 (2. c3 c6 (2... e6)) (2. d3)) *");
        const tree3 = GameTree.fromPgnStr("1. a3 (1. b3) 1... a6 (1... b6 2. b3 (2. c3 c6 (2... f6) (2... g6)) (2. e3)) *");
        const merged = GameTree.merge(tree1, tree2, tree3);
        const expected = "1. a3 (1. b3) 1... a6 (1... b6 2. b3 (2. c3 c6 (2... d6) (2... e6) (2... f6) (2... g6)) (2. d3) (2. e3)) *";

        compareIgnoringWhitespace(merged.toPgn(), expected);
    })
});

describe('When converting a move node to FEN', function () {
    test("FEN is calculated correctly for linear series of moves", () => {
        const pgnStr = "1. a4 h5 2. a5 b5 3. axb6 cxb6 4. Nc3 b5 5. Nxb5";
        let moveNode = GameTree.fromPgnStr(pgnStr).firstMoves[0];

        expect(moveNode.fen).toEqual("rnbqkbnr/pppppppp/8/8/P7/8/1PPPPPPP/RNBQKBNR b KQkq - 0 1");
        moveNode = moveNode.children[0];
        expect(moveNode.fen).toEqual("rnbqkbnr/ppppppp1/8/7p/P7/8/1PPPPPPP/RNBQKBNR w KQkq - 0 2");
        moveNode = moveNode.children[0];
        expect(moveNode.fen).toEqual("rnbqkbnr/ppppppp1/8/P6p/8/8/1PPPPPPP/RNBQKBNR b KQkq - 0 2");
        moveNode = moveNode.children[0];
        expect(moveNode.fen).toEqual("rnbqkbnr/p1ppppp1/8/Pp5p/8/8/1PPPPPPP/RNBQKBNR w KQkq b6 0 3");
        moveNode = moveNode.children[0];
        expect(moveNode.fen).toEqual("rnbqkbnr/p1ppppp1/1P6/7p/8/8/1PPPPPPP/RNBQKBNR b KQkq - 0 3");
        moveNode = moveNode.children[0];
        expect(moveNode.fen).toEqual("rnbqkbnr/p2pppp1/1p6/7p/8/8/1PPPPPPP/RNBQKBNR w KQkq - 0 4");
        moveNode = moveNode.children[0];
        expect(moveNode.fen).toEqual("rnbqkbnr/p2pppp1/1p6/7p/8/2N5/1PPPPPPP/R1BQKBNR b KQkq - 1 4");
        moveNode = moveNode.children[0];
        expect(moveNode.fen).toEqual("rnbqkbnr/p2pppp1/8/1p5p/8/2N5/1PPPPPPP/R1BQKBNR w KQkq - 0 5");
        moveNode = moveNode.children[0];
        expect(moveNode.fen).toEqual("rnbqkbnr/p2pppp1/8/1N5p/8/8/1PPPPPPP/R1BQKBNR b KQkq - 0 5");
    });

    test("FEN is calculated properly multiple first moves", () => {
        let gameTree = GameTree.fromPgnStr("1. a3 (1. b3) 1... a6 *");
        expect(gameTree.firstMoves.length).toEqual(2);

        let a3 = gameTree.firstMoves[0];
        expect(a3.fen).toEqual("rnbqkbnr/pppppppp/8/8/8/P7/1PPPPPPP/RNBQKBNR b KQkq - 0 1");
        let b3 = gameTree.firstMoves[1];
        expect(b3.fen).toEqual("rnbqkbnr/pppppppp/8/8/8/1P6/P1PPPPPP/RNBQKBNR b KQkq - 0 1");

        let a6 = a3.children[0];
        expect(a6.fen).toEqual("rnbqkbnr/1ppppppp/p7/8/8/P7/1PPPPPPP/RNBQKBNR w KQkq - 0 2");
    })
});
