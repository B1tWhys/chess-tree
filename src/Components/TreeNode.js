import React from 'react';
import PropTypes from 'prop-types';

const TreeNode = (props) => {
    let moveColorClassName = props.isWhiteTurn ? "white-move" : "black-move";
    return (<g className={`move-node-container ${moveColorClassName}`}
               onClick={() => props.onClick()}
    >
        <circle r={30}/>
        <text y="7" textAnchor={"middle"} fontSize={20}>
            {props.turnName}
        </text>
    </g>);
};

TreeNode.propTypes = {
    turnName: PropTypes.string,
    isWhiteTurn: PropTypes.bool,
    onClick: PropTypes.func
};

export default TreeNode;