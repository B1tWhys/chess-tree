import {ChildNode, Game, parsePgn, PgnNodeData} from "chessops/pgn";

export class MoveNode {
    name: string;
    children: Array<MoveNode>;
    isWhiteTurn: boolean;
    fen: string;

    constructor(name: string,
                isWhiteTurn: boolean,
                children: Array<MoveNode>) {
        this.name = name;
        this.children = children || [];
        this.isWhiteTurn = isWhiteTurn;
    }

    static fromPgn(pgnStr) {
        let games: Game<PgnNodeData>[] = parsePgn(pgnStr);
        if (!games[0].moves.children.length) return null;
        let firstMoveNode = games[0].moves.children[0];
        return this.fromChessopsNode(firstMoveNode, true);
    }

    static fromChessopsNode(node: ChildNode<PgnNodeData>, isWhiteTurn: boolean = true) {
        let children = node.children.map((n) =>
            this.fromChessopsNode(n, !isWhiteTurn));
        return new MoveNode(
            node.data.san,
            isWhiteTurn,
            children
        );
    }

    static merge(...moves: MoveNode[]): MoveNode[] {
        let combinedMoves = new Map<string, MoveNode>();
        moves.forEach(m => {
            let existingMove = combinedMoves.get(m.name);
            if (existingMove) {
                existingMove.children = MoveNode
                    .merge(...existingMove.children, ...m.children)
            } else {
                combinedMoves.set(m.name, m);
            }
        });
        return Array.from(combinedMoves.values());
    }

    toChessopsNode(): ChildNode<PgnNodeData> {
        const data = {san: this.name};
        let childNode = new ChildNode(data);
        childNode.children = this.children.map(m => m.toChessopsNode());
        return childNode;
    }

    truncate(depth: number) {
        if (depth > 0) {
            this.children.forEach(m => m.truncate(depth-1));
        } else {
            this.children = [];
        }
    }
}
