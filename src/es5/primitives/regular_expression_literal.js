/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : regular_expression_literal.js
* Created at  : 2019-03-26
* Updated at  : 2019-03-27
* Author      : jeefo
* Purpose     :
* Description :
* Reference   :
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

const delimiters      = require("../token_definitions/delimiters"),
      is_expression   = require("../helpers/is_expression"),
      precedence_enum = require("../enums/precedence_enum");

// {{{1 parse_regular_expression_flags(parser)
const REGEX_FLAGS = "gimuy";
function parse_regular_expression_flags (parser) {
    let flags          = '',
        length         = 1,
        streamer       = parser.tokenizer.streamer,
        start_index    = streamer.cursor.index,
        next_character = streamer.at(start_index + length);

    while (next_character > ' ') {
        if (REGEX_FLAGS.includes(next_character) && ! flags.includes(next_character)) {
            flags += next_character;
        } else if (delimiters.includes(next_character)) {
            break;
        } else {
            parser.throw_unexpected_token("Invalid regular expression flags");
        }

        length += 1;
        next_character = streamer.at(start_index + length);
    }

    if (flags) {
        streamer.move_cursor(length - 1);
    }

    return flags;
}

// {{{1 parse_regular_expression_class(parser, start_index)
function parse_regular_expression_class (parser, start_index) {
    let length         = 1,
        streamer       = parser.tokenizer.streamer,
        next_character = streamer.at(start_index + length);

    LOOP:
    while (true) {
        switch (next_character) {
            case null :
                return parser.throw_unexpected_end_of_stream();
            case '\\' :
                length += 1;
                break;
            case '\n' :
                parser.throw_unexpected_token("Invalid regular expression: missing ]");
                break;
            case ']' :
                return length;
        }
        length += 1;
        next_character = streamer.at(start_index + length);
    }

    return length;
}

// {{{1 parse_regular_expression(parser, start_index)
function parse_regular_expression (parser, start_index) {
    let length         = 1,
        streamer       = parser.tokenizer.streamer,
        next_character = streamer.at(start_index + length);

    LOOP:
    while (true) {
        switch (next_character) {
            case null :
                return parser.throw_unexpected_end_of_stream();
            case '\\' :
                length += 1;
                break;
            case '\n' :
                parser.throw_unexpected_token("Invalid regular expression: missing /");
                break;
            case '[' :
                length += parse_regular_expression_class(parser, streamer.cursor.index + length);
                break;
            case '/' :
                break LOOP;
        }

        length += 1;
        next_character = streamer.at(start_index + length);
    }
    streamer.move_cursor(length);

    return streamer.substring_from(start_index);
}
// }}}1

module.exports = {
    id         : "Regular expression literal",
    type       : "Primitive",
    precedence : precedence_enum.PRIMITIVE,

    is : (token, parser) => {
        return token.value === '/'
            && parser.current_symbol === null
            && is_expression(parser);
    },
    initialize : (symbol, current_token, parser) => {
        symbol.pattern = parse_regular_expression(parser, current_token.start.index);
        symbol.flags   = parse_regular_expression_flags(parser);
        symbol.start   = current_token.start;
        symbol.end     = parser.tokenizer.streamer.get_cursor();
    }
};
