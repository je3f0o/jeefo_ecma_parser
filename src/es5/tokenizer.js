/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : tokenizer.js
* Created at  : 2017-04-08
* Updated at  : 2019-03-08
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

const Tokenizer  = require("jeefo_tokenizer"),
	  DELIMITERS = [
          '.', ',',
          '/', '?',
          ';', ':',
          "'", '"',
          '`', '~',
          '-',
          '=', '+',
          '\\', '|', 
          '(', ')',
          '[', ']',
          '{', '}',
          '<', '>',
          '!', '@', '#', '%', '^', '&', '*',
	  ].join(''),

	  es5_tokenizer = new Tokenizer();

es5_tokenizer.
// Identifier {{{1
register({
    id       : "Identifier",
    priority : 0,

    is         : () => true,
    initialize : (token, current_character, streamer) => {
        const start = streamer.get_cursor();
        let length = 1;

        while (true) {
            let next_character = streamer.at(start.index + length);
            if (next_character === null || next_character <= ' ' || DELIMITERS.includes(next_character)) {
                break;
            }

            length += 1;
        }

        streamer.move_cursor(length - 1);

        token.value = streamer.substring_from(start.index);
        token.start = start;
        token.end   = streamer.get_cursor();
    },
}).

// Operator {{{1
register({
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
				return true;
            // division operator
            // TODO: think about rule. it is not following ecma specs
			case '/' :
				return streamer.at(streamer.cursor.index + 1) === '=';
		}
	},

    initialize : (token, current_character, streamer) => {
        let length = 0;
        const start         = streamer.get_cursor();
        const current_index = streamer.cursor.index;

        switch (current_character) {
            // Operators:
            //     !   =
            //     !=  ==
            //     !== ===
            case '!' :
            case '=' :
                if (streamer.at(current_index + 1) === '=') {
                    length = 1;

                    if (streamer.at(current_index + 2) === '=') {
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
                const next_character = streamer.at(current_index + 1);
                if (next_character === '=' || next_character === current_character) {
                    length = 1;
                }
                break;
            // Operators:
            //     /  %  ^
            //     /= %= ^=
            case '/' :
            case '%' :
            case '^' :
                if (streamer.at(current_index + 1) === '=') {
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
            streamer.move_cursor(length);
        }

        token.value = streamer.substring_from(current_index);
        token.start = start;
        token.end   = streamer.get_cursor();

        // jshint latedef : false
        function iterative_operator (max_length) {
            for (let i = 1; i <= max_length; ++i) {
                const next_character = streamer.at(current_index + i);

                if (next_character === current_character && i < max_length) {
                    length += 1;
                } else if (next_character === '=') {
                    length += 1;
                    break;
                }
            }
        }
        // jshint latedef : true
    },
});

/*
// Slash {{{1
register({
	is : function (character, streamer) {
		if (character === '/') {
			switch (streamer.peek(streamer.cursor.index + 1)) { case '*' : case '=' : case '/' : return false; }
			return true;
		}
	},
	protos : {
		type       : "Slash",
		precedence : 50,
		DELIMITERS : DELIMITERS,
		initialize : function (character, streamer) {
			this.type  = this.type;
			this.start = streamer.get_cursor();
			this.end   = streamer.end_cursor();
		},
	},
});
// }}}1
*/

es5_tokenizer.register(require("./token_definitions/delimiter_definition"));
es5_tokenizer.register(require("./token_definitions/comment"));
es5_tokenizer.register(require("./token_definitions/string"));
es5_tokenizer.register(require("./token_definitions/number"));

module.exports = es5_tokenizer;
