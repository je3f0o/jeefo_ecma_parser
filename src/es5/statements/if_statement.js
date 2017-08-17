/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : if_statement.js
* Created at  : 2017-08-17
* Updated at  : 2017-08-18
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start

/* globals */
/* exported */

// ignore:end

var IfStatement = function () {};
IfStatement.prototype = {
	type                 : "IfStatement",
	precedence           : 31,
	initialize           : require("../generic_initializer"),
	statement_denotation : function (scope) {
		var	start = scope.current_token.start;

		scope.advance('(');
		scope.advance();
		this.test = scope.expression(0);
		scope.advance();

		this.statement = scope.current_expression.statement_denotation(scope);

		var token    = scope.current_token,
			streamer = scope.tokenizer.streamer,
			cursor   = streamer.get_cursor();

		scope.advance();
		if (scope.current_expression && scope.current_expression.name === "else") {
			scope.advance();

			this.alternate = scope.current_expression.statement_denotation(scope);
		} else {
			this.alternate      = null;
			streamer.cursor     = cursor;
			scope.current_token = token;
		}

		this.start = start;
		this.end   = (this.alternate || this.statement).end;

		return this;
	}
};

module.exports = {
	is          : function (token) { return token.name === "if"; },
	token_type  : "Identifier",
	Constructor : IfStatement
};
