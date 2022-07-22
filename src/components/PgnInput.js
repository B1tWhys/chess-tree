import React from 'react';
import PropTypes from "prop-types";

const PgnInput = ({onNewPgn}) => {
    return (
        <div>
            <input type="text" onChange={onNewPgn}/>
        </div>
    );
};

PgnInput.propTypes = {
    onNewPgn: PropTypes.func
}

export default PgnInput;