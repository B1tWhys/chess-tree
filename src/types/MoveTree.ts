import {parseGame} from "@mliebelt/pgn-parser";
import {MoveNode} from "./MoveNode";

export default class MoveTree {
    roots: Array<MoveNode>

    constructor(roots: Array<MoveNode>) {
        this.roots = roots;
    }

    static fromPgnStr(pgn: string): MoveTree {
        let jsonGame = parseGame(pgn);
        let roots = jsonGame.moves.map((m) => MoveNode.fromJsonGame(m));
        // TODO: handle tags (etc)
        return new MoveTree(roots);
    }
}