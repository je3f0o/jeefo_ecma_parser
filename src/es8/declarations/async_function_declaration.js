/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : async_function_declaration.js
* Created at  : 2019-08-21
* Updated at  : 2019-09-03
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

const { is_expression }              = require("../../es5/helpers");
const { is_identifier_value }        = require("../../helpers");
const { ASYNC_FUNCTION_DECLARATION } = require("../enums/precedence_enum");
const {
    statement,
    async_function_expression,
    async_arrow_binding_identifier,
} = require("../enums/states_enum");

const is_async_fn  = (token, parser) => {
    if (! is_identifier_value(token, "async")) { return; }

    const next_token = parser.look_ahead();
    if (! next_token || next_token.start.line > token.end.line) { return; }

    if (next_token.id === "Identifier") {
        if (parser.current_state === statement) {
            return next_token.value === "function";
        } else if (is_expression(parser)) {
            if (next_token.value === "function") {
                parser.current_state = async_function_expression;
            } else {
                parser.current_state = async_arrow_binding_identifier;
            }
        }
    }
};

module.exports = {
    id         : "Async function declaration",
    type       : "Declaration",
    precedence : ASYNC_FUNCTION_DECLARATION,

    is         : is_async_fn,
    initialize : (node, token, parser) => {
        // Async keyword
        parser.change_state("async_state");
        const async_keyword = parser.generate_next_node();

        // Function keyword
        parser.prepare_next_state("delimiter");
        const function_keyword = parser.generate_next_node();

        // Name
        parser.prepare_next_state("binding_identifier", true);
        const name = parser.generate_next_node();

        // Parameters
        parser.prepare_next_state("formal_parameter_list", true);
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