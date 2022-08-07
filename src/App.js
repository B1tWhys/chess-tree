import './App.css';
import PgnTree from "./components/PgnTree";
import {Component} from "react";
import ChessComGameHistoryImpl from "./services/ChessComGameHistoryImpl.ts";
import GameTree from "./types/GameTree.ts";

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {pgn: "1. d4 d5 2. e3 (2. f4 g5 3. fxg5 f6 4. gxf6 exf6) 2... e6 3. f4 *"};
        this.handleChange = this.handleChange.bind(this);

        // FIXME: bad pattern. Should prob use some sort of DI
        ChessComGameHistoryImpl.getInstance().getAllGamePgns("chmod111").then((PGNs) => {
            const gameTrees = PGNs.map(GameTree.fromPgnStr);
            const combinedTree = GameTree.merge(...gameTrees);
            combinedTree.truncate(8); // FIXME: make configurable
            this.setState({pgn: combinedTree.toPgn()});
        });
    }

    handleChange(event) {
        this.setState({pgn: event.target.value})
    }

    render() {
        const tree = GameTree.fromPgnStr(this.state.pgn);
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
                <PgnTree rootNode={tree.firstMoves[0]}/>
            </div>
        </>);
    }
}

export default App;
