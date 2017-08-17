/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : do_while_statement.js
* Created at  : 2017-08-17
* Updated at  : 2017-08-17
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start

/* globals */
/* exported */

// ignore:end

var DoWhileStatement = function () {};
DoWhileStatement.prototype = {
	type                 : "DoWhileStatement",
	precedence           : 31,
	initialize           : require("../generic_initializer"),
	statement_denotation : function (scope) {
		var start = scope.current_token.start, end;

		scope.advance();

		this.statement = scope.current_expression.statement_denotation(scope);

		scope.advance("name", "while");
		scope.advance('(');
		scope.advance();

		this.test = scope.expression(0);

		if (scope.current_token.value === ')') {
			end = scope.current_token.end;
			scope.advance();
		}

		if (! scope.current_token) {
			this.ASI   = true;
			this.start = start;
			this.end   = end;
		} else if (end.column === 0 || scope.current_token.start.line > end.line) {
			scope.tokenizer.streamer.cursor.index = scope.current_token.start.index - 1;
			this.ASI   = true;
			this.start = start;
			this.end   = end;
		} else if (scope.current_token.delimiter === ';') {
			this.ASI   = false;
			this.start = start;
			this.end   = scope.current_token.end;
		} else {
			scope.current_token.error();
		}

		return this;
	}
};

module.exports = {
	is          : function (token) { return token.name === "do"; },
	token_type  : "Identifier",
	Constructor : DoWhileStatement
};
