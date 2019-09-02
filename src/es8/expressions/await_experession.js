/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : await_experession.js
* Created at  : 2019-08-22
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

const { is_expression }    = require("../../es5/helpers");
const { AWAIT_EXPRESSION } = require("../enums/precedence_enum");

module.exports = {
    id         : "Await exression",
    type       : "Unary operator",
    precedence : AWAIT_EXPRESSION,

    is (token, parser) {
        if (is_expression(parser)) {
            const { context_stack } = parser;
            let i = context_stack.length;
            while (i--) {
                if (context_stack[i].id === "Async function body") {
                    return true;
                }
            }
            parser.throw_unexpected_token(
                "await is only valid in async function"
            );
        }
    },
    initialize (node, token, parser) {
        const expression_name = parser.get_current_state_name();

        parser.change_state("delimiter");
        const keyword = parser.generate_next_node();

        parser.prepare_next_state(expression_name, true);
        const expression = parser.parse_next_node(AWAIT_EXPRESSION);
        if (! expression) {
            parser.throw_unexpected_token();
        }

        node.keyword    = keyword;
        node.expression = expression;
        node.start      = keyword.start;
        node.end        = expression.end;
    }
};
