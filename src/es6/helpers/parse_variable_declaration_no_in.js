/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : parse_variable_declaration_no_in.js
* Created at  : 2019-08-29
* Updated at  : 2019-08-29
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

const valid_delimiters = [',', ';'];

module.exports = parser => {
    parser.change_state("expression_no_in");

    LOOP:
    while (parser.next_token) {
        parser.set_prev_node(parser.generate_next_node());
        parser.prepare_next_node_definition();

        if (! parser.next_token) {
            parser.throw_unexpected_end_of_stream();
        }

        switch (parser.next_node_definition.id) {
            case "Assignment expression" :
                if (parser.next_token.value !== '=') {
                    parser.throw_unexpected_token();
                }
                break LOOP;
            case "Delimiter" :
                if (! valid_delimiters.includes(parser.next_token.value)) {
                    parser.throw_unexpected_token();
                }
                break LOOP;
            case "Identifier" :
                if (parser.next_token.value !== "of") {
                    parser.throw_unexpected_token();
                }
                break LOOP;
            default:
                parser.throw_unexpected_token();
        }
    }

    return parser.prev_node;
};
