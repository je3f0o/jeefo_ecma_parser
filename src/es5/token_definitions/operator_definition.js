/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : operator_definition.js
* Created at  : 2019-03-27
* Updated at  : 2019-06-28
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

module.exports = {
    id       : "Operator",
    priority : 20,

	is : (current_character, streamer) => {
		switch (current_character) {
			// Member operator
			case '.' :
			// Comparation operators
			case '!' :
			case '<' :
			case '>' :
			// Assignment and math operators
			case '=' :
			case '+' :
			case '-' :
			case '*' :
			case '%' :
			// Binary and unary operators
			case '&' :
			case '|' :
			case '^' :
			case '~' :
            // Ternary operator
			case '?' :
				return true;
            // divide assign operator
			case '/' :
				return streamer.is_next_character('=');
		}
	},

    initialize : (token, current_character, streamer) => {
        let length = 0;
        const start = streamer.clone_cursor_position();

        const iterative_operator = max_length => {
            for (let i = 1; i <= max_length; ++i) {
                const next_char = streamer.at(start.index + i);

                if (next_char === current_character && i < max_length) {
                    length += 1;
                } else if (next_char === '=') {
                    length += 1;
                    break;
                }
            }
        };

        switch (current_character) {
            // Operators:
            //     !   =
            //     !=  ==
            //     !== ===
            case '!' :
            case '=' :
                if (streamer.is_next_character('=')) {
                    length = 1;

                    if (streamer.at(start.index + 2) === '=') {
                        length = 2;
                    }
                }
                break;
            // Operators:
            //     &  |  +  -
            //     &= |= += -=
            //     && || ++ --
            case '&' :
            case '|' :
            case '+' :
            case '-' :
                const next_char = streamer.get_next_character();
                if (next_char === '=' || next_char === current_character) {
                    length = 1;
                }
                break;
            // Which is only divide assign operator /=
            // We already check it inside `is()` method
            case '/' :
                length = 1;
                break;

            // Operators:
            //     %  ^
            //     %= ^=
            case '%' :
            case '^' :
                if (streamer.is_next_character('=')) {
                    length = 1;
                }
                break;
            // Operators:
            //     *   <
            //     **  <<
            //     *=  <=
            //     **= <<=
            case '*' :
            case '<' :
                iterative_operator(2);
                break;
            // Operators:
            //     >
            //     >>
            //     >>>
            //     >=
            //     >>=
            //     >>>=
            case '>'  :
                iterative_operator(3);
                break;
        }

        if (length) {
            streamer.cursor.move(length);
        }

        token.value = streamer.substring_from_offset(start.index);
        token.start = start;
        token.end   = streamer.clone_cursor_position();
    },
};
