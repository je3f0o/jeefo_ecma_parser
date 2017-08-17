/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : grouping_expression.js
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

var GroupingExpression = function () {};
GroupingExpression.prototype = {
	type       : "GroupingExpression",
	precedence : 20,
	initialize : require("../generic_initializer"),
	null_denotation : function (scope) {
		var start = scope.current_token.start;

		scope.advance();
		this.expression = scope.expression(0);

		if (scope.current_token.delimiter === ')') {
			this.start = start;
			this.end   = scope.current_token.end;

			scope.current_expression = this;
		} else {
			scope.current_token.error_unexpected_token();
		}

		return this;
	},
	statement_denotation : require("../denotations/expression_statement_denotation")
};

module.exports = {
	is          : function (token) { return token.delimiter === '('; },
	token_type  : "Delimiter",
	Constructor : GroupingExpression
};
