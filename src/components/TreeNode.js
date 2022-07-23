import React from 'react';
import PropTypes from 'prop-types';
import {MoveNode} from "../types/MoveNode.ts";

const lightColor = "rgb(117, 149, 85)";
const darkColor = "rgb(238, 237, 210)";

const TreeNode = (props) => {
    return (<g className={`move-node-container`}
               style={{
                   fill: props.move.isWhiteTurn ? lightColor : darkColor,
                   stroke: props.move.isWhiteTurn ? darkColor : lightColor,
               }} onClick={() => props.onClick()}>
        <circle r={30}/>
        <text y="7" textAnchor={"middle"} fontSize={20} style={{fill: props.move.isWhiteTurn ? darkColor : lightColor}}>
            {props.move.name}
        </text>
    </g>);
};

TreeNode.propTypes = {
    // turnName: PropTypes.string,
    // isWhiteTurn: PropTypes.bool,
    move: PropTypes.objectOf(MoveNode),
    onClick: PropTypes.func
};

export default TreeNode;