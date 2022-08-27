import {Component} from "react";
import {Box, createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import boardPlaceholder from "../assets/BoardPlaceholder.png";
import chessTreePlaceholder from "../assets/ChessTreePlaceholder.png";
import {AnalysisControlPanel} from "./AnalysisControlPanel";

const theme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#EEEED2",
            dark: "#312E2B"
        },
        secondary: {
            main: "#312E2B"
        }
    }
})

function AnalysisTree() {
    return <Box sx={{
        flexGrow: 1,
        background: `center/contain no-repeat url(${chessTreePlaceholder})`
    }}/>
}

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

class App extends Component {
    render() {
        return (
            <ThemeProvider theme={theme}>
                <Box sx={{display: "flex", height: "100%"}}>
                    <CssBaseline/>
                    <AnalysisControlPanel/>
                    <AnalysisTree/>
                    <ChessBoard/>
                </Box>
            </ThemeProvider>
        )
    }
}

export default App;
