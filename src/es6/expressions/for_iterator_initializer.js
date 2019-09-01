/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : for_iterator_initializer.js
* Created at  : 2019-08-30
* Updated at  : 2019-09-01
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

const { is_terminator }            = require("../../helpers");
const { EXPRESSION, TERMINATION }  = require("../enums/precedence_enum");
const { for_iterator_initializer } = require("../enums/states_enum");

module.exports = {
    id         : "For iterator initializer",
    type       : "Expression",
    precedence : EXPRESSION,

    is : (_, parser) => {
        return parser.current_state === for_iterator_initializer;
    },
    initialize : (node, token, parser) => {
        let { prev_node, expression } = parser.prev_node;

        if (expression) { parser.set_prev_node(expression); }
        parser.prev_node = prev_node;

        parser.change_state("expression_no_in");
        expression = parser.parse_next_node(TERMINATION);

        let terminator;
        if (is_terminator(parser)) {
            terminator = parser.generate_next_node();
        } else if (! parser.next_token) {
            parser.throw_unexpected_end_of_stream();
        } else {
            parser.throw_unexpected_token();
        }

        node.expression = expression;
        node.terminator = terminator;
        node.start      = (expression || terminator).start;
        node.end        = terminator.end;
    }
};
