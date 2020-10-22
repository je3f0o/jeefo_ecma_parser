/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : async_arrow_function.js
* Created at  : 2019-08-27
* Updated at  : 2020-09-21
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

const {EXPRESSION} = require("../enums/precedence_enum");
const {
    is_arrow,
    has_no_line_terminator,
    get_last_non_comment_node
} = require("../../helpers");
const {
    expression,
    async_arrow_function,
} = require("../enums/states_enum");

module.exports = {
    id         : "Async arrow function",
    type       : "Assignment expression",
    precedence : EXPRESSION,
    is         : (_, {current_state: s}) => s === async_arrow_function,

    initialize (node, token, parser) {
        const prev_suffix = parser.suffixes;
        parser.suffixes = ["in", "await"];

        let async_keyword, params;
        // TODO: make it two states
        const left = get_last_non_comment_node(parser);
        if (left) {
            const {id, callee, arguments: args} = left;
            parser.expect("CoverCallExpression", () => {
                return id === "Function call expression";
            });
            async_keyword = parser.refine(
                "terminal_symbol_keyword", callee.identifier.identifier_name
            );
            params = parser.refine("arrow_parameters", {
                id: "Async arrow head",
                args
            });
            parser.change_state("punctuator");
        } else {
            // Async keyword
            parser.change_state("terminal_symbol_keyword");
            async_keyword = parser.generate_next_node();

            // Async arrow binding identifier
            parser.prepare_next_state("async_arrow_binding_identifier", true);
            params = parser.generate_next_node();

            // Arrow punctuator
            parser.prepare_next_state("punctuator", true);
            parser.expect("Arrow punctuator", is_arrow);
            if (! has_no_line_terminator(params, parser.next_token)) {
                parser.throw_unexpected_token("Malformed arrow punctuator");
            }
        }
        const arrow_token = parser.generate_next_node();

        parser.prepare_next_state("async_concise_body", true);
        const body = parser.generate_next_node();

        node.keyword     = async_keyword;
        node.parameters  = params;
        node.arrow_token = arrow_token;
        node.body        = body;
        node.start       = async_keyword.start;
        node.end         = body.end;

        parser.suffixes      = prev_suffix;
        parser.current_state = expression;
    }
};
