import {MoveNode} from './MoveNode';
import GameTree from "./GameTree";

function moveNodeFromPgn(pgn: string): MoveNode {
    let tree = GameTree.fromPgnStr(pgn);
    return tree.firstMoves.length ? tree.firstMoves[0] : null;
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
        expect(result).toMatchObject(new MoveNode("d3", true, []));
    });

    test("A linear 2 ply game returns a root & single child", () => {
        let result = moveNodeFromPgn("1. d3 d6 *");
        expect(result).toMatchObject(new MoveNode("d3", true, [
            new MoveNode("d6", false, [])
        ]));
    });

    test("A linear 3 ply game returns a root with a child with a child", () => {
        let result = moveNodeFromPgn("1. d3 d6 2. e4 *");
        expect(result).toMatchObject(new MoveNode("d3", true, [
            new MoveNode("d6", false, [
                new MoveNode("e4", true, [])
            ])
        ]));
    });

    test("A game with 2 variations of ply 2 is handled properly", () => {
        let result = moveNodeFromPgn("1. d3 d6 (1... e6) *");
        expect(result).toMatchObject(new MoveNode("d3", true, [
            new MoveNode("d6", false, []),
            new MoveNode("e6", false, [])
        ]))
    });

    test("A game with 3 variations of ply 2 is handled properly", () => {
        let result = moveNodeFromPgn("1. d3 d6 (1... e6) (1... f6) *");

        expect(result).toMatchObject(new MoveNode("d3", true, [
            new MoveNode("d6", false, []),
            new MoveNode("e6", false, []),
            new MoveNode("f6", false, [])
        ]))
    });

    test("A tree with 2 variations at ply 3 are handled properly", () => {
        let result = moveNodeFromPgn("1. d3 d6 2. e3 (2. e4) *");
        expect(result).toMatchObject(new MoveNode("d3", true, [
            new MoveNode("d6", false, [
                new MoveNode("e3", true, []),
                new MoveNode("e4", true, [])
            ])
        ]))
    });

    test("A multi-ply variation is handled properly", () => {
        let result = moveNodeFromPgn("1. d3 d6 (1... e6 2. e4 f6) *");
        expect(result).toMatchObject(new MoveNode("d3", true, [
            new MoveNode("d6", false, []),
            new MoveNode("e6", false, [
                new MoveNode("e4", true, [
                    new MoveNode("f6", false, [])
                ])
            ])
        ]));
    });

    test("Singly nested variations of ply 2 are handled properly", () => {
        let result = moveNodeFromPgn("1. d3 d6 (1... e6 2. e4 f6 (2... f5 3. exf5) 3. g3) *");
        expect(result).toMatchObject(new MoveNode("d3", true, [
            new MoveNode("d6", false, []),
            new MoveNode("e6", false, [
                new MoveNode("e4", true, [
                    new MoveNode("f6", false, [
                        new MoveNode("g3", true, []),
                    ]),
                    new MoveNode("f5", false, [
                        new MoveNode("exf5", true, [])
                    ])
                ])
            ])
        ]));
    });

    test("Singly nested variations of ply 3 are handled properly", () => {
        let result = moveNodeFromPgn("1. d3 d6 2. e4 (2. e3 f6 (2... f5) 3. f4) *");
        expect(result).toMatchObject(new MoveNode("d3", true, [
            new MoveNode("d6", false, [
                new MoveNode("e4", true, []),
                new MoveNode("e3", true, [
                    new MoveNode("f6", false, [
                        new MoveNode("f4", true, [])
                    ]),
                    new MoveNode("f5", false, [])
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
})