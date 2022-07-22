import './App.css';
import PgnTree from "./components/PgnTree";
import {Component} from "react";
import {MoveNode} from "./types/MoveNode";
import ChessComGameHistoryImpl from "./services/ChessComGameHistoryImpl.ts";

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {pgn: "1. d4 d5 2. e3 (2. f4 g5 3. fxg5 f6 4. gxf6 exf6) 2... e6 3. f4 *"};
        this.handleChange = this.handleChange.bind(this);

        // FIXME: stupid pattern.
        ChessComGameHistoryImpl.getInstance().getLastGamePgn("chmod111").then((pgn) => {
            this.setState({"pgn": pgn});
        });
    }

    handleChange(event) {
        this.setState({pgn: event.target.value})
    }

    render() {
        return (<>
            <div className="app-container">
                <div style={{display: "flex", flexDirection: "column"}}>
                <textarea value={this.state.pgn}
                          onChange={this.handleChange}
                          style={{
                              borderWidth: "0 4px 0 0",
                              borderColor: "black",
                              height: "100%",
                              boxSizing: "content-box",
                              resize: "horizontal",
                              handles: 'e,w,s,n',
                              width: '30vw'
                          }}/>
                </div>
                <PgnTree rootNode={MoveNode.fromPgn(this.state.pgn)}/>
            </div>
        </>);
    }
}

export default App;
