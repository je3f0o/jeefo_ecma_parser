/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : assignment_expression.js
* Created at  : 2019-09-02
* Updated at  : 2019-09-05
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

const { EXPRESSION, COMMA }     = require("../enums/precedence_enum");
const { assignment_expression } = require("../enums/states_enum");

module.exports = {
    id         : "Assignment expression",
	type       : "Expression",
	precedence : EXPRESSION,

    is         : (_, { current_state : s }) => s === assignment_expression,
	initialize : (node, token, parser) => {
        parser.change_state("expression");
        const expression = parser.parse_next_node(COMMA);
        if (! expression) {
            parser.throw_unexpected_token();
        }

        node.expression = expression;
        node.start      = expression.start;
        node.end        = expression.end;
    },
};
