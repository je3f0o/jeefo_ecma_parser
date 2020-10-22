/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : async_function_expression.js
* Created at  : 2019-08-27
* Updated at  : 2020-09-01
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

const {EXPRESSION}          = require("../enums/precedence_enum");
const {is_open_parenthesis} = require("../../helpers");
const {
    primary_expression,
    async_function_expression,
} = require("../enums/states_enum");

module.exports = {
    id         : "Async function expression",
    type       : "Async function definitions",
    precedence : EXPRESSION,
    is         : (_, {current_state: s}) => s === async_function_expression,

    initialize (node, token, parser) {
        let name = null;
        parser.change_state("contextual_keyword");
        const async_keyword = parser.generate_next_node();

        // Function keyword
        parser.prepare_next_state("keyword");
        const function_keyword = parser.generate_next_node();

        const prev_suffix = parser.suffixes;
        parser.suffixes = ["in", "await"];

        // Name
        parser.prepare_next_state("binding_identifier", true);
        if (! is_open_parenthesis(parser)) {
            name = parser.generate_next_node();
            parser.prepare_next_state("formal_parameters", true);
        } else {
            parser.change_state("formal_parameters");
        }

        // Parameters
        const parameters = parser.generate_next_node();
        parser.suffixes      = prev_suffix;
        parser.current_state = primary_expression;

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
    }
};
