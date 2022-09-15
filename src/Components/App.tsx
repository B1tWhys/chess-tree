import {Box, CssBaseline, ThemeProvider} from "@mui/material";
import {AnalysisControlPanel} from "./AnalysisControlPanel";
import {AnalysisTree} from "./AnalysisTree";
import {useState} from "react";
import GameTree from "../types/GameTree";
import {theme} from "./Theme";
import {ChessBoard} from "./ChessBoard";


const startingPgn = "1. a3 a6 2. b3 (2. b4 b6 (2... b5)) 2... b6 (2... b5)";

function App() {
    const [currentMoveIdx, setCurrentMoveIdx] = useState(0)
    const [tree, setTree] = useState(GameTree.fromPgnStr(startingPgn))

    function handleMove(san: string) {
        const newCurrentMoveIdx = tree.addChildMove(currentMoveIdx, san)
        setTree(GameTree.fromPgnStr(tree.toPgn()))
        setCurrentMoveIdx(newCurrentMoveIdx)
    }

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{display: "flex", height: "100%"}}>
                <CssBaseline/>
                <AnalysisControlPanel onPgnUpdate={pgn => setTree(GameTree.fromPgnStr(pgn))} pgn={tree.toPgn()}/>
                <AnalysisTree gameTree={tree} selectedNodeIdx={currentMoveIdx}
                              onMoveMouseover={(m) => {setCurrentMoveIdx(tree.moveArray.indexOf(m))}}/>
                <ChessBoard moveNode={tree.moveArray[currentMoveIdx]} onMove={handleMove}/>
            </Box>
        </ThemeProvider>
    )
}

export default App;
