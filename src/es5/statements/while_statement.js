/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : while_statement.js
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

var WhileStatement = function () {};
WhileStatement.prototype = {
	type       : "WhileStatement",
	precedence : 31,
	initialize : require("../generic_initializer"),
	statement_denotation : function (scope) {
		var start = scope.current_token.start;

		scope.advance('(');
		scope.advance();
		this.test = scope.expression(0);

		if (scope.current_token.value === ')') {
			scope.advance();
		} else {
			scope.current_token.error_unexpected_token();
		}

		this.statement = scope.current_expression.statement_denotation(scope); 

		this.start = start;
		this.end   = this.statement.end;

		return this;
	}
};

module.exports = {
	is          : function (token) { return token.name === "while"; },
	token_type  : "Identifier",
	Constructor : WhileStatement
};
