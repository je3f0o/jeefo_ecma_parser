/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : member_expression.js
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

var MemberExpression = function () {};
MemberExpression.prototype = {
	type       : "MemberExpression",
	precedence : 19,
	initialize : require("../generic_initializer"),
	left_denotation : function (left, scope) {
		this.object = left;

		scope.advance();

		while (scope.current_expression.type === "Comment") {
			scope.advance();
		}

		if (scope.current_token.type === "Identifier") {
			this.property    = scope.current_token;
			this.is_computed = false;
			this.start       = left.start;
			this.end         = this.property.end;

			scope.advance_binary();
		} else {
			console.log(22222222, scope.current_expression, scope.current_token);
			scope.current_token.error_unexpected_token();
		}

		return this;
	}
};

module.exports = {
	is          : function (token) { return token.operator === '.'; },
	token_type  : "Operator",
	Constructor : MemberExpression
};
