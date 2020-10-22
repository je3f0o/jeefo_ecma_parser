/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : regular_expression_literal.js
* Created at  : 2019-03-26
* Updated at  : 2020-09-09
* Author      : jeefo
* Purpose     :
* Description :
* Reference   : https://www.ecma-international.org/ecma-262/5.1/#sec-7.8.5
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals*/
/* exported*/

// ignore:end

const delimiters                  = require("../token_definitions/delimiters");
const {PRIMITIVE}                 = require("../enums/precedence_enum");
const {expression}                = require("../enums/states_enum");
const {get_last_non_comment_node} = require("../../helpers/index");

const REGEX_FLAGS = "gimuy";
function parse_regular_expression_flags (parser) {
    let flags          = '',
        length         = 1,
        streamer       = parser.tokenizer.streamer,
        start_index    = streamer.cursor.position.index,
        next_character = streamer.at(start_index + length);

    while (next_character > ' ') {
        const is_valid_flag = REGEX_FLAGS.includes(next_character);
        if (is_valid_flag && ! flags.includes(next_character)) {
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
        streamer.cursor.move(length - 1);
    }

    return flags;
}

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
                parser.throw_unexpected_token(
                    "Invalid regular expression: missing ]"
                );
                break;
            case ']' :
                return length;
        }
        length += 1;
        next_character = streamer.at(start_index + length);
    }

    return length;
}

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
                parser.throw_unexpected_token(
                    "Invalid regular expression: missing /"
                );
                break;
            case '[' :
                length += parse_regular_expression_class(
                    parser, streamer.cursor.position.index + length
                );
                break;
            case '/' :
                break LOOP;
        }

        length += 1;
        next_character = streamer.at(start_index + length);
    }
    streamer.cursor.move(length);

    return streamer.substring_from_offset(start_index);
}

module.exports = {
    id         : "Regular expression literal",
    type       : "Primary expression",
    precedence : PRIMITIVE,

    is : ({id}, parser) =>
        parser.current_state === expression && id === "Slash" &&
        get_last_non_comment_node(parser) === null,

    initialize : (node, token, parser) => {
        node.pattern = parse_regular_expression(parser, token.start.index);
        node.flags = parse_regular_expression_flags(parser);
        node.start = token.start;
        node.end   = parser.tokenizer.streamer.clone_cursor_position();
    }
};
