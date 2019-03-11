/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : ignore_comments.js
* Created at  : 2019-01-27
* Updated at  : 2019-02-25
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

module.exports = function ignore_comments (parser) {
	while (parser.next_token) {
        if (parser.next_symbol_definition === null) { break; }

        if (parser.next_symbol_definition.id === "Comment") {
            parser.current_symbol = parser.next_symbol_definition.generate_new_symbol(parser);
            parser.previous_symbols.push(parser.current_symbol);

            parser.prepare_next_symbol_definition();
        } else {
            break;
        }
	}
};
