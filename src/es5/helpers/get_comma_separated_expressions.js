/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : get_comma_separated_expressions.js
* Created at  : 2019-03-22
* Updated at  : 2019-08-27
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

const { COMMA }              = require("../enums/precedence_enum");
const { is_delimiter_token } = require("../../helpers");
const {
    terminal_definition : terminal
} = require("../../common");

function get_comma_separated_expressions (parser, terminator) {
    const delimiters  = [];
    const expressions = [];
    parser.prepare_next_state("expression", true);

    LOOP :
    while (! is_delimiter_token(parser.next_token, terminator)) {
        expressions.push(parser.parse_next_node(COMMA));

        if (parser.next_token === null) {
            parser.throw_unexpected_end_of_stream();
        } else if (parser.next_token.id !== "Delimiter") {
            parser.throw_unexpected_token();
        }

        switch (parser.next_token.value) {
            case ',' :
                delimiters.push(terminal.generate_new_node(parser));
                parser.prepare_next_state("expression", true);
                break;
            case terminator : break LOOP;
            default: parser.throw_unexpected_token();
        }
    }

    return { delimiters, expressions };
}

module.exports = get_comma_separated_expressions;
