/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : new_expression.js
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

var NewExpression = function () {};
NewExpression.prototype = {
	type            : "NewExpression",
	precedence      : 18,
	initialize      : require("../generic_initializer"),
	null_denotation : function (scope) {
		var start = scope.current_token.start;

		scope.advance();
		this.callee       = scope.expression(18);
		this["arguments"] = [];
		this.start        = start;
		this.end          = this.callee.end;

		if (scope.current_expression && scope.current_expression.type === "CallExpression") {
			scope.current_expression.get_arguments(scope, this);
			this.precedence = 19;
		}

		scope.current_expression = this;

		return this;
	},
	statement_denotation : require("../denotations/expression_statement_denotation")
};

module.exports = {
	is          : function (token) { return token.name === "new"; },
	token_type  : "Identifier",
	Constructor : NewExpression
};
