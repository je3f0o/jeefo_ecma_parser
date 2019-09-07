/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : for_iterator_initializer.js
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

const { EXPRESSION }               = require("../enums/precedence_enum");
const { is_terminator }            = require("../../helpers");
const { for_iterator_initializer } = require("../enums/states_enum");

module.exports = {
    id         : "For iterator initializer",
    type       : "Expression",
    precedence : EXPRESSION,

    is         : (_, { current_state : s }) => s === for_iterator_initializer,
    initialize : (node, token, parser) => {
        parser.change_state("punctuator");
        const terminator = parser.generate_next_node();

        node.expression = null;
        node.terminator = terminator;
        node.start      = terminator.start;
        node.end        = terminator.end;
    },
    refine (node, expression, parser) {
        if (! is_terminator(parser)) {
            parser.throw_unexpected_token();
        }

        parser.change_state("punctuator");
        const terminator = parser.generate_next_node();

        node.expression = expression;
        node.terminator = terminator;
        node.start      = terminator.start;
        node.end        = terminator.end;
    }
};
