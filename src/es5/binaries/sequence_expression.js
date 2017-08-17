/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : sequence_expression.js
* Created at  : 2017-08-16
* Updated at  : 2017-08-17
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start

/* globals */
/* exported */

// ignore:end

var COMMA_PRECEDENCE = 1;

var SequenceExpression = function () {};
SequenceExpression.prototype = {
	type            : "SequenceExpression",
	precedence      : COMMA_PRECEDENCE,
	initialize      : require("../generic_initializer"),
	left_denotation : function (left, scope) {
		var expressions = this.expressions = [left], i = 1;

		this.start = left.start;

		scope.advance();

		LOOP:
		while (scope.current_expression && scope.current_expression.precedence) {
			expressions[i++] = scope.expression(COMMA_PRECEDENCE);

			if (scope.current_expression && scope.current_expression.precedence) {
				if (scope.current_token.delimiter === ',') {
					scope.advance();
				} else {
					scope.current_token.error_unexpected_token();
				}
			}
		}

		this.end = expressions[expressions.length - 1].end;

		return this;
	}
};

module.exports = {
	is          : function (token) { return token.delimiter === ','; },
	token_type  : "Delimiter",
	Constructor : SequenceExpression
};
