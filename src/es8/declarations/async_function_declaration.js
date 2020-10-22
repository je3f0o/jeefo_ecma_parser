/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : async_function_declaration.js
* Created at  : 2019-08-21
* Updated at  : 2020-09-01
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

const {ASYNC_FUNCTION_DEFINITIONS} = require("../enums/precedence_enum");
const {
    statement,
    expression,
    async_arrow_function,
    async_function_expression,
} = require("../enums/states_enum");

module.exports = {
    id         : "Async function declaration",
    type       : "Async function definitions",
    precedence : ASYNC_FUNCTION_DEFINITIONS,

    is ({id, value, end}, parser) {
        const next_token = parser.look_ahead();
        if (! next_token || next_token.start.line > end.line) return;

        switch (parser.current_state) {
            case statement  : return next_token.value === "function";
            case expression :
                if (next_token.id === "Identifier") {
                    parser.current_state = next_token.value === "function"
                        ? async_function_expression
                        : async_arrow_function;
                }
                break;
        }
    },

    initialize : (node, token, parser) => {
        // Async keyword
        parser.change_state("contextual_keyword");
        const async_keyword = parser.generate_next_node();

        // Function keyword
        parser.prepare_next_state("keyword");
        const function_keyword = parser.generate_next_node();

        // Name
        parser.prepare_next_state("binding_identifier", true);
        const name = parser.generate_next_node();

        // Parameters
        parser.prepare_next_state("formal_parameters", true);
        const parameters = parser.generate_next_node();

        // Body
        parser.prepare_next_state("async_function_body", true);
        const body = parser.generate_next_node();

        node.async_keyword    = async_keyword;
        node.function_keyword = function_keyword;
        node.name             = name;
        node.parameters       = parameters;
        node.body             = body;
        node.start            = async_keyword.start;
        node.end              = body.end;

        parser.terminate(node);
    }
};
