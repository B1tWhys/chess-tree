import {MoveNode} from "./MoveNode";
import {Game, makePgn, Node, parsePgn, PgnNodeData} from "chessops/pgn";

export default class GameTree {
    firstMoves: Array<MoveNode>

    constructor(roots: Array<MoveNode>) {
        this.firstMoves = roots;
    }

    static fromPgnStr(pgnStr: string): GameTree {
        // TODO: handle tags (etc)

        let games: Game<PgnNodeData>[] = parsePgn(pgnStr);
        let firstMoves = games.flatMap((game) =>
            game.moves.children.map((m) => MoveNode.fromChessopsNode(m, null)))
        return new GameTree(firstMoves);
    }

    static merge(...trees: GameTree[]): GameTree {
        let rawMoves = trees.flatMap(t => t.firstMoves);
        return new GameTree(MoveNode.merge(...rawMoves));
    }

    toPgn(): string {
        let movesNode = new Node<PgnNodeData>();
        this.firstMoves.forEach((m: MoveNode) => movesNode.children.push(m.toChessopsNode()));
        return makePgn({
            headers: new Map<string, string>(),
            moves: movesNode
        }).trim()
    }

    truncate(depth: number) {
        this.firstMoves.forEach(f => f.truncate(depth));
    }
}