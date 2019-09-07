/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : for_iterator_condition.js
* Created at  : 2019-08-30
* Updated at  : 2019-09-08
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

const { EXPRESSION }             = require("../enums/precedence_enum");
const { is_terminator }          = require("../../helpers");
const { for_iterator_condition } = require("../enums/states_enum");

module.exports = {
    id         : "For iterator condition",
    type       : "Expression",
    precedence : EXPRESSION,

    is         : (_, { current_state : s }) => s === for_iterator_condition,
    initialize : (node, token, parser) => {
        let expression = null, terminator;
        if (! is_terminator(parser)) {
            parser.change_state("expression_expression");
            expression = parser.generate_next_node();
        }

        if (is_terminator(parser)) {
            parser.change_state("punctuator");
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
