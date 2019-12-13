/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : async_arrow_function.js
* Created at  : 2019-08-27
* Updated at  : 2019-12-14
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

const { ASYNC_ARROW_FUNCTION } = require("../enums/precedence_enum");
const {
    is_arrow_token,
    is_identifier_token,
    is_identifier_value,
    has_no_line_terminator,
    get_last_non_comment_node
} = require("../../helpers");
const {
    expression,
    async_arrow_function,
    async_arrow_function_with_id,
} = require("../enums/states_enum");

const async_arrow_function_states = [
    async_arrow_function,
    async_arrow_function_with_id,
];

module.exports = {
    id         : "Async arrow function",
    type       : "Expression",
    precedence : ASYNC_ARROW_FUNCTION,

    is (token, { current_state }) {
        return async_arrow_function_states.includes(current_state);
    },

    initialize (node, token, parser) {
        const prev_suffix = parser.suffixes;
        parser.suffixes = ["await"];

        let async_keyword, params;

        if (parser.current_state === async_arrow_function_with_id) {
            // Async keyword
            parser.change_state("contextual_keyword");
            async_keyword = parser.generate_next_node();

            // Async arrow binding identifier
            parser.prepare_next_state("async_arrow_binding_identifier", true);
            params = parser.generate_next_node();

            // Arrow punctuator
            parser.prepare_next_state("punctuator", true);
            parser.expect("Arrow punctuator", parser => {
                return is_arrow_token(parser.next_token);
            });
            parser.expect("Malformed arrow punctuator", parser => {
                return has_no_line_terminator(params, parser.next_token);
            });
        } else {
            const { keyword, args } = get_last_non_comment_node(parser);
            params        = parser.refine("arrow_parameters", args);
            async_keyword = keyword;

            parser.prepare_next_state("punctuator", true);
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
