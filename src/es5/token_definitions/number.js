/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : number.js
* Created at  : 2019-03-05
* Updated at  : 2020-10-07
* Author      : jeefo
* Purpose     :
* Description :
* Reference   : https://www.ecma-international.org/ecma-262/5.1/#sec-7.8.3
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals*/
/* exported*/

// ignore:end

const delimiters   = require("./delimiters");
const white_spaces = require("./white_spaces");

const hex_digits         = "0123456789abcdefABCDEF";
const hex_indicator      = "xX";
const exponent_indicator = "eE";

function parse_hex_integer (streamer, start_index, offset) {
    let next_character = streamer.at(start_index + offset);

    while (next_character) {
        if (hex_digits.includes(next_character)) {
            offset += 1;
            next_character = streamer.at(start_index + offset);
        } else if (
            delimiters.includes(next_character) ||
            white_spaces.includes(next_character)
        ) {
            break;
        } else {
            throw new SyntaxError("Invalid or unexpected token");
        }
    }

    return offset;
}

function parse_integer (streamer, start_index, length) {
    let next_character     = streamer.at(start_index + length),
        is_potential_octal = next_character >= '0' && next_character <= '7';

    while (next_character) {
        if (next_character >= '0' && next_character <= '9') {
            if (next_character > '7') {
                is_potential_octal = false;
            }

            length += 1;
            next_character = streamer.at(start_index + length);
        } else {
            break;
        }
    }

    return { length, is_potential_octal };
}

function parse_decimal_integer_literal (streamer, start_index, offset) {
    let next_character = streamer.at(start_index + offset);

    while (next_character) {
        if (next_character >= '0' && next_character <= '9') {
            offset += 1;
            next_character = streamer.at(start_index + offset);
        } else {
            break;
        }
    }

    return offset;
}

function parse_signed_integer (streamer, start_index, offset) {
    let next_character = streamer.at(start_index + offset);

    if (next_character === '-' || next_character === '+') {
        offset += 1;
    }

    return parse_decimal_integer_literal(streamer, start_index, offset);
}

function parse_decimal (streamer, start_index, offset) {
    let next_char = streamer.at(start_index + offset), is_exponent;

    if (next_char === '.') {
        offset += 1;
        next_char = streamer.at(start_index + offset);
        if (next_char >= '0' && next_char <= '9') {
            offset = parse_decimal_integer_literal(
                streamer, start_index, offset + 1
            );
            next_char = streamer.at(start_index + offset);
        }
    }

    if (exponent_indicator.includes(next_char)) {
        is_exponent = true;
        offset = parse_signed_integer(
            streamer, start_index, offset + 1
        );
    }

    return { offset, is_exponent };
}

module.exports = {
    id       : "Number",
    priority : 10,

    is : (current_character, streamer) => {
        if (current_character >= '0' && current_character <= '9') {
            return true;
        } else if (current_character === '.') {
            const next_character = streamer.get_next_character();
            return next_character >= '0' && next_character <= '9';
        }
    },

    initialize : (token, current_character, streamer) => {
        let type, offset, is_decimal;
        const start = streamer.clone_cursor_position();

        if (current_character === '.') {
            offset = parse_decimal_integer_literal(streamer, start.index, 1);
            const next_char = streamer.at(start.index + offset);
            if (exponent_indicator.includes(next_char)) {
                type = "Exponent";
                offset = parse_signed_integer(streamer, start.index, 2);
            } else {
                type = "Decimal";
            }
        } else if (current_character === '0') {
            let next_char = streamer.get_next_character();

            if (next_char === null) {
                offset     = 1;
                is_decimal = true;
            } else if (hex_indicator.includes(next_char)) {
                type   = "Hex integer";
                offset = parse_hex_integer(streamer, start.index, 2);
            } else if (exponent_indicator.includes(next_char)) {
                type = "Exponent";
                offset = parse_signed_integer(streamer, start.index, 2);
            } else {
                const result = parse_integer(streamer, start.index, 1);
                offset = result.length;

                if (result.is_potential_octal) {
                    type = "Octal integer";

                    next_char = streamer.at(start.index + offset);
                    let is_valid = (
                        next_char !== '.' &&
                        (
                            delimiters.includes(next_char) ||
                            white_spaces.includes(next_char)
                        )
                    );
                    if (! is_valid) {
                        throw new SyntaxError("Invalid or unexpected token");
                    }
                } else {
                    is_decimal = true;
                }
            }
        } else {
            offset = parse_decimal_integer_literal(streamer, start.index, 1);
            is_decimal = true;
        }

        if (is_decimal) {
            const result = parse_decimal(streamer, start.index, offset);
            offset = result.offset;

            if (result.is_exponent) {
                type = "Exponent";
            } else {
                type = "Decimal";
            }

            const next_char = streamer.at(start.index + offset);
            if (next_char) {
                const is_valid = (
                    delimiters.includes(next_char) ||
                    white_spaces.includes(next_char)
                );
                if (! is_valid) {
                    throw new SyntaxError("Invalid or unexpected token");
                }
            }
        }

        streamer.cursor.move(offset - 1);

        token.value = streamer.substring_from_offset(start.index);
        token.type  = type;
        token.start = start;
        token.end   = streamer.clone_cursor_position();
    }
};
