import {parseGame} from "@mliebelt/pgn-parser";
import {MoveNode} from "./MoveNode";

export default class MoveTree {
    root: MoveNode;

    constructor(root: MoveNode) {
    }

    static fromPgnStr(pgn: string): MoveTree {
        let jsonGame = parseGame(pgn);
        let root = jsonGame.moves.map((m) => MoveNode.fromJsonGame(m))[0];
        // TODO: handle tags (etc)
        return new MoveTree(root);
    }


}