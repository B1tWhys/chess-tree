import {Box, createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import boardPlaceholder from "../assets/BoardPlaceholder.png";
import {AnalysisControlPanel} from "./AnalysisControlPanel";
import {AnalysisTree} from "./AnalysisTree";
import {useMemo, useState} from "react";
import GameTree from "../types/GameTree";
import {theme} from "./Theme";


function ChessBoard() {
    return <Box sx={{
        position: "fixed",
        width: 300,
        height: 300,
        top: 0,
        right: 0,
        background: `center/contain no-repeat url(${boardPlaceholder})`
    }}/>
}

function App() {
    const [pgn, setPgn] = useState("1. a3 a6 2. b3 (2. b4 b6 (2... b5)) 2... b6 (2... b5)");

    const tree = useMemo(() => GameTree.fromPgnStr(pgn), [pgn]);
    return (
        <ThemeProvider theme={theme}>
            <Box sx={{display: "flex", height: "100%"}}>
                <CssBaseline/>
                <AnalysisControlPanel onPgnUpdate={pgn => setPgn(pgn)} pgn={pgn}/>
                <AnalysisTree gameTree={tree}/>
                <ChessBoard/>
            </Box>
        </ThemeProvider>
    )
}

export default App;
