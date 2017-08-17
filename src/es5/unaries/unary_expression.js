/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : unary_expression.js
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

var UnaryExpression = function () {};
UnaryExpression.prototype = {
	type            : "UnaryExpression",
	precedence      : 16,
	initialize      : require("../operator_initialzier"),
	null_denotation : function (scope) {
		var start = scope.current_token.start;
		scope.advance();

		this.argument  = scope.expression(16);
		this.is_prefix = true;
		this.start     = start;
		this.end       = this.argument.end;

		//console.log("UNARY", this, scope.current_expression);
		return this;
	},
	statement_denotation : require("../denotations/expression_statement_denotation")
};

module.exports = UnaryExpression;
