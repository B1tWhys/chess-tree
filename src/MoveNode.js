import {parseGame} from "@mliebelt/pgn-parser";

export class MoveNode {

    constructor(name, children) {
        this.name = name;
        this.children = children || [];
    }

    static fromPgn(pgnStr) {
        let jsonGame = parseGame(pgnStr);
        if (jsonGame.moves.length === 0) {
            return null;
        }

        let moves = jsonGame.moves;
        return this.fromJsonMoveLine(moves);
    }

    static fromJsonMoveLine(moves) {
        if (moves.length === 0) return null;

        let jsonMove = moves[0];
        let moveNode = new MoveNode(jsonMove.notation.notation);

        let nextMainlineMove = this.fromJsonMoveLine(moves.slice(1));
        if (nextMainlineMove) {
            moveNode.addChild(nextMainlineMove);
            // alternatives for the next ply are recorded in the json format as `variations` on the next turn
            moves[1].variations.forEach((variation) => {
                moveNode.addChild(this.fromJsonMoveLine(variation))
            });
        }

        return moveNode;
    }

    addChild(newMove) {
        this.children.push(newMove);
    }
}
