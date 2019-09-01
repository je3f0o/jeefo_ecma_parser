/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : variable_declaration_list_no_in.js
* Created at  : 2019-08-30
* Updated at  : 2019-09-01
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

const { DECLARATION }                   = require("../enums/precedence_enum");
const { is_comma, is_terminator }       = require("../../helpers");
const {variable_declaration_list_no_in} = require("../enums/states_enum");
const {
    error_reporter : { invalid_left_hand_ForIn_or_ForOf }
} = require("../helpers");

module.exports = {
    id         : "Variable declaration list no in",
    type       : "Declaration",
    precedence : DECLARATION,

    is : (token, parser) => {
        return parser.current_state === variable_declaration_list_no_in;
    },
    initialize : (node, token, parser) => {
        const { keyword, prev_node } = parser.prev_node;

        parser.change_state("variable_declaration_no_in");
        const list       = [parser.generate_next_node()];
        const delimiters = [];

        parser.prev_node = prev_node;
        if (parser.next_token === null) {
            parser.throw_unexpected_end_of_stream();
        } else if (is_comma(parser)) {
            parser.change_state("delimiter");
            delimiters.push(parser.generate_next_node());
            parser.prepare_next_state("variable_declaration_no_in", true);

            while (! is_terminator(parser)) {
                list.push(parser.generate_next_node());

                if (parser.next_token === null) {
                    parser.throw_unexpected_end_of_stream();
                } else if (parser.next_token.id === "Delimiter") {
                    if (parser.next_token.value === ',') {
                        parser.change_state("delimiter");
                        delimiters.push(parser.generate_next_node());
                        parser.prepare_next_state(
                            "variable_declaration_no_in", true
                        );
                    }
                } else {
                    invalid_left_hand_ForIn_or_ForOf(parser, list);
                }
            }
        } else {
            parser.change_state("delimiter");
        }

        parser.expect(';', is_terminator);
        const terminator = parser.generate_next_node();

        node.keyword    = keyword;
        node.list       = list;
        node.delimiters = delimiters;
        node.terminator = terminator;
        node.start      = keyword.start;
        node.end        = terminator.end;
    }
};
