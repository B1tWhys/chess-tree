import { ChildNode } from 'chessops/pgn';
import type { PgnNodeData } from 'chessops/pgn';
import { INITIAL_EPD, makeFen, parseFen } from 'chessops/fen';
import { Chess } from 'chessops/chess';
import { parseSan } from 'chessops/san';

export class MoveNode {
	name: string;
	children: Array<MoveNode>;
	isWhiteTurn: boolean;
	parentNode?: MoveNode;
	fen?: string;

	constructor(
		name: string,
		isWhiteTurn: boolean,
		children?: Array<MoveNode>,
		parentNode?: MoveNode,
		fen?: string
	) {
		this.name = name;
		this.children = children || [];
		this.isWhiteTurn = isWhiteTurn;
		this.parentNode = parentNode;
		this.fen = fen;
	}

	static fromChessopsNode(chessOpsNode: ChildNode<PgnNodeData>, prevFen: string, parentMoveNode?: MoveNode) {
		let isWhiteTurn: boolean;
		if (parentMoveNode) {
			isWhiteTurn = !parentMoveNode.isWhiteTurn;
		} else {
			isWhiteTurn = true;
		}
		const nextFen = this.calcNextFen(prevFen, chessOpsNode);
		const newNode = new MoveNode(
			chessOpsNode.data.san,
			isWhiteTurn,
			undefined,
			parentMoveNode,
			nextFen
		);
		newNode.children = chessOpsNode.children.map((n) => this.fromChessopsNode(n, nextFen, newNode));
		return newNode;
	}

	private static calcNextFen(prevFen: string, chessOpsNode: ChildNode<PgnNodeData>) {
		const chessPos = Chess.fromSetup(parseFen(prevFen).unwrap()).unwrap();
		const move = parseSan(chessPos, chessOpsNode.data.san);
		chessPos.play(move!);
		return makeFen(chessPos.toSetup());
	}

	private static calcNextFenFromSan(prevFen: string, san: string) {
		const chessPos = Chess.fromSetup(parseFen(prevFen).unwrap()).unwrap();
		const move = parseSan(chessPos, san);
		chessPos.play(move!);
		return makeFen(chessPos.toSetup());
	}

	static merge(...moves: MoveNode[]): MoveNode[] {
		const combinedMoves = new Map<string, MoveNode>();
		moves.forEach((m) => {
			const existingMove = combinedMoves.get(m.name);
			if (existingMove) {
				existingMove.children = MoveNode.merge(...existingMove.children, ...m.children);
			} else {
				combinedMoves.set(m.name, m);
			}
		});
		return Array.from(combinedMoves.values());
	}

	toChessopsNode(): ChildNode<PgnNodeData> {
		const data = { san: this.name };
		const childNode = new ChildNode(data);
		childNode.children = this.children.map((m) => m.toChessopsNode());
		return childNode;
	}

	truncate(depth: number) {
		if (depth > 0) {
			this.children.forEach((m) => m.truncate(depth - 1));
		} else {
			this.children = [];
		}
	}

	addChildSan(san: string): MoveNode {
		const existingNode = this.children.find((m) => m.name == san);
		if (existingNode !== undefined) return existingNode;

		const newNode = new MoveNode(
			san,
			!this.isWhiteTurn,
			[],
			this,
			MoveNode.calcNextFenFromSan(this.fen!, san)
		);
		this.children.push(newNode);
		return newNode;
	}
}
