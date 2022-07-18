import React, {Component} from 'react';
import {MoveNode} from "../MoveNode";
import Tree from 'react-d3-tree';
import './PgnTree.css';
import PropTypes from "prop-types";
import TreeNode from "./TreeNode";
import clone from 'clone';

class PgnTree extends Component {
    constructor(props) {
        super(props);
        this.treeRef = React.createRef();
        this.treeWrapperRef = React.createRef();

        this.state = {
            translate: {x: 0, y: 0},
            dimensions: {}
        };
    }

    componentDidMount() {
        let boundingRect = this.treeWrapperRef.current.getBoundingClientRect();
        this.setState({
            translate: {
                x: boundingRect.width / 2,
                y: 25
            },
            dimensions: {
                height: boundingRect.height,
                width: boundingRect.width
            }
        });
    }


    renderNode({nodeDatum, toggleNode}) {
        let isWhiteTurn = nodeDatum.turn === 'w';
        return <TreeNode
            turnName={nodeDatum.name}
            isWhiteTurn={isWhiteTurn}
            onClick={() => {
                this.handleNodeClick(nodeDatum);
            }}
        />;
    }

    handleNodeClick(nodeDatum) {
        let currentlyCollapsed = nodeDatum.__rd3t.collapsed;
        let tree = this.treeRef.current;
        if (currentlyCollapsed) {
            this.expandChildrenUntilForkReached(tree, nodeDatum);
            tree.setState({data: clone(tree.state.data)});
        } else {
            let nodeId = nodeDatum.__rd3t.id;
            tree.handleNodeToggle(nodeId);
        }
    }

    expandChildrenUntilForkReached(tree, nodeDatum) {
        console.log(`Attempting to expand ${nodeDatum.name} which currently has collapsed = ${nodeDatum.__rd3t.collapsed}`);
        Tree.expandNode(nodeDatum)
        if (nodeDatum.children.length === 1) {
            this.expandChildrenUntilForkReached(tree, nodeDatum.children[0]);
        }
    }

    render() {
        let data = MoveNode.fromPgn("1. e4 e5 2. Nf3 Nc6 3. Bc4 Nf6 4. Ng5 d5 (4... Bc5 5. Bxf7+ (5. Nxf7) 5... Ke7 6. Bb3) (4... Qe7 5. Bxf7+ Kd8 6. Bb3) (4... Nxe4 5. Bxf7+ Ke7 6. d4 h6 7. Nxe4 Kxf7 8. d5) (4... h6 5. Nxf7) 5. exd5 Nxd5 (5... Na5 6. Bb5+ (6. d3 h6 7. Nf3 e4 8. Qe2 Nxc4 9. dxc4 Bc5 10. Nfd2 O-O) 6... c6 7. dxc6 bxc6 8. Bd3) (5... b5 6. Bf1 h6 (6... Nd4 7. c3 Nxd5 8. cxd4 Qxg5 9. Bxb5+ Kd8 10. dxe5 (10. Qf3 exd4 11. Bc6 Nf4 12. Bxa8 Bg4 13. Qe4 Bd6)) 7. Nxf7 Kxf7 8. dxc6 Be6) (5... Nd4 6. c3 b5 7. Bf1 Nxd5 8. cxd4 Qxg5) 6. Nxf7 Kxf7 7. Qf3+ Ke6 8. Nc3 Ncb4 9. O-O c6 10. d4 *");
        return (
            <div className="treeWrapper" ref={this.treeWrapperRef}>
                <Tree ref={this.treeRef}
                      data={data}
                      orientation="vertical"
                      translate={this.state.translate}
                      dimensions={this.state.dimensions}
                      depthFactor={80}
                      separation={{siblings: .5, nonSiblings: 1}}
                      renderCustomNodeElement={(elementProps) => this.renderNode(elementProps)}
                />
            </div>
        );
    }
}

PgnTree.propTypes = {
    rootNode: PropTypes.objectOf(MoveNode)
};

export default PgnTree;