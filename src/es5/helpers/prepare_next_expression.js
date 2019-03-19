/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : prepare_next_expression.js
* Created at  : 2019-03-19
* Updated at  : 2019-03-19
* Author      : jeefo
* Purpose     :
* Description :
* Reference   :
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

const states_enum = require("../enums/states_enum");

function prepare_next_expression (parser, throw_end_of_stream) {
    let state_name = "expression";
    if (parser.current_state === states_enum.expression_no_in) {
        state_name = "expression_no_in";
    }
    parser.prepare_next_state(state_name, throw_end_of_stream);
}

module.exports = prepare_next_expression;
