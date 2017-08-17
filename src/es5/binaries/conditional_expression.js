/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : conditional_expression.js
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

var COMMA_PRECEDENCE = 1;

var ConditionalExpression = function () {};
ConditionalExpression.prototype = {
	type            : "ConditionalExpression",
	precedence      : 4,
	initialize      : require("../generic_initializer"),
	left_denotation : function (left, scope) {
		this.test = left;

		scope.advance();

		while (scope.current_token.type === "Comment") {
			scope.advance();
		}

		this.consequent = scope.expression(0);

		if (scope.current_token.delimiter === ':') {
			scope.advance();

			while (scope.current_token.type === "Comment") {
				scope.advance();
			}

			this.alternate = scope.expression(COMMA_PRECEDENCE);
		} else {
			scope.current_token.error_unexpected_token();
		}

		this.start = left.start;
		this.end   = this.alternate.end;

		return this;
	}
};

module.exports = {
	is          : function (token) { return token.delimiter === '?'; },
	token_type  : "Delimiter",
	Constructor : ConditionalExpression
};
