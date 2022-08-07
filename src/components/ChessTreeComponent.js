import React, {Component} from 'react';
import {MoveNode} from "../types/MoveNode.ts";
import Tree from 'react-d3-tree';
import './PgnTree.css';
import PropTypes from "prop-types";
import TreeNode from "./TreeNode";
import clone from 'clone';

class ChessTreeComponent extends Component {
    constructor(props) {
        super(props);
        this.treeRef = React.createRef();
        this.treeWrapperRef = React.createRef();

        this.state = {
            translate: {x: 0, y: 0},
            dimensions: {},
            pgn: props.pgn
        };
    }

    componentDidMount() {
        let boundingRect = this.treeWrapperRef.current.getBoundingClientRect();
        this.setState({
            translate: {
                x: boundingRect.width / 2,
                y: 40
            },
            dimensions: {
                height: boundingRect.height,
                width: boundingRect.width
            }
        });
    }


    renderNode({nodeDatum, toggleNode}) {
        return <TreeNode
            move={nodeDatum}
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
        Tree.expandNode(nodeDatum)
        if (nodeDatum.children.length === 1) {
            this.expandChildrenUntilForkReached(tree, nodeDatum.children[0]);
        }
    }

    render() {
        return (
            <div className="treeWrapper" ref={this.treeWrapperRef}>
                <Tree ref={this.treeRef}
                      data={this.props.rootNode}
                      orientation="vertical"
                      translate={this.state.translate}
                      dimensions={this.state.dimensions}
                      depthFactor={80}
                      separation={{siblings: .5, nonSiblings: 1}}
                      renderCustomNodeElement={(elementProps) => this.renderNode(elementProps)}
                      pathClassFunc={(a, b) => "tree-link"}
                />
            </div>
        );
    }
}

ChessTreeComponent.propTypes = {
    pgn: PropTypes.string,
    rootNode: PropTypes.objectOf(MoveNode)
};

export default ChessTreeComponent;