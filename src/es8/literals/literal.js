/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : literal.js
* Created at  : 2019-09-04
* Updated at  : 2019-09-04
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

const { EXPRESSION }                  = require("../enums/precedence_enum");
const { literal, primary_expression } = require("../enums/states_enum.js");

module.exports = {
    id         : "Literal",
	type       : "Expression",
	precedence : EXPRESSION,

    is         : (_, parser) => parser.current_state === literal,
	initialize : (node, token, parser) => {
        node.literal = parser.prev_node;
        node.start   = token.start;
        node.end     = token.end;

        parser.ending_index -= 1;
        parser.current_state = primary_expression;
    },

    protos : {
        is_valid_simple_assignment_target () { return false; }
    }
};
