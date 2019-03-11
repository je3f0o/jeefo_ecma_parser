/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : slash_notation.js
* Created at  : 2019-01-27
* Updated at  : 2019-01-29
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

const REGEX_FLAGS = "gimuy";

module.exports = {
    id         : "RegExp literal",
    type       : "RegExp literal",
    precedence : 31,

    is             : token => token.type === "Slash",
    get_precedence : current_symbol => {
        if (current_symbol && current_symbol.id !== "Assignment operator") {
            return 14;
        }
        return 31;
    },
    initialize : (symbol, current_token, parser) => {
        if (parser.current_symbol && parser.current_symbol.id !== "Assignment operator") {
            symbol.id         = "Arithmetic operator";
            symbol.precedence = 14;
            symbol.operator   = '/';

            symbol.left           = parser.current_symbol;
            parser.current_symbol = symbol;

            parser.prepare_next_symbol_definition();
            symbol.right = parser.get_next_symbol(symbol.precedence);

            symbol.start = current_token.start;
            symbol.end   = current_token.end;

            return;
        }

        const streamer = parser.tokenizer.streamer,
              start    = streamer.get_cursor();

        let current_character = streamer.next();
        const start_index = streamer.cursor.index;

        while (current_character && current_character >= ' ' && current_character !== '/') {
            if (current_character === '\\') {
                streamer.next();
            }
            current_character = streamer.next();
        }
        if (current_character !== '/') {
            throw new SyntaxError("Invalid regular expression: missing /");
        }

        symbol.pattern = streamer.seek(start_index);
        let flags          = '',
            next_character = streamer.peek(streamer.cursor.index + 1);

        while (next_character && next_character > ' ') {
            if (REGEX_FLAGS.includes(next_character) && ! flags.includes(next_character)) {
                flags         += streamer.next();
                next_character = streamer.peek(streamer.cursor.index + 1);
            } else if (current_token.DELIMITERS.includes(next_character)) {
                break;
            } else {
                throw new SyntaxError("Invalid regular expression flags");
            }
        }

        symbol.flags = flags || null;
        symbol.start = start;
        symbol.end   = streamer.end_cursor();

        parser.prepare_next_symbol_definition();
    }
};
