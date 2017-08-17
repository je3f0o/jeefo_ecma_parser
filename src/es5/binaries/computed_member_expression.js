/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : computed_member_expression.js
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

var MemberExpression = function () {};
MemberExpression.prototype = {
	type            : "MemberExpression",
	precedence      : 19,
	initialize      : require("../generic_initializer"),
	left_denotation : function (left, scope) {
		this.object = left;

		scope.advance();
		this.property = scope.expression(0);

		this.is_computed = true;

		if (scope.current_token.delimiter === ']') {
			this.start = left.start;
			this.end   = scope.current_token.end;

			scope.advance_binary();
		} else {
			scope.current_token.error_unexpected_token();
		}

		return this;
	}
};

module.exports = {
	is          : function (token) { return token.delimiter === '['; },
	token_type  : "Delimiter",
	Constructor : MemberExpression
};
