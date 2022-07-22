import {MoveNode} from './MoveNode';

describe("When converting moves to a hierarchy", function () {
    test("An empty game should result in null", () => {
        let result = MoveNode.fromPgn("[Event \"?\"]\n" +
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
        let result = MoveNode.fromPgn( "1. d3 *");

        expect(result).toBeTruthy();
        expect(result).toMatchObject(new MoveNode("d3", "w", []));
    });

    test("A linear 2 ply game returns a root & single child", () => {
        let result = MoveNode.fromPgn("1. d3 d6 *");
        expect(result).toMatchObject(new MoveNode("d3", "w", [
            new MoveNode("d6", "b", [])
        ]));
    });

    test("A linear 3 ply game returns a root with a child with a child", () => {
        let result = MoveNode.fromPgn("1. d3 d6 2. e4 *");
        expect(result).toMatchObject(new MoveNode("d3", "w", [
            new MoveNode("d6", "b", [
                new MoveNode("e4", "w", [])
            ])
        ]));
    });

    test("A game with 2 variations of ply 2 is handled properly", () => {
        let result = MoveNode.fromPgn("1. d3 d6 (1... e6) *");
        expect(result).toMatchObject(new MoveNode("d3", "w", [
            new MoveNode("d6", "b", []),
            new MoveNode("e6", "b", [])
        ]))
    });

    test("A game with 3 variations of ply 2 is handled properly", () => {
        let result = MoveNode.fromPgn("1. d3 d6 (1... e6) (1... f6) *");

        expect(result).toMatchObject(new MoveNode("d3", "w", [
            new MoveNode("d6", "b", []),
            new MoveNode("e6", "b", []),
            new MoveNode("f6", "b", [])
        ]))
    });

    test("A tree with 2 variations at ply 3 are handled properly", () => {
        let result = MoveNode.fromPgn("1. d3 d6 2. e3 (2. e4) *");
        expect(result).toMatchObject(new MoveNode("d3", "w", [
            new MoveNode("d6", "b", [
                new MoveNode("e3", "w", []),
                new MoveNode("e4", "w", [])
            ])
        ]))
    });

    test("A multi-ply variation is handled properly", () => {
        let result = MoveNode.fromPgn("1. d3 d6 (1... e6 2. e4 f6) *");
        expect(result).toMatchObject(new MoveNode("d3", "w", [
            new MoveNode("d6", "b", []),
            new MoveNode("e6", "b", [
                new MoveNode("e4", "w", [
                    new MoveNode("f6", "b", [])
                ])
            ])
        ]));
    });

    test("Singly nested variations of ply 2 are handled properly", () => {
        let result = MoveNode.fromPgn("1. d3 d6 (1... e6 2. e4 f6 (2... f5 3. exf5) 3. g3) *");
        expect(result).toMatchObject(new MoveNode("d3", "w", [
            new MoveNode("d6", "b", []),
            new MoveNode("e6", "b", [
                new MoveNode("e4", "w", [
                    new MoveNode("f6", "b", [
                        new MoveNode("g3", "w", []),
                    ]),
                    new MoveNode("f5", "b", [
                        new MoveNode("exf5", "w", [])
                    ])
                ])
            ])
        ]));
    });

    test("Singly nested variations of ply 3 are handled properly", () => {
        let result = MoveNode.fromPgn("1. d3 d6 2. e4 (2. e3 f6 (2... f5) 3. f4) *");
        expect(result).toMatchObject(new MoveNode("d3", "w", [
            new MoveNode("d6", "b", [
                new MoveNode("e4", "w", []),
                new MoveNode("e3", "w", [
                    new MoveNode("f6", "b", [
                        new MoveNode("f4", "w", [])
                    ]),
                    new MoveNode("f5", "b", [])
                ])
            ])
        ]))
    })
});