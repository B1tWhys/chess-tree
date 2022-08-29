import {createTheme} from "@mui/material";

declare module '@mui/material/styles' {
    interface Theme {
        squares: {
            light: string;
            dark: string;
        };
    }
    // allow configuration using `createTheme`
    interface ThemeOptions {
        squares?: {
            light?: string;
            dark?: string;
        };
    }
}

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
    },
    squares: {
        light: "#eeeed2",
        dark: "#769656"
    }
})

export {theme};