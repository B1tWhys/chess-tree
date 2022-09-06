import {Box, CssBaseline, ThemeProvider} from "@mui/material";
import {AnalysisControlPanel} from "./AnalysisControlPanel";
import {AnalysisTree} from "./AnalysisTree";
import {useMemo, useState} from "react";
import GameTree from "../types/GameTree";
import {theme} from "./Theme";
import {ChessBoard} from "./ChessBoard";


function App() {
    const [pgn, setPgn] = useState("1. a3 a6 2. b3 (2. b4 b6 (2... b5)) 2... b6 (2... b5)");
    const [currentFen, setCurrentFen] = useState("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");

    const tree = useMemo(() => GameTree.fromPgnStr(pgn), [pgn]);

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{display: "flex", height: "100%"}}>
                <CssBaseline/>
                <AnalysisControlPanel onPgnUpdate={pgn => setPgn(pgn)} pgn={pgn}/>
                <AnalysisTree gameTree={tree} onMoveMouseover={(m) => setCurrentFen(m.fen)}/>
                <ChessBoard fen={currentFen}/>
            </Box>
        </ThemeProvider>
    )
}

export default App;
