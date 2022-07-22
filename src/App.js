import './App.css';
import PgnTree from "./Components/PgnTree";
import {Component} from "react";
import {MoveNode} from "./MoveNode";

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {pgn: "1. d4 d5 2. e3 (2. f4 g5 3. fxg5 f6 4. gxf6 exf6) 2... e6 3. f4 *"};
    }

    render() {
        return (<>
            <div>foo</div>
            <div className="app-container">
                <PgnTree rootNode={MoveNode.fromPgn(this.state.pgn)}/>
            </div>
        </>);
    }
}

export default App;
