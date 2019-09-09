/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : expression_statement.js
* Created at  : 2017-08-17
* Updated at  : 2019-09-09
* Author      : jeefo
* Purpose     :
* Description :
* Reference   : https://www.ecma-international.org/ecma-262/5.1/#sec-12.4
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals*/
/* exported*/

// ignore:end

const { statement }     = require("../enums/states_enum");
const { is_terminator } = require("../../helpers");
const {
    TERMINATION,
    EXPRESSION_STATEMENT,
} = require("../enums/precedence_enum");

module.exports = {
    id         : "Expression statement",
    type       : "Statement",
    precedence : EXPRESSION_STATEMENT,

    is         : (_, { current_state : s }) => s === statement,
    initialize : (node, token, parser) => {
        let terminator      = null;
        parser.post_comment = null;

        parser.change_state("expression");
        const expression = parser.parse_next_node(TERMINATION);
        if (! expression) {
            parser.throw_unexpected_token();
        }

        if (is_terminator(parser)) {
            if (parser.post_comment !== null) {
                parser.prev_node = parser.post_comment;
            }
            parser.change_state("punctuator");
            terminator = parser.generate_next_node();
        }

        node.expression = expression;
        node.terminator = terminator;
        node.start      = expression.start;
        node.end        = (terminator || expression).end;

        parser.terminate(node);
    }
};
