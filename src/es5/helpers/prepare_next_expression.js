/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : prepare_next_expression.js
* Created at  : 2019-03-19
* Updated at  : 2019-08-22
* Author      : jeefo
* Purpose     :
* Description :
* Reference   :
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals*/
/* exported*/

// ignore:end

const { expression_no_in } = require("../enums/states_enum");

module.exports = (parser, throw_end_of_stream) => {
    let state_name = "expression";
    if (parser.current_state === expression_no_in) {
        state_name = "expression_no_in";
    }
    parser.prepare_next_state(state_name, throw_end_of_stream);
};
