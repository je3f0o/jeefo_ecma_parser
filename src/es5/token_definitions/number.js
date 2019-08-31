/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : number.js
* Created at  : 2019-03-05
* Updated at  : 2019-06-28
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

const hex_digits    = "0123456789abcdefABCDEF";
const hex_indicator = "xX";

function parse_hex_integer (streamer, start_index, length) {
    let next_character = streamer.at(start_index + length);

    while (next_character) {
        if (hex_digits.includes(next_character)) {
            length += 1;
            next_character = streamer.at(start_index + length);
        } else if (
            delimiters.includes(next_character) ||
            white_spaces.includes(next_character)
        ) {
            break;
        } else {
            throw new SyntaxError("Invalid or unexpected token");
        }
    }

    return length;
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
        } else if (
            delimiters.includes(next_character) ||
            white_spaces.includes(next_character)
        ) {
            break;
        } else {
            throw new SyntaxError("Invalid or unexpected token");
        }
    }

    return { length, is_potential_octal };
}

function parse_decimal (streamer, start_index, length) {
    let next_character = streamer.at(start_index + length);

    if (next_character === '.') {
        length += 1;
        next_character = streamer.at(start_index + length);

        while (next_character) {
            if (next_character >= '0' && next_character <= '9') {
                length += 1;
                next_character = streamer.at(start_index + length);
            } else {
                break;
            }
        }
    }

    if (next_character === 'e' || next_character === 'E') {
        length += 1;
        next_character = streamer.at(start_index + length);

        if (next_character === '-') {
            length += 1;
            next_character = streamer.at(start_index + length);
        }

        if (next_character < '0' && next_character > '9') {
            throw new SyntaxError("Invalid or unexpected token");
        }

        while (next_character) {
            if (next_character >= '0' && next_character <= '9') {
                length += 1;
                next_character = streamer.at(start_index + length);
            } else {
                break;
            }
        }
    }

    let is_invalid = next_character !== null;
    is_invalid &= ! delimiters.includes(next_character);
    is_invalid &= ! white_spaces.includes(next_character);

    if (is_invalid) {
        throw new SyntaxError("Invalid or unexpected token");
    }

    return length;
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
        const start = streamer.clone_cursor_position();

        let type, length;

        if (current_character === '0') {
            const next_character = streamer.get_next_character();

            if (hex_indicator.includes(next_character)) {
                type   = "Hex integer";
                length = parse_hex_integer(streamer, start.index, 2);
            } else {
                const result = parse_integer(streamer, start.index, 1);
                length = result.length;

                if (result.is_potential_octal) {
                    type = "Octal integer";

                    const next_character = streamer.at(start.index + length);
                    let is_invalid = next_character === '.' ||
                                     next_character === 'e' ||
                                     next_character === 'E';

                    is_invalid &= ! delimiters.includes(next_character) &&
                                  ! white_spaces.includes(next_character);

                    if (is_invalid) {
                        throw new SyntaxError("Invalid or unexpected token");
                    }
                } else {
                    type   = "Decimal";
                    length = parse_decimal(streamer, start.index, length);
                }
            }
        } else {
            length = 1;
            let next_character = streamer.at(start.index + length);

            while (next_character) {
                if (next_character >= '0' && next_character <= '9') {
                    length += 1;
                    next_character = streamer.at(start.index + length);
                } else if (
                    delimiters.includes(next_character) ||
                    white_spaces.includes(next_character)
                ) {
                    break;
                } else {
                    throw new SyntaxError("Invalid or unexpected token");
                }
            }

            type   = "Decimal";
            length = parse_decimal(streamer, start.index, length);
        }

        streamer.cursor.move(length - 1);

        token.value = streamer.substring_from_offset(start.index);
        token.type  = type;
        token.start = start;
        token.end   = streamer.clone_cursor_position();
    }
};
