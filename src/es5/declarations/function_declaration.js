/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : function_declaration.js
* Created at  : 2019-01-29
* Updated at  : 2019-09-08
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals*/
/* exported*/

// ignore:end

const array_remove    = require("@jeefo/utils/array/remove");
const { DECLARATION } = require("../enums/precedence_enum");
const {
    statement,
    expression,
    function_expression,
} = require("../enums/states_enum");

module.exports = {
    id         : "Function declaration",
    type       : "Declaration",
    precedence : DECLARATION,

    is : (token, parser) => {
        if (parser.current_state === statement) {
            return true;
        } else if (parser.current_state === expression) {
            parser.prev_state    = parser.current_state;
            parser.current_state = function_expression;
        }
    },

    initialize : (node, current_token, parser) => {
        parser.change_state("keyword");
        const keyword = parser.generate_next_node();
        const { context_stack } = parser;

        parser.prepare_next_state("binding_identifier", true);
        const name = parser.generate_next_node();

        const has_yield = context_stack.includes("yield");
        const has_await = context_stack.includes("await");
        array_remove(context_stack, ["yield", "await"]);

        parser.prepare_next_state("formal_parameters", true);
        const parameters = parser.generate_next_node();

        parser.prepare_next_state("function_body", true);
        const body = parser.generate_next_node();

        node.keyword     = keyword;
        node.name        = name;
        node.parameters  = parameters;
        node.body        = body;
        node.start       = keyword.start;
        node.end         = body.end;

        parser.terminate(node);

        if (has_yield) { context_stack.push("yield"); }
        if (has_await) { context_stack.push("await"); }
    }
};
