import {Drawer, List, ListItem, Stack, TextareaAutosize} from "@mui/material";

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

export function AnalysisControlPanel() {
    const drawerWidth = 300;
    return <Drawer anchor="left"
                   variant="permanent"
                   open={true}
                   sx={{width: drawerWidth, flexGrow: 0, height: "100vh"}}
                   PaperProps={{sx: {width: drawerWidth, height: "100%"}}}>
        <Stack height={"100%"}>
            <List disablePadding={true} sx={{
                flex: "1 0 20%",
                overflow: "auto"
            }}>
                {
                    analysisNames.map((an, idx) => (
                        <ListItem divider={true} dense={true} selected={idx === 3}>
                            {an}
                        </ListItem>
                    ))
                }
            </List>
            <TextareaAutosize minRows={10} maxRows={80} placeholder={"PGN"} style={{resize: "none"}}/>
        </Stack>
    </Drawer>
}