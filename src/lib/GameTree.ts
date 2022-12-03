import {MoveNode} from "./MoveNode";
import {Game, makePgn, Node, parsePgn, PgnNodeData} from "chessops/pgn";

export default class GameTree {
    rootMoves: Array<MoveNode>
    moveArray: Array<MoveNode>

    constructor(roots: Array<MoveNode>) {
        this.rootMoves = roots;
        this.generateMoveArray();
    }

    private generateMoveArray() {
        // walk tree breadth first, appending nodes to the move array
        this.moveArray = [];
        let queue: Array<MoveNode> = [...this.rootMoves];
        while (queue.length > 0) {
            const move = queue.pop()
            this.moveArray.push(move)
            queue.unshift(...move.children)
        }
    }

    static fromPgnStr(pgnStr: string): GameTree {
        let games: Game<PgnNodeData>[] = parsePgn(pgnStr);
        let firstMoves = games.flatMap((game) =>
            game.moves.children.map((m) => MoveNode.fromChessopsNode(m, null)))
        return new GameTree(firstMoves);
    }

    static merge(...trees: GameTree[]): GameTree {
        let rawMoves = trees.flatMap(t => t.rootMoves);
        return new GameTree(MoveNode.merge(...rawMoves));
    }

    toPgn(): string {
        let movesNode = new Node<PgnNodeData>();
        this.rootMoves.forEach((m: MoveNode) => movesNode.children.push(m.toChessopsNode()));
        return makePgn({
            headers: new Map<string, string>(),
            moves: movesNode
        }).trim()
    }

    addChildMove(parentIdx: number, san: string): number {
        const move = this.moveArray[parentIdx]
        const newMove = move.addChildSan(san)
        this.generateMoveArray()
        return this.moveArray.indexOf(newMove)
    }
}