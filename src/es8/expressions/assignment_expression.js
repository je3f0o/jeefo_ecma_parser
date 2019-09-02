/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : assignment_expression.js
* Created at  : 2019-09-02
* Updated at  : 2019-09-02
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

    is         : (_, parser) => parser.current_state === assignment_expression,
	initialize : (node, token, parser) => {
        // TODO: this shit is only temporary. get rid off it.
        const expression_name = parser.get_state_name(parser.prev_state);
        parser.change_state(expression_name, false);
        const expression = parser.parse_next_node(COMMA);
        if (! expression) {
            parser.throw_unexpected_token();
        }

        node.expression = expression;
        node.start      = expression.start;
        node.end        = expression.end;
    },
};
