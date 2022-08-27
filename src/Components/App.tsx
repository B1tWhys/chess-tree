import {Component} from "react";
import {Box, createTheme, CssBaseline, Drawer, List, ListItem, ThemeProvider} from "@mui/material";
import boardPlaceholder from "../assets/BoardPlaceholder.png";
import chessTreePlaceholder from "../assets/ChessTreePlaceholder.png";

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

const analysisNames = [
    "Anderssen's Opening",
    "Polish Gambit, Anderssen's Opening",
    "Creepy Crawly Formation",
    "Andersspike",
    "Ware; Meadow Hay; Crab",
    "Wing Gambit, Ware Opening",
    "Cologne Gambit, Ware Opening",
    "Ware Gambit",
    "Larsen; Queen's Fianchetto; Nimzo-Larsen Attack A01",
    "Symmetrical Variation, Larsen",
    "English Variation, Larsen",
    "Classical Variation, Larsen",
    "Modern Variation, Larsen",
    "Ringelbach Gambit, Larsen",
    "Paschmann Gambit, Larsen",
    "Dutch Variation, Larsen",
    "Indian Variation, Larsen",
    "Spike Variation, Larsen",
    "Polish; Orangutan; Sokolsky; Hunt",
    "Birmingham Gambit, Polish",
    "Outflank Variation, Polish",
    "Schuhler Gambit, Polish",
    "Myers Variation, Polish",
    "Bugayev Attack, Polish",
    "Wolferts Gambit, Polish",
    "Schiffler-Sokolsky; Tartakower Gambit",
    "Brinckmann Variation, Polish",
    "Bucker Defense, Polish",
    "Grigorian Variation, Polish",
    "Polish Spike",
    "Karniewski; Tubingen Variation, Polish",
    "Saragossa; Hempel's Opening",
    "Hanham; Hayward"
]


function AnalysisSelector() {
    const drawerWidth = 300;
    return <Drawer anchor="left"
                   variant="permanent"
                   open={true}
                   sx={{width: drawerWidth, flexGrow: 0}}
                   PaperProps={{sx: {width: drawerWidth}}}>
        <List>
            {
                analysisNames.map((an, idx) => (
                    <ListItem divider={true} dense={true} selected={idx === 3}>
                        {an}
                    </ListItem>
                ))
            }
        </List>
    </Drawer>
}

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
        // aspectRatio: 1,
        top: 0,
        right: 0,
        background: `center/contain no-repeat url(${boardPlaceholder})`
        // background: "red"
    }}/>
}

class App extends Component {
    render() {
        return (
            <ThemeProvider theme={theme}>
                <Box sx={{display: "flex", height: "100%"}}>
                    <CssBaseline/>
                    <AnalysisSelector/>
                    <AnalysisTree/>
                    <ChessBoard/>
                </Box>
            </ThemeProvider>
        )
    }
}

export default App;
