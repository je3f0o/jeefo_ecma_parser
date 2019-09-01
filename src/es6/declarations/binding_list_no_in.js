/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : binding_list_no_in.js
* Created at  : 2019-09-01
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

const { DECLARATION }             = require("../enums/precedence_enum");
const { binding_list_no_in }      = require("../enums/states_enum");
const { is_comma, is_terminator } = require("../../helpers");
const {
    error_reporter : { invalid_left_hand_ForIn_or_ForOf }
} = require("../helpers");

module.exports = {
    id         : "Binding list no in",
    type       : "DECLARATION",
    precedence : DECLARATION,

    is         : (_, parser) => parser.current_state === binding_list_no_in,
    initialize : (node, token, parser) => {
        const { prev_node } = parser.prev_node;

        parser.change_state("lexical_binding_no_in");
        const list       = [parser.generate_next_node()];
        const delimiters = [];

        parser.prev_node = prev_node;
        if (parser.next_token === null) {
            parser.throw_unexpected_end_of_stream();
        } else if (is_comma(parser)) {
            parser.change_state("delimiter");
            delimiters.push(parser.generate_next_node());
            parser.prepare_next_state("lexical_binding_no_in", true);

            while (! is_terminator(parser)) {
                list.push(parser.generate_next_node());

                if (parser.next_token === null) {
                    parser.throw_unexpected_end_of_stream();
                } else if (parser.next_token.id === "Delimiter") {
                    if (parser.next_token.value === ',') {
                        parser.change_state("delimiter");
                        delimiters.push(parser.generate_next_node());
                        parser.prepare_next_state(
                            "lexical_binding_no_in", true
                        );
                    }
                } else {
                    invalid_left_hand_ForIn_or_ForOf(parser, list);
                }
            }
        } else {
            parser.change_state("delimiter");
        }

        node.list       = list;
        node.delimiters = delimiters;
        node.start      = list[0].start;
        node.end        = list[list.length - 1].end;
    }
};
