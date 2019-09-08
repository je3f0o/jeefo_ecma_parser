/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : await_experession.js
* Created at  : 2019-08-22
* Updated at  : 2019-09-09
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

const { expression }       = require("../enums/states_enum");
const { AWAIT_EXPRESSION } = require("../enums/precedence_enum");

const valid_contexts = [
    "Async method body",
    "Async function body",
];

module.exports = {
    id         : "Await exression",
    type       : "Unary operator",
    precedence : AWAIT_EXPRESSION,

    is (token, parser) {
        if (parser.current_state === expression) {
            const { context_stack } = parser;
            let i = context_stack.length;
            while (i--) {
                if (valid_contexts.includes(context_stack[i])) {
                    return true;
                }
            }
            parser.throw_unexpected_token(
                "await is only valid in async function"
            );
        }
    },
    initialize (node, token, parser) {
        parser.change_state("keyword");
        const keyword = parser.generate_next_node();

        parser.prepare_next_state("expression", true);
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
