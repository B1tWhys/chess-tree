import {Box} from "@mui/material";
import Chessground from '@react-chess/chessground';
import 'chessground/assets/chessground.base.css';
import 'chessground/assets/chessground.brown.css';
import 'chessground/assets/chessground.cburnett.css';
import {Key} from 'chessground/types'
import {Chess} from "chessops/chess";
import {parseFen} from "chessops/fen";
import {makeSquare, Move, parseSquare, Setup} from "chessops";
import {useMemo} from "react";
import {MoveNode} from "../types/MoveNode";
import {makeSan} from "chessops/san";

export function ChessBoard({moveNode, onMove}: { moveNode: MoveNode, onMove?: (san: string) => void }) {
    const fen = moveNode.fen
    const setup: Setup = parseFen(fen).unwrap()
    const chess = Chess.fromSetup(setup).unwrap()
    const dests = new Map<Key, Key[]>()
    chess.allDests().forEach((toSquareSet, fromSquare) => {
        const fromStr = makeSquare(fromSquare)
        dests[fromStr] = [...toSquareSet].map(makeSquare)
    })

    function onMoveMade(orig: Key, dest: Key) {
        const move = {from: parseSquare(orig), to: parseSquare(dest)}
        const setup = parseFen(fen).unwrap()
        const chess = Chess.fromSetup(setup).unwrap()
        onMove(makeSan(chess, move))
    }

    return <Box sx={{
        position: "fixed",
        top: 0,
        right: 0,
        height: 300,
        width: 300,
        border: "black",
        borderBottomWidth: 3,
        borderLeftWidth: 3
    }}>
        <Chessground contained={true}
                     config={{
                         fen: fen,
                         turnColor: moveNode.isWhiteTurn ? "black" : "white",
                         movable: {
                             free: true,
                             dests: dests
                         },
                         events: {
                             move: onMoveMade
                         }
                     }}/>
    </Box>
}