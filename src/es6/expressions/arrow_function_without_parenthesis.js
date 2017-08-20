/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : arrow_function_without_parenthesis.js
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
		//var	tokenizer = scope.tokenizer, next      = tokenizer.next(true);
		// TODO: handle comments...
		//while (next && next.type === "Comment") { next = tokenizer.next(); }

		scope.advance("=>");
		scope.advance('{');

		this.type       = this.type;
		this.parameters = [token];
		this.body       = scope.current_expression.statement_denotation(scope);
		this.start      = token.start;
		this.end        = this.body.end;
	},
	statement_denotation : require("../../es5/denotations/expression_statement_denotation")
};

module.exports = {
	is : function (token, scope) {
		var	tokenizer = scope.tokenizer,
			cursor    = tokenizer.streamer.get_cursor(),
			next      = tokenizer.next(true);

		// TODO: handle comments...

		tokenizer.streamer.cursor = cursor;

		return next && next.operator === "=>";
	},
	token_type  : "Identifier",
	Constructor : ArrowFunctionExpression
};
