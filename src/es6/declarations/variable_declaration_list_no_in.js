/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : variable_declaration_list_no_in.js
* Created at  : 2019-08-30
* Updated at  : 2019-08-30
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
const { terminal_definition }           = require("../../common");
const {variable_declaration_list_no_in} = require("../enums/states_enum");
const {
    is_terminator,
    is_delimiter_token,
} = require("../../helpers");

const invalid_next_operator = ["in", "of"];
const is_invalid_next_operator = token => {
    if (token.id === "Identifier") {
        return invalid_next_operator.includes(token.value);
    }
};

const report_error = (parser, list) => {
    if (is_invalid_next_operator(parser.next_token)) {
        const error_message = `Invalid left-hand side in for-${
            parser.next_token.value
        } loop: Must have a single binding.`;

        parser.throw_unexpected_token(error_message, {
            start : list[0].start,
            end   : list[list.length - 1].end
        });
    } else {
        parser.throw_unexpected_token();
    }
};

module.exports = {
    id         : "Variable declaration list no in",
    type       : "Declaration",
    precedence : DECLARATION,

    is : (token, parser) => {
        return parser.current_state === variable_declaration_list_no_in;
    },
    initialize : (node, token, parser) => {
        const { keyword, prev_node, declaration } = parser.prev_node;
        const list       = [declaration];
        const delimiters = [];

        parser.prev_node = prev_node;

        if (parser.next_token === null) {
            parser.throw_unexpected_end_of_stream();
        } else if (is_delimiter_token(parser.next_token, ',')) {
            delimiters.push(terminal_definition.generate_new_node(parser));
            parser.prepare_next_state("variable_declaration_no_in", true);

            while (! is_terminator(parser)) {
                list.push(parser.generate_next_node());

                if (parser.next_token === null) {
                    parser.throw_unexpected_end_of_stream();
                } else if (parser.next_token.id === "Delimiter") {
                    if (parser.next_token.value === ',') {
                        delimiters.push(
                            terminal_definition.generate_new_node(parser)
                        );
                        parser.prepare_next_state(
                            "variable_declaration_no_in", true
                        );
                    }
                } else {
                    report_error(parser, list);
                }
            }
        }

        parser.expect(';', is_terminator);
        const terminator = terminal_definition.generate_new_node(parser);

        node.keyword    = keyword;
        node.list       = list;
        node.delimiters = delimiters;
        node.terminator = terminator;
        node.start      = keyword.start;
        node.end        = terminator.end;
    }
};
