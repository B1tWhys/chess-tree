import './App.css';
import {Component} from "react";


class AnalysisSelector extends Component {
    render() {
        return <div className={"analysis-selector"}>
        </div>
    }
}

class AnalysisTree extends Component {
    render() {
        return <div className={"analysis-tree-container"}>
        </div>
    }
}

class ChessBoard extends Component {
    render() {
        return <div className={"chess-board"}>
        </div>
    }
}

class App extends Component {
    render() {
        return (
            <div id={"app-container"}>
                <AnalysisSelector/>
                <AnalysisTree/>
                <ChessBoard/>
            </div>
        )
    }
}

export default App;
