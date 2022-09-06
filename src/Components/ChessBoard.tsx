import {Chessboard, Square} from "react-chessboard";
import {Board, Move, NormalMove, parseSquare, Piece, Position} from "chessops";
import {parseBoardFen} from "chessops/fen";

export function ChessBoard({fen, onMove}: { fen: string, onMove?: (san: string) => void }) {

    function handlePieceDrop(sourceSquare: Square, targetSquare: Square, piece: Piece) {
        const board = parseBoardFen(fen)
        const fromSquareIdx = parseSquare(sourceSquare)
        const toSquareIdx = parseSquare(targetSquare)
        const move: NormalMove = {from: fromSquareIdx, to: toSquareIdx}
    }

    return <Chessboard boardWidth={300} customBoardStyle={{
        position: "fixed",
        top: 0,
        right: 0
    }} position={fen}/>
}