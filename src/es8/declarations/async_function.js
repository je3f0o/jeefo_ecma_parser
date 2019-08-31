/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : async_function.js
* Created at  : 2019-08-21
* Updated at  : 2019-08-27
* Author      : jeefo
* Purpose     :
* Description :
* Reference   : https://www.ecma-international.org/ecma-262/8.0/index.html#sec-async-function-definitions
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals*/
/* exported*/

// ignore:end

const { DECLARATION }         = require("../enums/precedence_enum");
const { is_expression }       = require("../../es5/helpers");
const { terminal_definition } = require("../../common");
const {
    statement,
    async_arrow_function,
    async_function_expression,
} = require("../enums/states_enum");

const is_async_fn  = (token, parser) => {
    if (token.id !== "Identifier" || token.value !== "async") { return; }

    const next_token = parser.look_ahead();
    if (! next_token || next_token.start.line > token.end.line) { return; }

    if (next_token.id === "Identifier") {
        if (next_token.value === "function") {
            if (parser.current_state === statement) {
                return true;
            } else if (is_expression(parser)) {
                parser.current_state = async_function_expression;
            }
        } else if (is_expression(parser)) {
            parser.current_state = async_arrow_function;
        }
    }
};

module.exports = {
    id         : "Async function declaration",
    type       : "Declaration",
    precedence : DECLARATION,

    is         : is_async_fn,
    initialize : (node, token, parser) => {
        const keyword = terminal_definition.generate_new_node(parser);

        parser.prepare_next_state(null, true);
        const fn = parser.generate_next_node();

        node.keyword  = keyword;
        node.function = fn;
        node.start    = keyword.start;
        node.end      = fn.end;
    }
};
