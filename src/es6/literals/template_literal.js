/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : template_literal.js
* Created at  : 2017-08-19
* Updated at  : 2017-08-20
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start

/* globals */
/* exported */

// ignore:end

var generic_initializer = require("../../es5/generic_initializer");

var TemplateLiteralString = function (start, end, value) {
	this.initialize();
	this.value = value;
	this.start = start;
	this.end   = end;
},
TemplateLiteralExpression = function (start, expression) {
	this.initialize();
	this.expression = expression;
	this.start      = start;
};

TemplateLiteralString.prototype = {
	type       : "TemplateLiteralString",
	precedence : 31,
	initialize : generic_initializer
};

TemplateLiteralExpression.prototype = {
	type       : "TemplateLiteralExpression",
	precedence : 31,
	initialize : generic_initializer
};

var TemplateLiteral = function () {};
TemplateLiteral.prototype = {
	type       : "TemplateLiteral",
	precedence : 21,
	initialize : function (token, scope) {
		var	streamer  = scope.tokenizer.streamer,
			character = streamer.next(),
			start     = token.end, i = 0, body = [];

		LOOP:
		while (character) {
			switch (character) {
				case '\\':
					streamer.move_right(1);
					character = streamer.next();
					break;
				case '$' :
					if (streamer.peek(streamer.cursor.index + 1) === '{') {
						if (streamer.cursor.index > start.index) {
							body[i++] = new TemplateLiteralString(
								start,
								streamer.get_cursor(),
								streamer.seek(start.index)
							);
						}

						start = streamer.get_cursor();
						streamer.move_right(1);
						scope.advance();

						body[i++] = new TemplateLiteralExpression(start, scope.expression(0));

						if (scope.current_token.delimiter === '}') {
							body[i - 1].end = scope.current_token.end;

							character = streamer.next();
							start     = streamer.get_cursor();
						} else {
							throw new Error("WTF");
						}
					} else {
						character = streamer.next();
					}
					break;
				case '`':
					if (streamer.cursor.index > start.index) {
						body[i++] = new TemplateLiteralString(
							start,
							streamer.get_cursor(),
							streamer.seek(start.index)
						);
					}
					break LOOP;
				default:
					character = streamer.next();
			}
		}

		this.type  = this.type;
		this.body  = body;
		this.start = token.start;
		this.end   = streamer.end_cursor();
	},
	statement_denotation : require("../../es5/denotations/expression_statement_denotation")
};

module.exports = {
	token_type  : "BackTick",
	Constructor : TemplateLiteral
};
