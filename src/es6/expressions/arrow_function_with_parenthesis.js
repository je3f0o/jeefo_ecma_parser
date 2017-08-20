/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : arrow_function_with_parenthesis.js
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

var ArrowFunctionExpression = function () {};
ArrowFunctionExpression.prototype = {
	type       : "ArrowFunctionExpression",
	precedence : 21,
	initialize : function (token, scope) {
		scope.tokenizer.streamer.cursor.index -= 1;
		scope.advance_binary();

		this.type       = this.type;
		this.parameters = scope.current_expression.get_params(scope);

		scope.advance("=>");
		scope.advance('{');

		this.body  = scope.current_expression.statement_denotation(scope);
		this.start = token.start;
		this.end   = this.body.end;
	},
	statement_denotation : require("../../es5/denotations/expression_statement_denotation")
};

module.exports = {
	is : function (token, scope) {
		if (token.delimiter === '(') {
			var	tokenizer = scope.tokenizer,
				cursor    = tokenizer.streamer.get_cursor(),
				next      = tokenizer.next();

			while (next && next.delimiter !== ')') {
				next = tokenizer.next();
			}

			// TODO: handle comments...

			next                      = tokenizer.next(true);
			tokenizer.streamer.cursor = cursor;

			return next && next.operator === "=>";
		}
	},
	token_type  : "Delimiter",
	Constructor : ArrowFunctionExpression
};
