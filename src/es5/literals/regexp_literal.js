/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : regexp_literal.js
* Created at  : 2017-08-16
* Updated at  : 2017-08-18
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start

/* globals */
/* exported */

// ignore:end

var assign      = require("jeefo_utils/object/assign"),
	REGEX_FLAGS = "gimuy";

var RegExpLiteral = function () {};
RegExpLiteral.prototype = {
	type       : "RegExpLiteral",
	precedence : 31,
	initialize : function (token, scope) {
		var streamer    = scope.tokenizer.streamer,
			start       = streamer.get_cursor(),
			character   = streamer.next(),
			start_index = streamer.cursor.index, end, flags = '', pattern;

		while (character && character >= ' ' && character !== '/') {
			if (character === '\\') {
				streamer.next();
			}
			character = streamer.next();
		}

		pattern = streamer.seek(start_index);
		end = streamer.get_cursor();

		character = streamer.next();
		while (character && character > ' ') {
			if (REGEX_FLAGS.indexOf(character) !== -1 && flags.indexOf(character) === -1) {
				flags    += character;
				assign(end, streamer.cursor);
				character = streamer.next();
			} else if (token.DELIMITERS.indexOf(character) !== -1) {
				break;
			} else {
				token.error("Invalid regular expression flags");
			}
		}

		streamer.cursor = end;

		this.type  = this.type;
		this.regex = { pattern : pattern, flags : flags };
		this.start = start;
		this.end   = streamer.end_cursor();
	},
	statement_denotation : require("../denotations/expression_statement_denotation")
};

module.exports = {
	token_type  : "Slash",
	Constructor : RegExpLiteral
};
