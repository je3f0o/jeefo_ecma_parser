/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : for_in_expression.js
* Created at  : 2019-08-29
* Updated at  : 2019-08-29
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

const { for_in_expression }       = require("../enums/states_enum");
const { terminal_definition }     = require("../../common");
const { EXPRESSION, TERMINATION } = require("../enums/precedence_enum");

module.exports = {
    id         : "For in expression",
    type       : "Expression",
    precedence : EXPRESSION,

    is         : (_, parser) => parser.current_state === for_in_expression,
    initialize : (node, token, parser) => {
        const { left } = parser.prev_node;
        const operator = terminal_definition.generate_new_node(parser);

        parser.prepare_next_state("expression", true);
        const right = parser.parse_next_node(TERMINATION);
        if (! right) {
            parser.throw_unexpected_token();
        }

        node.left     = left;
        node.operator = operator;
        node.right    = right;
        node.start    = left.start;
        node.end      = right.end;
    }
};
